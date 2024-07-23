import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";
import { BADGE_CRITERIA } from "@/Constant";
import { BadgeCounts } from "@/Types";

interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}

interface BadgeParams {
  criteria: {
    type: keyof typeof BADGE_CRITERIA;
    count: number;
  }[];
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimeStamp = (createdAt: Date): string => {
  // Check if createdAt is a valid Date object
  if (!(createdAt instanceof Date)) {
    // Try to convert it to a Date if it's not
    createdAt = new Date(createdAt);
  }

  // Check if createdAt is still not a valid Date after conversion
  if (isNaN(createdAt.getTime())) {
    throw new Error("Invalid date provided");
  }

  const now = new Date();
  const timeDifference = now.getTime() - createdAt.getTime();

  // Define time intervals in milliseconds
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  if (timeDifference < minute) {
    const seconds = Math.floor(timeDifference / 1000);
    return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
  } else if (timeDifference < hour) {
    const minutes = Math.floor(timeDifference / minute);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (timeDifference < day) {
    const hours = Math.floor(timeDifference / hour);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else if (timeDifference < week) {
    const days = Math.floor(timeDifference / day);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  } else if (timeDifference < month) {
    const weeks = Math.floor(timeDifference / week);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  } else if (timeDifference < year) {
    const months = Math.floor(timeDifference / month);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  } else {
    const years = Math.floor(timeDifference / year);
    return `${years} ${years === 1 ? "year" : "years"} ago`;
  }
};

export const formatNumber = (num: number): string => {
  if (num === undefined || num === null) {
    return "0"; // or handle it in a way that fits your application's needs.
  }

  if (num >= 1000000) {
    const formatToNum = (num / 1000000).toFixed(1);
    return `${formatToNum}M`;
  } else if (num >= 1000) {
    const formatToNum = (num / 1000).toFixed(1);
    return `${formatToNum}K`;
  } else {
    return num.toString();
  }
};

export const getJoinedDate = (dateString: string) => {
  const date = new Date(dateString);

  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return "th"; // for 11th, 12th, 13th, etc...

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

  const day = date.getUTCDate();
  const month = date.toLocaleString("en-GB", { month: "long" });
  const year = date.getUTCFullYear();

  const dayWithSuffix = day + getOrdinalSuffix(day);

  return { day: dayWithSuffix, month, year };
};

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    {
      skipNull: true,
    },
  );
};

export const removeKeysFromQuery = ({
  params,
  keysToremove,
}: {
  params: string;
  keysToremove: string[];
}) => {
  const currentUrl = qs.parse(params);

  keysToremove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    { url: window.location.pathname, query: currentUrl },
    { skipNull: true },
  );
};

export const assignBadges = (params: BadgeParams) => {
  const badgeCounts: BadgeCounts = {
    BRONZE: 0,
    SILVER: 0,
    GOLD: 0,
  };

  const { criteria } = params;

  criteria.forEach((items) => {
    const { type, count } = items;

    const badgeLevels: any = BADGE_CRITERIA[type];

    Object.keys(badgeLevels).forEach((level: any) => {
      if (count >= badgeLevels[level]) {
        badgeCounts[level as keyof BadgeCounts] += 1;
      }
    });
  });

  return badgeCounts;
};

export const replaceSpacesWithPercent20 = (text: string): string => {
  return text.replace(/\s/g, "%20");
};
