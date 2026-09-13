/**
 * Represent a known calendar date as a timezone-qualified metadata value.
 * UTC midnight is the serialization convention for date-only source values,
 * not a claim that the article was published or edited at that exact time.
 * Preserve supplied timestamps (including their precision and offset), and
 * leave invalid values unchanged so the HTTP audit can report them.
 */
export function toMetadataDateTime(value: string | undefined): string | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const normalized = `${value}T00:00:00Z`;
  const calendarDay = new Date(normalized);
  if (
    Number.isNaN(calendarDay.getTime()) ||
    calendarDay.toISOString().slice(0, 10) !== value
  ) {
    return value;
  }

  return normalized;
}
