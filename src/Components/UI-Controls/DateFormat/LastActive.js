import React, { useState, useEffect } from "react";
import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const LastActiveTimestamp = ({ createdAt }) => {
  const timeZone = "America/New_York";
  const [lastSeen, setLastSeen] = useState("");

  useEffect(() => {
    if (!createdAt) return;

    const createdDate = toZonedTime(parseISO(createdAt), timeZone);
    
    let displayText = "";

    if (isToday(createdDate)) {
      displayText = `Last seen today at ${format(createdDate, "h:mm a")}`;
    } else if (isYesterday(createdDate)) {
      displayText = `Last seen yesterday at ${format(createdDate, "h:mm a")}`;
    } else {
      displayText = `Last seen on ${format(createdDate, "MMMM d, yyyy")}`;
    }

    setLastSeen(displayText);
  }, [createdAt]);

  return <span>{lastSeen}</span>;
};

export default LastActiveTimestamp;
