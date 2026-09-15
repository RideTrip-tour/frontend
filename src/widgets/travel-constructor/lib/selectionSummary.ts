export function formatSelectionSummary(
  values: string[],
  visibleCount = 2,
): string | undefined {
  if (values.length === 0) {
    return undefined;
  }

  return values.length > visibleCount
    ? `${values.slice(0, visibleCount).join(', ')} и ещё ${values.length - visibleCount}`
    : values.join(', ');
}
