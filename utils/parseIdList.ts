export function parseIdListFromQueryParam(value: string | null): number[] {
  if (!value) return [];
  try {
    const decoded = decodeURIComponent(value);
    const parsed = JSON.parse(decoded);
    if (!Array.isArray(parsed)) return [];
    const validated = parsed.every((v) => typeof v === 'number' && Number.isInteger(v) && v > 0);
    return validated ? parsed : [];
  } catch {
    return [];
  }
}