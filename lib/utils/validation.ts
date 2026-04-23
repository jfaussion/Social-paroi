export function parseIntOrThrow(value: string, fieldName: string): number {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`${fieldName} must be a valid integer, got: ${value}`);
  }
  return parsed;
}
