'use server';

import {
  clearAuthCookie,
  getCurrentUser,
  setAuthCookie,
} from '@/lib/auth';
import {
  loginAccount,
  loginDemoAccount,
  registerAccount,
  updateAccountProfile,
} from '@/lib/auth-service';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function registerAction(formData: FormData) {
  const result = await registerAccount({
    name: String(formData.get('name') || ''),
    email: String(formData.get('email') || ''),
    password: String(formData.get('password') || ''),
  });

  if (!result.ok) {
    return { error: result.error };
  }

  await setAuthCookie(result.token);
  redirect('/onboarding');
}

export async function loginAction(formData: FormData) {
  const result = await loginAccount({
    email: String(formData.get('email') || ''),
    password: String(formData.get('password') || ''),
  });

  if (!result.ok) {
    return { error: result.error };
  }

  await setAuthCookie(result.token);
  redirect(result.user.onboardingComplete ? '/' : '/onboarding');
}

export async function demoLoginAction() {
  const result = await loginDemoAccount();
  if (!result.ok) {
    return { error: result.error };
  }
  await setAuthCookie(result.token);
  redirect('/');
}

export async function logoutAction() {
  await clearAuthCookie();
  redirect('/');
}

export async function updateProfileAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: 'Not logged in' };
  }

  const result = await updateAccountProfile(user, {
    name: String(formData.get('name') || ''),
    email: String(formData.get('email') || ''),
    password: String(formData.get('password') || ''),
    monthlyIncome: String(formData.get('monthlyIncome') || ''),
    savingsGoal: String(formData.get('savingsGoal') || ''),
  });

  if (!result.ok) {
    return { error: result.error };
  }

  revalidatePath('/profile');
  revalidatePath('/');
  return { success: true };
}
