import { create } from "zustand";

export type PersonalData = {
  firstName: string;
  lastName: string;
  gender: string;
  country: string;
  city: string;
  otherCities: string;
  age: number | null;
  aboutMe: string;
  citizenship: string;
  currency: string;
  activities: string[];
};

type PreferencesData = {
  ridingStyles: string[];
  skillLevel: string;
};

type TripData = {
  restFormats: string[];
  companyTypes: string[];
  tripDurations: string[];
};

type NotificationsData = {
  howToReceive: Record<string, boolean>;
  whatToReceive: Record<string, boolean>;
  serviceNotifications: Record<string, boolean>;
};

type PrivacyData = {
  profile: Record<string, boolean>;
  data: Record<string, boolean>;
  geo: Record<string, boolean>;
};

type QuizAnswer = {
  questionId: number;
  score: number;
};

type ProfileState = {
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  avatarUrl: string;
  profileProgress: number;

  personal: PersonalData;
  consent: boolean;
  preferences: PreferencesData;
  trip: TripData;
  quizLevel: string;
  quizAnswers: QuizAnswer[];

  notifications: NotificationsData;
  privacy: PrivacyData;

  setUserId: (userId: string) => void;
  setUserName: (userName: string) => void;
  setUserEmail: (userEmail: string) => void;
  setUserPhone: (userPhone: string) => void;
  setAvatarUrl: (avatarUrl: string) => void;
  setProfileProgress: (value: number) => void;

  setPersonal: (data: PersonalData) => void;
  setConsent: (consent: boolean) => void;
  setPreferences: (data: PreferencesData) => void;
  setTrip: (data: TripData) => void;
  setQuizLevel: (quizLevel: string) => void;
  setQuizAnswers: (answers: QuizAnswer[]) => void;

  setNotifications: (data: NotificationsData) => void;
  setPrivacy: (data: PrivacyData) => void;

  reset: () => void;
};

const EMPTY_PERSONAL: PersonalData = {
  firstName: '',
  lastName: '',
  gender: '',
  country: '',
  city: '',
  otherCities: '',
  age: null,
  aboutMe: '',
  citizenship: '',
  currency: '',
  activities: [],
};

const EMPTY_PREFERENCES: PreferencesData = {
  ridingStyles: [],
  skillLevel: '',
};

const EMPTY_TRIP: TripData = {
  restFormats: [],
  companyTypes: [],
  tripDurations: [],
};

const initialProfileData = {
  userId: '',
  userName: '',
  userEmail: '',
  userPhone: '',
  avatarUrl: '',
  profileProgress: 0,
  personal: EMPTY_PERSONAL,
  consent: false,
  preferences: EMPTY_PREFERENCES,
  trip: EMPTY_TRIP,
  quizLevel: '',
  quizAnswers: [],
  notifications: {
    howToReceive: {},
    whatToReceive: {},
    serviceNotifications: {},
  },
  privacy: {
    profile: {},
    data: {},
    geo: {},
  },
};

export const useProfileStore = create<ProfileState>((set) => ({
  ...initialProfileData,

  setUserId: (userId) => set({ userId }),
  setUserName: (userName) => set({ userName }),
  setUserEmail: (userEmail) => set({ userEmail }),
  setUserPhone: (userPhone) => set({ userPhone }),
  setAvatarUrl: (avatarUrl) => set({ avatarUrl }),
  setProfileProgress: (profileProgress) => set({ profileProgress }),

  setPersonal: (personal) => set({ personal }),
  setConsent: (consent) => set({ consent }),
  setPreferences: (preferences) => set({ preferences }),
  setTrip: (trip) => set({ trip }),
  setQuizLevel: (quizLevel) => set({ quizLevel }),
  setQuizAnswers: (quizAnswers) => set({ quizAnswers }),

  setNotifications: (notifications) => set({ notifications }),
  setPrivacy: (privacy) => set({ privacy }),

  reset: () => set({ ...initialProfileData }),
}));