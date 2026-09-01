function normalizeUrl(url: string) {
  return url.replace(/\/+$/, '');
}

export function getApiBaseUrl(): string {
  const url = (import.meta.env.VITE_API_URL as string | undefined)?.trim();

  if (!url) {
    return '/api';
  }

  return `${normalizeUrl(url)}/api`;
}