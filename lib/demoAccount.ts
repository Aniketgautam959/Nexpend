import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

export const DEMO_EMAIL = 'demo@nexpend.app';
export const DEMO_PASSWORD = 'password123';

async function seedDemoRecords(userId: string) {
  const count = await db.record.count({ where: { userId } });
  if (count > 0) return;

  const now = new Date();
  const day = (offset: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - offset);
    return d;
  };

  await db.record.createMany({
    data: [
      {
        userId,
        text: 'Netflix',
        amount: 649,
        category: 'Subscriptions',
        merchant: 'Netflix',
        paymentMethod: 'UPI',
        date: day(2),
      },
      {
        userId,
        text: 'Airtel recharge',
        amount: 299,
        category: 'Bills',
        merchant: 'Airtel',
        paymentMethod: 'Paytm',
        date: day(5),
      },
      {
        userId,
        text: 'Swiggy',
        amount: 420,
        category: 'Food',
        merchant: 'Swiggy',
        paymentMethod: 'GPay',
        date: day(1),
      },
      {
        userId,
        text: 'Metro card',
        amount: 500,
        category: 'Transportation',
        paymentMethod: 'UPI',
        date: day(8),
      },
      {
        userId,
        text: 'Amazon order',
        amount: 1299,
        category: 'Shopping',
        merchant: 'Amazon',
        paymentMethod: 'Card',
        date: day(12),
      },
    ],
  });
}

export async function ensureDemoUser() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  let user = await db.user.findUnique({ where: { email: DEMO_EMAIL } });

  if (!user) {
    user = await db.user.create({
      data: {
        email: DEMO_EMAIL,
        passwordHash,
        name: 'Demo User',
        monthlyIncome: 40000,
        savingsGoal: 5000,
        onboardingComplete: true,
      },
    });
  } else {
    user = await db.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        name: 'Demo User',
        monthlyIncome: user.monthlyIncome ?? 40000,
        savingsGoal: user.savingsGoal ?? 5000,
        onboardingComplete: true,
      },
    });
  }

  await seedDemoRecords(user.id);
  return user;
}
