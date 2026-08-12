import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import OnboardingForm from './OnboardingForm';

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/sign-up');
  }
  if (user.onboardingComplete) {
    redirect('/');
  }

  const name = user.name || user.email.split('@')[0];
  return <OnboardingForm name={name} />;
}
