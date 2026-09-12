import { db } from '@/lib/db';
import {
  getApiUser,
  json,
  optionsResponse,
  readJson,
  unauthorized,
} from '@/lib/api';

export function OPTIONS(): Response {
  return optionsResponse();
}

export async function GET(request: Request): Promise<Response> {
  const user = await getApiUser(request);
  if (!user) return unauthorized();

  const now = new Date();
  const start = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
  const end = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1));

  const [budgets, monthRecords] = await Promise.all([
    db.categoryBudget.findMany({
      where: { userId: user.id },
      orderBy: { category: 'asc' },
    }),
    db.record.findMany({
      where: {
        userId: user.id,
        date: { gte: start, lt: end },
      },
      select: { category: true, amount: true },
    }),
  ]);

  const spentMap = new Map<string, number>();
  for (const record of monthRecords) {
    const cat = record.category || 'Other';
    spentMap.set(cat, (spentMap.get(cat) || 0) + record.amount);
  }

  return json({
    ok: true,
    items: budgets.map((budget) => {
      const spent = spentMap.get(budget.category) || 0;
      const pct =
        budget.amount > 0
          ? Math.min(999, Math.round((spent / budget.amount) * 100))
          : 0;
      return {
        id: budget.id,
        category: budget.category,
        amount: budget.amount,
        spent,
        pct,
      };
    }),
  });
}

export async function POST(request: Request): Promise<Response> {
  const user = await getApiUser(request);
  if (!user) return unauthorized();

  const body = await readJson<{ category?: string; amount?: number }>(request);
  if (!body) {
    return json({ ok: false, error: 'Invalid JSON body' }, 400);
  }

  const category = String(body.category || '').trim();
  if (!category) return json({ ok: false, error: 'Pick a category' }, 400);
  if (!body.amount || body.amount <= 0) {
    return json({ ok: false, error: 'Enter a valid budget amount' }, 400);
  }

  const item = await db.categoryBudget.upsert({
    where: {
      userId_category: {
        userId: user.id,
        category,
      },
    },
    create: {
      userId: user.id,
      category,
      amount: body.amount,
    },
    update: {
      amount: body.amount,
    },
  });

  return json({ ok: true, item });
}
