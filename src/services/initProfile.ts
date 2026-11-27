import { useProfileStore } from '@/store/profileStore';

import { getMyProfileRequest, type Profile } from './profileService';
import type { CurrentUser } from './usersService';

const applyProfile = (profile: Profile) => {
  const store = useProfileStore.getState();
  store.setPersonal({
    firstName: profile.first_name ?? '',
    lastName: profile.last_name ?? '',
    gender: '',
    country: profile.country ?? '',
    city: profile.city ?? '',
    otherCities: '',
    age: typeof profile.age === 'number' ? profile.age : null,
    aboutMe: profile.about_me ?? '',
    citizenship: profile.citizenship ?? '',
    currency: profile.currency ?? '',
    activities: Array.isArray(profile.activities) ? profile.activities : [],
  });
  store.setUserPhone(profile.phone_number ?? '');
  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ').trim();
  if (fullName) store.setUserName(fullName);
};

export const initProfile = async (user: CurrentUser, signal: AbortSignal): Promise<void> => {
  const store = useProfileStore.getState();

  const userId = String(user.id);
  if (store.userId && store.userId !== userId) store.reset();
  store.setUserId(userId);
  store.setUserEmail(user.email);

  try {
    const profile = await getMyProfileRequest(signal);
    if (!signal.aborted) applyProfile(profile);
  } catch {
    // Данные учётной записи доступны и без профиля. Профиль создаёт auth-сервис.
  }
};
