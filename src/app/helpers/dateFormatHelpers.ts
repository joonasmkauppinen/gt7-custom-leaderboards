import { format } from "date-fns";

const getOrdinalSuffix = (day: number) => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export const longDateFormat = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();
  return `${day}${getOrdinalSuffix(day)} of ${month} ${year}`;
};

export const diffFromNow = (dateString: string) => {
  const date = new Date(dateString).getTime();
  const now = Date.now();
  const diff = now - date;
  const diffInDays = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return "Today";
  }

  if (diffInDays === 1) {
    return "Yesterday";
  }

  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);

  if (diffInWeeks < 5) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);

  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);

  return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
};

/**
 * Helper function to convert milliseconds to mm:ss.SSS format
 */
export const millisecondsToLaptime = (milliseconds: number): string => {
  const date = new Date(milliseconds);
  return format(date, "mm:ss.SSS");
};

export const millisecondsToGoogleSheetsDuration = (
  milliseconds: number,
): string => {
  const lapTime = millisecondsToLaptime(milliseconds);
  return `00:${lapTime}`;
};
