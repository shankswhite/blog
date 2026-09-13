export function formatDate(dateString: string) {
  const isoDate = dateString.match(
    /^(\d{4}-\d{2}-\d{2})(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})?)?$/i
  );
  if (!isoDate) return "Date unavailable";

  const calendarDay = new Date(`${isoDate[1]}T00:00:00Z`);
  // Date parsing otherwise rolls impossible dates such as February 30 forward.
  if (
    Number.isNaN(calendarDay.getTime()) ||
    calendarDay.toISOString().slice(0, 10) !== isoDate[1]
  ) {
    return "Date unavailable";
  }

  // Keep date-only values at midnight UTC. Treat an ISO time without a zone as
  // UTC as well, so server and browser time zones cannot change the visible day.
  const value =
    dateString.length === 10
      ? `${dateString}T00:00:00Z`
      : /(?:Z|[+-]\d{2}:\d{2})$/i.test(dateString)
        ? dateString
        : `${dateString}Z`;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
