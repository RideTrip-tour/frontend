import { meRequest } from './authService'
import { getMyProfileRequest, createProfileRequest, type Profile } from './profileService'
import { useProfileStore } from '@/store'

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
}

const applyProfile = (profile: Profile) => {
  const store = useProfileStore.getState()
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
  })
  store.setUserPhone(profile.phone_number ?? '')
  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ').trim()
  if (fullName) store.setUserName(fullName)
}

export const initProfile = async (): Promise<void> => {
  const store = useProfileStore.getState()

  try {
    const user = await meRequest()
    if (user?.id != null) store.setUserId(String(user.id))
    if (user?.email) store.setUserEmail(user.email)
  } catch {
    return
  }

  try {
    const profile = await getMyProfileRequest()
    applyProfile(profile)
  } catch (e: unknown) {
    const status = (e as { status?: number; response?: { status?: number } })?.status
      ?? (e as { response?: { status?: number } })?.response?.status
    if (status === 404) {
      try {
        const created = await createProfileRequest(EMPTY_PROFILE_DATA)
        applyProfile(created)
      } catch {
        // профиль не удалось создать — оставляем стор с userId/email
      }
    }
  }
}