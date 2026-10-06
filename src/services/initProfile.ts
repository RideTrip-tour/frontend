import { useProfileStore } from '@/store/profileStore';

import { getMyProfileRequest, createProfileRequest, type Profile } from './profileService';
import type { CurrentUser } from './usersService';

const EMPTY_PROFILE_DATA = {
  first_name: '',
  last_name: '',
  phone_number: '',
  age: 0,
  about_me: '',
  activities: [] as string[],
  country: '',
  city: '',
  citizenship: '',
  currency: '',
};

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

export const initProfile = async (user: CurrentUser): Promise<void> => {
  const store = useProfileStore.getState();

  store.setUserId(String(user.id));
  store.setUserEmail(user.email);

  try {
    const profile = await getMyProfileRequest();
    applyProfile(profile);
  } catch (error) {
    const status =
      (error as { status?: number })?.status ??
      (error as { response?: { status?: number } })?.response?.status;

    if (status !== 404) {
      return;
    }

    try {
      const profile = await createProfileRequest(EMPTY_PROFILE_DATA);
      applyProfile(profile);
    } catch {
      // Профиль не удалось создать.
    }
  }
};
