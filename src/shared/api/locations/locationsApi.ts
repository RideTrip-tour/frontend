import { apiClient } from '@/shared/api/client';
import { getLocationService } from '@/shared/api/generated/locations/locations';

export const locationsApi = getLocationService(apiClient);

export const locationsRequestOptions = {
  baseURL: (apiClient.defaults.baseURL ?? '').replace(/\/api\/?$/, ''),
};
