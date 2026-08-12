'use server';
import { db } from '@/lib/db';
import { checkUsers } from '@/lib/checkUsers';

interface RecordData {
  text: string;
  amount: number;
  category: string;
  merchant?: string;
  paymentMethod?: string;
  note?: string;
  date: string;
}

interface RecordResult {
  data?: RecordData;
  error?: string;
}

async function addExpenseRecord(formData: FormData): Promise<RecordResult> {
  const textValue = formData.get('text');
  const amountValue = formData.get('amount');
  const categoryValue = formData.get('category');
  const dateValue = formData.get('date');
  const merchantValue = formData.get('merchant');
  const paymentMethodValue = formData.get('paymentMethod');
  const noteValue = formData.get('note');

  if (
    !textValue ||
    textValue === '' ||
    !amountValue ||
    !categoryValue ||
    categoryValue === '' ||
    !dateValue ||
    dateValue === ''
  ) {
    return { error: 'Description, amount, category, or date is missing' };
  }

  const text = textValue.toString().trim();
  const amount = parseFloat(amountValue.toString());
  const category = categoryValue.toString();
  const merchant = merchantValue?.toString().trim() || null;
  const paymentMethod = paymentMethodValue?.toString().trim() || null;
  const note = noteValue?.toString().trim() || null;

  if (Number.isNaN(amount) || amount < 0) {
    return { error: 'Enter a valid amount' };
  }

  let date: string;
  try {
    const inputDate = dateValue.toString();
    const [year, month, day] = inputDate.split('-');
    const dateObj = new Date(
      Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0)
    );
    date = dateObj.toISOString();
  } catch (error) {
    console.error('Invalid date format:', error);
    return { error: 'Invalid date format' };
  }

  try {
    const user = await checkUsers();

    if (!user) {
      return { error: 'Please sign in to add expenses' };
    }

    const createdRecord = await db.record.create({
      data: {
        text,
        amount,
        category,
        merchant,
        paymentMethod,
        note,
        date,
        userId: user.id,
      },
    });

    return {
      data: {
        text: createdRecord.text,
        amount: createdRecord.amount,
        category: createdRecord.category,
        merchant: createdRecord.merchant || undefined,
        paymentMethod: createdRecord.paymentMethod || undefined,
        note: createdRecord.note || undefined,
        date: createdRecord.date?.toISOString() || date,
      },
    };
  } catch (error) {
    console.error('Error adding expense record:', error);
    return {
      error: 'An unexpected error occurred while adding the expense record.',
    };
  }
}

export default addExpenseRecord;
