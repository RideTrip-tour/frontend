import { getProfileService } from '@/shared/api/generated/profile/profile';

import { apiClient } from '../client';

export const profileApi = getProfileService(apiClient);

export const profileRequestOptions = {
  baseURL: (apiClient.defaults.baseURL ?? '').replace(/\/api\/?$/, ''),
};
