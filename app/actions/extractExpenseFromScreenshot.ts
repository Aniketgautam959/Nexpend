'use server';

import {
  extractExpenseFromScreenshot as extractFromImage,
  type ExtractedExpense,
} from '@/lib/ai';

export async function extractExpenseFromScreenshot(
  imageDataUrl: string
): Promise<{ data?: ExtractedExpense; error?: string }> {
  try {
    if (!imageDataUrl || !imageDataUrl.startsWith('data:image/')) {
      return { error: 'Please upload a valid image screenshot' };
    }

    // Rough size guard (~4MB base64 payload)
    if (imageDataUrl.length > 5_500_000) {
      return { error: 'Image is too large. Use a clearer, smaller screenshot.' };
    }

    const data = await extractFromImage(imageDataUrl);
    return { data };
  } catch (error) {
    console.error('❌ Error extracting expense from screenshot:', error);
    const message =
      error instanceof Error ? error.message : 'Could not read this screenshot';

    if (message.includes('OPENROUTER') || message.includes('API key')) {
      return { error: message };
    }
    if (/404|No endpoints|not found/i.test(message)) {
      return {
        error: 'Vision AI model is temporarily unavailable. Try again in a bit.',
      };
    }
    if (/rate limit|429|quota/i.test(message)) {
      return {
        error: 'AI rate limit hit. Wait a minute and try again.',
      };
    }
    if (/failed payment|not been debited|not adding as an expense/i.test(message)) {
      return { error: message };
    }
    if (
      /not a payment|invoice screenshot|could not find a payment amount/i.test(
        message
      )
    ) {
      return { error: message };
    }

    return {
      error: 'Could not read this screenshot. Try a clearer payment screen.',
    };
  }
}
