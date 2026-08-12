'use server';

import { categorizeExpense } from '@/lib/ai';

export async function suggestCategory(
  description: string
): Promise<{ category: string; error?: string }> {
  try {
    if (!description || description.trim().length < 2) {
      return {
        category: 'Other',
        error: 'Description too short',
      };
    }

    const category = await categorizeExpense(description.trim());
    return { category };
  } catch (error) {
    console.error('❌ Error in suggestCategory server action:', error);
    // Never throw to the client — return a safe fallback
    return {
      category: 'Other',
      error: 'Could not reach AI right now. Pick a category manually.',
    };
  }
}
