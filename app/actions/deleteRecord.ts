'use server';
import { db } from '@/lib/db';
import { checkUsers } from '@/lib/checkUsers';
import { revalidatePath } from 'next/cache';

async function deleteRecord(recordId: string): Promise<{
  message?: string;
  error?: string;
}> {
  try {
    const user = await checkUsers();

    if (!user) {
      return { error: 'Please sign in' };
    }

    const existingRecord = await db.record.findFirst({
      where: {
        id: recordId,
        userId: user.id,
      },
    });

    if (!existingRecord) {
      return {
        error: 'Record not found or you do not have permission to delete this record.',
      };
    }

    await db.record.delete({
      where: { id: recordId },
    });

    revalidatePath('/');
    return { message: 'Record deleted successfully' };
  } catch (error) {
    console.error('Error deleting record:', error);
    return { error: 'Database error: ' + (error as Error).message };
  }
}

export default deleteRecord;
