'use server';

import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import {
  clearAuthCookie,
  createToken,
  getCurrentUser,
  setAuthCookie,
} from '@/lib/auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { ensureDemoUser } from '@/lib/demoAccount';

export async function registerAction(formData: FormData) {
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }
  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters' };
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { error: 'Email already registered' };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: {
      email,
      passwordHash,
      name: name || email.split('@')[0],
    },
  });

  const token = await createToken(user.id);
  await setAuthCookie(token);
  redirect('/onboarding');
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    return { error: 'Invalid email or password' };
  }

  const ok =
    !!user.passwordHash && (await bcrypt.compare(password, user.passwordHash));
  if (!ok) {
    return { error: 'Invalid email or password' };
  }

  const token = await createToken(user.id);
  await setAuthCookie(token);
  redirect(user.onboardingComplete ? '/' : '/onboarding');
}

export async function demoLoginAction() {
  const user = await ensureDemoUser();
  const token = await createToken(user.id);
  await setAuthCookie(token);
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

  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');
  const incomeRaw = String(formData.get('monthlyIncome') || '').trim();
  const goalRaw = String(formData.get('savingsGoal') || '').trim();

  if (!name || !email) {
    return { error: 'Name and email are required' };
  }

  if (email !== user.email) {
    const taken = await db.user.findUnique({ where: { email } });
    if (taken) {
      return { error: 'Email already in use' };
    }
  }

  const data: {
    name: string;
    email: string;
    passwordHash?: string;
    monthlyIncome?: number;
    savingsGoal?: number | null;
  } = {
    name,
    email,
  };

  if (password) {
    if (password.length < 6) {
      return { error: 'Password must be at least 6 characters' };
    }
    data.passwordHash = await bcrypt.hash(password, 10);
  }

  if (incomeRaw) {
    const monthlyIncome = parseFloat(incomeRaw);
    if (Number.isNaN(monthlyIncome) || monthlyIncome <= 0) {
      return { error: 'Enter a valid monthly income' };
    }
    data.monthlyIncome = monthlyIncome;

    if (goalRaw) {
      const g = parseFloat(goalRaw);
      if (Number.isNaN(g) || g < 0) {
        return { error: 'Enter a valid savings goal' };
      }
      if (g > monthlyIncome) {
        return { error: 'Savings goal can’t be more than income' };
      }
      data.savingsGoal = g;
    } else {
      data.savingsGoal = null;
    }
  }

  await db.user.update({
    where: { id: user.id },
    data,
  });

  revalidatePath('/profile');
  revalidatePath('/');
  return { success: true };
}
