'use server';
import { db } from '@/lib/db';
import { checkUsers } from '@/lib/checkUsers';

async function getUserRecord(): Promise<{
  record?: number;
  daysWithRecords?: number;
  error?: string;
}> {
  const user = await checkUsers();

  if (!user) {
    return { error: 'User not found' };
  }

  try {
    const records = await db.record.findMany({
      where: { userId: user.id },
    });

    const record = records.reduce((sum, r) => sum + r.amount, 0);

    // Unique calendar days that have expenses
    const uniqueDays = new Set(
      records
        .filter((r) => r.amount > 0)
        .map((r) => {
          const d = new Date(r.date);
          return `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
        })
    );

    return { record, daysWithRecords: uniqueDays.size };
  } catch (error) {
    console.error('Error fetching user record:', error);
    return { error: 'Database error' };
  }
}

export default getUserRecord;
