'use server';

import { getCurrentUser } from '@/lib/auth';
import { saveBudgetPlan, saveOnboarding } from '@/lib/auth-service';
import { revalidatePath } from 'next/cache';

export async function completeOnboardingAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: 'Please sign in first' };
  }

  const result = await saveOnboarding(user.id, {
    monthlyIncome: String(formData.get('monthlyIncome') || ''),
    savingsGoal: String(formData.get('savingsGoal') || ''),
  });

  if (!result.ok) {
    return { error: result.error };
  }

  revalidatePath('/');
  revalidatePath('/onboarding');
  return { success: true as const };
}

export async function updateBudgetAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: 'Not logged in' };
  }

  const result = await saveBudgetPlan(user.id, {
    monthlyIncome: String(formData.get('monthlyIncome') || ''),
    savingsGoal: String(formData.get('savingsGoal') || ''),
  });

  if (!result.ok) {
    return { error: result.error };
  }

  revalidatePath('/');
  revalidatePath('/profile');
  return { success: true };
}
