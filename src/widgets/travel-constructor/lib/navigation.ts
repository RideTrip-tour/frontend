export function getPartnerOffersReturnPath(state: unknown): string {
  const path =
    state && typeof state === 'object' && 'partnerOffersReturnTo' in state
      ? state.partnerOffersReturnTo
      : null;
  return typeof path === 'string' && /^\/trip-builder\/partner-offers\/?(?:[?#]|$)/.test(path)
    ? path
    : '/trip-builder/partner-offers';
}
