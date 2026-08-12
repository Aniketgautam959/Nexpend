'use server';
import { db } from '@/lib/db';
import { checkUsers } from '@/lib/checkUsers';
import { Record } from '@/types/Record';

async function getRecord(): Promise<{
  records?: Record[];
  error?: string;
}> {
  try {
    const user = await checkUsers();

    if (!user) {
      return { records: [] };
    }

    const records = await db.record.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
      take: 200,
    });

    return { records };
  } catch (error) {
    console.error('Error fetching records:', error);
    return { records: [] };
  }
}

export default getRecord;
