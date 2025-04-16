import { parseISO, format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export const formatOrderDate = (createdAt) => {
  if (!createdAt) return { formattedDate: "Invalid Date", hoursAgo: "", showYesterday: false };

  const timeZone = "America/New_York";
  const now = new Date();

  const createdDate = toZonedTime(parseISO(createdAt), timeZone);

  const hoursDifference = Math.floor((now - createdDate) / (1000 * 60 * 60));

  const formattedDate = format(createdDate, "MMM dd, yyyy hh:mm a");

  const hoursAgo = hoursDifference === 1 ? "1 hour ago" : `${hoursDifference} hour's ago`;

  if (hoursDifference < 24) {
    return { hoursAgo, showYesterday: false, formattedDate: "" };
  } else if (hoursDifference >= 24 && hoursDifference < 48) {
    return { hoursAgo: "", showYesterday: true, formattedDate: "" };
  } else {
    return { hoursAgo: "", showYesterday: false, formattedDate };
  }
};