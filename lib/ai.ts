import OpenAI from 'openai';
import {
  EXPENSE_CATEGORIES,
  PAYMENT_METHODS,
  formatMoney,
  normalizeInrCurrency,
} from '@/lib/expenseMeta';

interface RawInsight {
  type?: string;
  title?: string;
  message?: string;
  action?: string;
  confidence?: number;
}

function getApiKey() {
  return process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || '';
}

function getOpenAI() {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error(
      'Missing OPENROUTER_API_KEY. Add it to .env / .env.local and restart the server.'
    );
  }

  return new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey,
    defaultHeaders: {
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'X-Title': 'Nexpend',
    },
  });
}

const TEXT_MODELS = [
  'google/gemini-2.5-flash-lite',
  'qwen/qwen3.5-flash-02-23',
  'deepseek/deepseek-chat-v3-0324',
  'google/gemma-4-26b-a4b-it:free',
];

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

async function chatCompletion(options: {
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
}): Promise<string> {
  const openai = getOpenAI();
  let lastError: unknown;

  for (const model of TEXT_MODELS) {
    try {
      const completion = await openai.chat.completions.create({
        model,
        messages: options.messages,
        temperature: options.temperature ?? 0.5,
        max_tokens: options.max_tokens ?? 400,
        // @ts-expect-error OpenRouter-specific routing hint
        provider: { sort: 'latency' },
      });

      const content = completion.choices[0]?.message?.content?.trim();
      if (content) {
        return content;
      }
    } catch (error) {
      lastError = error;
      console.warn(`Text model failed (${model}):`, error);
    }
  }

  if (lastError instanceof Error) {
    throw lastError;
  }
  throw new Error('No response from AI');
}


export interface ExpenseRecord {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface AIInsight {
  id: string;
  type: 'warning' | 'info' | 'success' | 'tip';
  title: string;
  message: string;
  action?: string;
  confidence: number;
}

function formatAmountForAI(amount: number): string {
  return formatMoney(amount);
}

const INR_SYSTEM_RULE =
  'The user is in India. All money is in Indian Rupees (INR). Always use the ₹ symbol and en-IN number formatting. Never use $, USD, or dollars.';

function fallbackCategory(description: string): string {
  const text = description.toLowerCase();
  if (/coffee|food|lunch|dinner|restaurant|grocery|pizza|cafe|snack/.test(text)) {
    return 'Food';
  }
  if (/uber|ola|taxi|fuel|petrol|diesel|bus|metro|train|flight|cab/.test(text)) {
    return 'Transportation';
  }
  if (/movie|netflix|game|concert|spotify|entertainment/.test(text)) {
    return 'Entertainment';
  }
  if (/amazon|flipkart|clothes|shopping|mall|store/.test(text)) {
    return 'Shopping';
  }
  if (/rent|electricity|wifi|internet|bill|recharge|utility/.test(text)) {
    return 'Bills';
  }
  if (/doctor|medicine|hospital|pharmacy|clinic|health/.test(text)) {
    return 'Healthcare';
  }
  return 'Other';
}

export async function generateExpenseInsights(
  expenses: ExpenseRecord[]
): Promise<AIInsight[]> {
  try {
    if (!getApiKey()) {
      return [
        {
          id: 'fallback-key',
          type: 'info',
          title: 'AI key not configured',
          message:
            'Add OPENROUTER_API_KEY to your .env file to enable personalized insights.',
          action: 'Add API key',
          confidence: 1,
        },
      ];
    }

    const expensesSummary = expenses.map((expense) => ({
      amount: expense.amount,
      amountInr: formatAmountForAI(expense.amount),
      category: expense.category,
      description: expense.description,
      date: expense.date,
    }));

    const prompt = `Analyze the following expense data and provide 3-4 actionable financial insights.
    All amounts are in Indian Rupees (INR) — use ₹ in every message.
    Return a JSON array of insights with this structure:
    {
      "type": "warning|info|success|tip",
      "title": "Brief title",
      "message": "Detailed insight message with specific numbers when possible",
      "action": "Actionable suggestion",
      "confidence": 0.8
    }

    Expense Data:
    ${JSON.stringify(expensesSummary, null, 2)}

    Focus on:
    1. Spending patterns (day of week, categories)
    2. Budget alerts (high spending areas)
    3. Money-saving opportunities
    4. Positive reinforcement for good habits

    Return only valid JSON array, no additional text.`;

    const response = await chatCompletion({
      messages: [
        {
          role: 'system',
          content: `${INR_SYSTEM_RULE} You analyze spending patterns and provide actionable insights. Always respond with valid JSON only.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    let cleanedResponse = response.trim();
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse
        .replace(/^```json\s*/, '')
        .replace(/\s*```$/, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse
        .replace(/^```\s*/, '')
        .replace(/\s*```$/, '');
    }

    const insights = JSON.parse(cleanedResponse);

    return insights.map((insight: RawInsight, index: number) => ({
      id: `ai-${Date.now()}-${index}`,
      type: insight.type || 'info',
      title: normalizeInrCurrency(insight.title || 'AI Insight'),
      message: normalizeInrCurrency(insight.message || 'Analysis complete'),
      action: insight.action
        ? normalizeInrCurrency(insight.action)
        : undefined,
      confidence: insight.confidence || 0.8,
    }));
  } catch (error) {
    console.error('❌ Error generating AI insights:', error);

    return [
      {
        id: 'fallback-1',
        type: 'info',
        title: 'AI Analysis Unavailable',
        message:
          'Unable to generate personalized insights at this time. Please try again later.',
        action: 'Refresh insights',
        confidence: 0.5,
      },
    ];
  }
}

export async function categorizeExpense(description: string): Promise<string> {
  try {
    if (!getApiKey()) {
      return fallbackCategory(description);
    }

    const category = (
      await chatCompletion({
        messages: [
          {
            role: 'system',
            content:
              'You are an expense categorization AI. Categorize expenses into one of these categories: Food, Transportation, Entertainment, Shopping, Bills, Healthcare, Other. Respond with only the category name.',
          },
          {
            role: 'user',
            content: `Categorize this expense: "${description}"`,
          },
        ],
        temperature: 0.1,
        max_tokens: 20,
      })
    ).trim();

    const validCategories = [
      'Food',
      'Transportation',
      'Entertainment',
      'Shopping',
      'Bills',
      'Healthcare',
      'Other',
    ];

    return validCategories.includes(category || '') ? category! : 'Other';
  } catch (error) {
    console.error('❌ Error categorizing expense:', error);
    return fallbackCategory(description);
  }
}

export interface ExtractedExpense {
  description: string;
  amount: number | null;
  category: string;
  merchant: string;
  paymentMethod: string;
  date: string;
  note: string;
}

const VALID_CATEGORIES = EXPENSE_CATEGORIES.map((c) => c.value);
const VALID_PAYMENT_METHODS = PAYMENT_METHODS.map((p) => p.value);

function parseJsonObject(raw: string): Record<string, unknown> {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  try {
    return JSON.parse(cleaned) as Record<string, unknown>;
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error('AI returned invalid JSON');
    }
    return JSON.parse(match[0]) as Record<string, unknown>;
  }
}

function normalizeDate(value: unknown): string {
  if (typeof value !== 'string' || !value.trim()) {
    return new Date().toISOString().slice(0, 10);
  }

  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }

  return new Date().toISOString().slice(0, 10);
}

export async function extractExpenseFromScreenshot(
  imageDataUrl: string
): Promise<ExtractedExpense> {
  if (!getApiKey()) {
    throw new Error(
      'AI is not configured. Add OPENROUTER_API_KEY to .env and restart.'
    );
  }

  if (!imageDataUrl.startsWith('data:image/')) {
    throw new Error('Invalid image data');
  }

  const openai = getOpenAI();
  const instruction = `Read this payment / UPI / Paytm / GPay / bank screenshot. Reply with ONLY JSON (no markdown).

IMPORTANT — failed payments:
If the screen shows a FAILED / unsuccessful payment (e.g. "Your money has not been debited", "payment failed", "transaction failed", "exceeded bank limit", "Retry", red error box, declined), do NOT treat it as an expense.
Return: {"status":"failed","reason":"short reason from the screen"}

Only if the payment clearly SUCCEEDED (paid, success, sent, debit confirmed), return:
{"status":"success","description":"short text","amount":0,"category":"${VALID_CATEGORIES.join('|')}","merchant":"","paymentMethod":"${VALID_PAYMENT_METHODS.join('|')}|","date":"YYYY-MM-DD","note":""}
Use null/"" when unclear.`;

  // Fast paid-lite first, then small free VL fallbacks (skip slow free router)
  const visionModels = [
    'google/gemini-2.5-flash-lite',
    'qwen/qwen3.5-flash-02-23',
    'nvidia/nemotron-nano-12b-v2-vl:free',
    'google/gemma-4-26b-a4b-it:free',
  ];

  let response: string | null | undefined;
  let lastError: unknown;

  for (const model of visionModels) {
    try {
      const completion = await openai.chat.completions.create({
        model,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: instruction },
              {
                type: 'image_url',
                image_url: {
                  url: imageDataUrl,
                  detail: 'low',
                },
              },
            ],
          },
        ],
        temperature: 0,
        max_tokens: 220,
        // OpenRouter: pick the quickest provider when available
        // @ts-expect-error OpenRouter-specific routing hint
        provider: { sort: 'latency' },
      });

      response = completion.choices[0]?.message?.content;
      if (response?.trim()) {
        break;
      }
    } catch (error) {
      lastError = error;
      console.warn(`Vision model failed (${model}):`, error);
    }
  }

  if (!response?.trim()) {
    if (lastError instanceof Error) {
      throw lastError;
    }
    throw new Error('No response from AI');
  }

  const parsed = parseJsonObject(response);

  const status =
    typeof parsed.status === 'string' ? parsed.status.toLowerCase().trim() : '';
  const reason =
    typeof parsed.reason === 'string' ? parsed.reason.trim() : '';

  const looksFailed =
    status === 'failed' ||
    status === 'failure' ||
    status === 'unsuccessful' ||
    /not been debited|payment failed|transaction failed|exceeded.*limit|declined|unsuccessful/i.test(
      `${status} ${reason} ${typeof parsed.note === 'string' ? parsed.note : ''} ${typeof parsed.description === 'string' ? parsed.description : ''}`
    );

  if (looksFailed) {
    throw new Error(
      reason
        ? `Failed payment — ${reason}. Not adding as an expense.`
        : 'This looks like a failed payment (money was not debited). Not adding as an expense.'
    );
  }

  const amountRaw = parsed.amount;
  const amount =
    typeof amountRaw === 'number'
      ? amountRaw
      : typeof amountRaw === 'string'
        ? parseFloat(amountRaw.replace(/[^\d.]/g, ''))
        : null;

  const category =
    typeof parsed.category === 'string' &&
    VALID_CATEGORIES.includes(parsed.category as (typeof VALID_CATEGORIES)[number])
      ? parsed.category
      : 'Other';

  const paymentMethod =
    typeof parsed.paymentMethod === 'string' &&
    VALID_PAYMENT_METHODS.includes(
      parsed.paymentMethod as (typeof VALID_PAYMENT_METHODS)[number]
    )
      ? parsed.paymentMethod
      : '';

  return {
    description:
      typeof parsed.description === 'string' && parsed.description.trim()
        ? parsed.description.trim()
        : 'Payment',
    amount: amount !== null && !Number.isNaN(amount) ? amount : null,
    category,
    merchant: typeof parsed.merchant === 'string' ? parsed.merchant.trim() : '',
    paymentMethod,
    date: normalizeDate(parsed.date),
    note: typeof parsed.note === 'string' ? parsed.note.trim() : '',
  };
}

export async function generateAIAnswer(
  question: string,
  context: ExpenseRecord[]
): Promise<string> {
  try {
    if (!getApiKey()) {
      return 'AI is not configured yet. Add OPENROUTER_API_KEY to .env and restart the server.';
    }

    const expensesSummary = context.map((expense) => ({
      amount: expense.amount,
      amountInr: formatAmountForAI(expense.amount),
      category: expense.category,
      description: expense.description,
      date: expense.date,
    }));

    const prompt = `Based on the following expense data, provide a detailed and actionable answer to this question: "${question}"

    All amounts are in Indian Rupees (INR). Use ₹ only — never $ or USD.

    Expense Data:
    ${JSON.stringify(expensesSummary, null, 2)}

    Provide a comprehensive answer that:
    1. Addresses the specific question directly
    2. Uses concrete data from the expenses when possible (with ₹)
    3. Offers actionable advice
    4. Keeps the response concise but informative (2-3 sentences)
    
    Return only the answer text, no additional formatting.`;

    const answer = await chatCompletion({
      messages: [
        {
          role: 'system',
          content: `${INR_SYSTEM_RULE} You provide specific, actionable answers based on expense data. Be concise but thorough.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.5,
      max_tokens: 220,
    });

    return normalizeInrCurrency(answer);
  } catch (error) {
    console.error('❌ Error generating AI answer:', error);
    return "I'm unable to provide a detailed answer at the moment. Please try refreshing the insights or check your connection.";
  }
}
