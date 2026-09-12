import { json, optionsResponse } from '@/lib/api';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '@/lib/expenseMeta';

export function OPTIONS() {
  return optionsResponse();
}

export function GET() {
  return json({
    ok: true,
    categories: EXPENSE_CATEGORIES,
    paymentMethods: PAYMENT_METHODS,
    demo: {
      email: 'demo@nexpend.app',
      password: 'password123',
    },
  });
}
