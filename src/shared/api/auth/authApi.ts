import { getFastAPI } from '@/shared/api/generated/auth/auth';
import { apiClient } from '../client';

export const authApi = getFastAPI(apiClient);

// Orval уже включает /api в пути. Переопределяем baseURL только для его запросов,
// сохраняя настройки основного клиента для оставшихся ручных сервисов.
export const authRequestOptions = {
  baseURL: (apiClient.defaults.baseURL ?? '').replace(/\/api\/?$/, ''),
};
