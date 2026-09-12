import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import {
  createToken,
  SESSION_USER_SELECT,
  TOKEN_TTL_SECONDS,
  type SessionUser,
} from '@/lib/auth';
import { DEMO_EMAIL, DEMO_PASSWORD, ensureDemoUser } from '@/lib/demoAccount';

export { TOKEN_TTL_SECONDS };

export type AuthSuccess = {
  ok: true;
  user: SessionUser;
  token: string;
};

export type AuthFailure = {
  ok: false;
  error: string;
};

export function toPublicUser(user: SessionUser) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    imageUrl: user.imageUrl,
    monthlyIncome: user.monthlyIncome,
    savingsGoal: user.savingsGoal,
    onboardingComplete: user.onboardingComplete,
    createdAt:
      user.createdAt instanceof Date
        ? user.createdAt.toISOString()
        : user.createdAt,
  };
}

export async function findSessionUser(
  userId: string
): Promise<SessionUser | null> {
  return db.user.findUnique({
    where: { id: userId },
    select: SESSION_USER_SELECT,
  });
}

export async function registerAccount(input: {
  name?: string;
  email?: string;
  password?: string;
}): Promise<AuthSuccess | AuthFailure> {
  const name = String(input.name || '').trim();
  const email = String(input.email || '').trim().toLowerCase();
  const password = String(input.password || '');

  if (!email || !password) {
    return { ok: false, error: 'Email and password are required' };
  }
  if (password.length < 6) {
    return { ok: false, error: 'Password must be at least 6 characters' };
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false, error: 'Email already registered' };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: {
      email,
      passwordHash,
      name: name || email.split('@')[0],
    },
    select: SESSION_USER_SELECT,
  });

  return { ok: true, user, token: await createToken(user.id) };
}

export async function loginAccount(input: {
  email?: string;
  password?: string;
}): Promise<AuthSuccess | AuthFailure> {
  const email = String(input.email || '').trim().toLowerCase();
  const password = String(input.password || '');

  if (!email || !password) {
    return { ok: false, error: 'Email and password are required' };
  }

  if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
    return loginDemoAccount();
  }

  const row = await db.user.findUnique({ where: { email } });
  if (!row) {
    return { ok: false, error: 'Invalid email or password' };
  }

  const matched =
    !!row.passwordHash && (await bcrypt.compare(password, row.passwordHash));
  if (!matched) {
    return { ok: false, error: 'Invalid email or password' };
  }

  const user = await findSessionUser(row.id);
  if (!user) {
    return { ok: false, error: 'Invalid email or password' };
  }

  return { ok: true, user, token: await createToken(user.id) };
}

export async function loginDemoAccount(): Promise<AuthSuccess | AuthFailure> {
  const demo = await ensureDemoUser();
  const user = await findSessionUser(demo.id);
  if (!user) {
    return { ok: false, error: 'Could not start demo' };
  }
  return { ok: true, user, token: await createToken(user.id) };
}

export async function updateAccountProfile(
  user: SessionUser,
  input: {
    name?: string;
    email?: string;
    password?: string;
    monthlyIncome?: string | number;
    savingsGoal?: string | number | null;
  }
): Promise<{ ok: true } | AuthFailure> {
  const name = String(input.name || '').trim();
  const email = String(input.email || '').trim().toLowerCase();
  const password = String(input.password || '');
  const incomeRaw = String(input.monthlyIncome ?? '').trim();
  const goalRaw = String(input.savingsGoal ?? '').trim();

  if (!name || !email) {
    return { ok: false, error: 'Name and email are required' };
  }

  if (email !== user.email) {
    const taken = await db.user.findUnique({ where: { email } });
    if (taken) {
      return { ok: false, error: 'Email already in use' };
    }
  }

  const data: {
    name: string;
    email: string;
    passwordHash?: string;
    monthlyIncome?: number;
    savingsGoal?: number | null;
  } = { name, email };

  if (password) {
    if (password.length < 6) {
      return { ok: false, error: 'Password must be at least 6 characters' };
    }
    data.passwordHash = await bcrypt.hash(password, 10);
  }

  if (incomeRaw) {
    const monthlyIncome = parseFloat(incomeRaw);
    if (Number.isNaN(monthlyIncome) || monthlyIncome <= 0) {
      return { ok: false, error: 'Enter a valid monthly income' };
    }
    data.monthlyIncome = monthlyIncome;

    if (goalRaw) {
      const goal = parseFloat(goalRaw);
      if (Number.isNaN(goal) || goal < 0) {
        return { ok: false, error: 'Enter a valid savings goal' };
      }
      if (goal > monthlyIncome) {
        return { ok: false, error: 'Savings goal can’t be more than income' };
      }
      data.savingsGoal = goal;
    } else {
      data.savingsGoal = null;
    }
  }

  await db.user.update({
    where: { id: user.id },
    data,
  });

  return { ok: true };
}

export async function saveOnboarding(
  userId: string,
  input: {
    monthlyIncome?: string | number;
    savingsGoal?: string | number;
  }
): Promise<{ ok: true } | AuthFailure> {
  const incomeRaw = String(input.monthlyIncome ?? '').trim();
  const goalRaw = String(input.savingsGoal ?? '').trim();
  const monthlyIncome = parseFloat(incomeRaw);

  if (!incomeRaw || Number.isNaN(monthlyIncome) || monthlyIncome <= 0) {
    return { ok: false, error: 'Enter a valid monthly income' };
  }

  let savingsGoal: number | null = null;
  if (goalRaw) {
    const goal = parseFloat(goalRaw);
    if (Number.isNaN(goal) || goal < 0) {
      return { ok: false, error: 'Enter a valid savings goal' };
    }
    if (goal > monthlyIncome) {
      return { ok: false, error: 'Savings goal can’t be more than income' };
    }
    savingsGoal = goal;
  } else {
    savingsGoal = Math.round(monthlyIncome * 0.2);
  }

  await db.user.update({
    where: { id: userId },
    data: {
      monthlyIncome,
      savingsGoal,
      onboardingComplete: true,
    },
  });

  return { ok: true };
}

export async function saveBudgetPlan(
  userId: string,
  input: {
    monthlyIncome?: string | number;
    savingsGoal?: string | number;
  }
): Promise<{ ok: true } | AuthFailure> {
  const incomeRaw = String(input.monthlyIncome ?? '').trim();
  const goalRaw = String(input.savingsGoal ?? '').trim();
  const monthlyIncome = parseFloat(incomeRaw);

  if (!incomeRaw || Number.isNaN(monthlyIncome) || monthlyIncome <= 0) {
    return { ok: false, error: 'Enter a valid monthly income' };
  }

  let savingsGoal: number | null = null;
  if (goalRaw) {
    const goal = parseFloat(goalRaw);
    if (Number.isNaN(goal) || goal < 0) {
      return { ok: false, error: 'Enter a valid savings goal' };
    }
    if (goal > monthlyIncome) {
      return { ok: false, error: 'Savings goal can’t be more than income' };
    }
    savingsGoal = goal;
  }

  await db.user.update({
    where: { id: userId },
    data: {
      monthlyIncome,
      savingsGoal,
      onboardingComplete: true,
    },
  });

  return { ok: true };
}
