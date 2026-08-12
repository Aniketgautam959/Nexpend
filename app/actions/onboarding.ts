'use server';

import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function completeOnboardingAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: 'Please sign in first' };
  }

  const incomeRaw = String(formData.get('monthlyIncome') || '').trim();
  const goalRaw = String(formData.get('savingsGoal') || '').trim();

  const monthlyIncome = parseFloat(incomeRaw);
  if (!incomeRaw || Number.isNaN(monthlyIncome) || monthlyIncome <= 0) {
    return { error: 'Enter a valid monthly income' };
  }

  let savingsGoal: number | null = null;
  if (goalRaw) {
    const g = parseFloat(goalRaw);
    if (Number.isNaN(g) || g < 0) {
      return { error: 'Enter a valid savings goal' };
    }
    if (g > monthlyIncome) {
      return { error: 'Savings goal can’t be more than income' };
    }
    savingsGoal = g;
  } else {
    // Default: suggest saving ~20% if they skip
    savingsGoal = Math.round(monthlyIncome * 0.2);
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      monthlyIncome,
      savingsGoal,
      onboardingComplete: true,
    },
  });

  revalidatePath('/');
  revalidatePath('/onboarding');
  return { success: true as const };
}

export async function updateBudgetAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: 'Not logged in' };
  }

  const incomeRaw = String(formData.get('monthlyIncome') || '').trim();
  const goalRaw = String(formData.get('savingsGoal') || '').trim();

  const monthlyIncome = parseFloat(incomeRaw);
  if (!incomeRaw || Number.isNaN(monthlyIncome) || monthlyIncome <= 0) {
    return { error: 'Enter a valid monthly income' };
  }

  let savingsGoal: number | null = null;
  if (goalRaw) {
    const g = parseFloat(goalRaw);
    if (Number.isNaN(g) || g < 0) {
      return { error: 'Enter a valid savings goal' };
    }
    if (g > monthlyIncome) {
      return { error: 'Savings goal can’t be more than income' };
    }
    savingsGoal = g;
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      monthlyIncome,
      savingsGoal,
      onboardingComplete: true,
    },
  });

  revalidatePath('/');
  revalidatePath('/profile');
  return { success: true };
}
