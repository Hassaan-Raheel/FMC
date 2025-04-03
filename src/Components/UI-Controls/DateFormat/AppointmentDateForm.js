import { parseISO, format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export const formatDate = (createdAt) => {
  if (!createdAt) return "Invalid Date";

  const timeZone = "America/New_York";

  // Convert createdAt to Philadelphia time zone
  const createdDate = toZonedTime(parseISO(createdAt), timeZone);

  // Format the date as "28-Feb-2025"
  return format(createdDate, "dd-MMM-yyyy");
};
