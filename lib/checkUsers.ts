import { getCurrentUser } from '@/lib/auth';

/** Returns the logged-in DB user, or null */
export const checkUsers = async () => {
  try {
    return await getCurrentUser();
  } catch (error) {
    console.error('Error in checkUsers:', error);
    return null;
  }
};
