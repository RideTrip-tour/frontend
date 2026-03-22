function normalizeUrl(url: string) {
  return url.replace(/\/+$/, '');
}

function normalizePrefix(prefix: string) {
  if (!prefix) return '';
  if (!prefix.startsWith('/')) prefix = `/${prefix}`;
  return prefix.replace(/\/+$/, '');
}

export function getApiBaseUrl(): string {
  const url = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
  const prefix = (import.meta.env.VITE_API_PREFIX as string | undefined) ?? '';

  if (!url) {
    return normalizePrefix(prefix) || '/';
  }

  return `${normalizeUrl(url)}${normalizePrefix(prefix)}`;
}
