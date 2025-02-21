import type { FC, ReactNode } from "react";
import { type RaceListItem } from "@/server/api/routers/racesList";

import Image from "next/image";
import Link from "next/link";
import { IconGlobe } from "./IconGlobe";

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

export function RaceListItem(props: RaceListItem) {
  const trackLengthInKm = ((props.trackLengthInMeters ?? 0) / 1000).toFixed(2);
  const formattedRaceStartDate = (() => {
    const date = new Date(props.raceCreatedAtDate);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    return `${day}${getOrdinalSuffix(day)} of ${month} ${year}`;
  })();
  const raceStartedSince = (() => {
    const date = new Date(props.raceCreatedAtDate).getTime();
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

    if (diffInWeeks < 4) {
      return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);

    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
    }

    const diffInYears = Math.floor(diffInDays / 365);

    return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
  })();

  return (
    <Link href={`race/${props.raceResultsSheetName}`}>
      <li className="relative flex flex-col overflow-hidden rounded-2xl border border-list-item-border bg-list-item-bg">
        {/* BG IMAGE AND SCRIM - ABSOLUTE */}
        <div className="absolute bottom-0 left-0 right-0 top-0 z-0 flex flex-col">
          <div className="relative flex flex-1">
            <Image
              src={props.trackPromoImageUrl ?? ""}
              alt=""
              objectFit="cover"
              layout="fill"
              className="flex flex-1 object-cover"
            />
            <div className="from-list-item-scrim-start to-list-item-scrim-end absolute bottom-0 left-0 right-0 top-0 bg-gradient-to-b" />
          </div>
          <div className="bg-[rgba(255, 255, 255, 0.05)] flex h-[80px]" />
        </div>

        {/* ITEM HEADER SECTION */}
        <div className="z-10 flex flex-row items-center border-b border-[rgba(255,255,255,0.25)] bg-[rgba(0,0,0,0.1)] px-4 pb-3 pt-4 backdrop-blur-xl">
          <IconGlobe />
          <p className="ml-1 text-sm font-medium">
            {props.region} • {props.trackCountryName}
          </p>
        </div>

        {/* TRACK PROMO IMAGE SECTION */}
        <div className="z-10 flex justify-center self-stretch py-[45px]">
          <div className="flex h-[150px] w-[200px] items-center justify-center rounded-md bg-white p-2">
            <Image
              src={props.trackLocationLogoUrl ?? ""}
              alt=""
              width={200}
              height={150}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-[rgba(255,255,255,0.25)] p-4 backdrop-blur-xl">
          {/* RACE OPENED */}
          <div>
            <p className="text-subtitle text-sm font-semibold leading-3">
              Race opened
            </p>
            <p className="text-base font-semibold text-white">
              {raceStartedSince} • {formattedRaceStartDate}
            </p>
          </div>

          {/* TRACK DETAILS */}
          <InfoSectionContainer>
            <div className="mr-3 flex w-[90px] min-w-[90px] items-center justify-center self-stretch bg-white p-1">
              <Image
                src={props.trackMapImageUrl ?? ""}
                width={80}
                height={80}
                alt=""
                className="object-fill"
              />
            </div>

            <div className="my-2 mr-2 flex flex-col justify-center">
              <p className="text-subtitle text-sm font-semibold leading-5">
                Track
              </p>
              <p className="text-base font-semibold leading-5 text-white">
                {props.trackLocation ?? ""} - {props.trackLayout}
              </p>
              <p className="text-subtitle text-sm font-semibold">
                {trackLengthInKm} km
              </p>
            </div>
          </InfoSectionContainer>

          {/* CAR DETAILS */}
          <InfoSectionContainer>
            <div className="bg-white1 mr-3 flex min-h-[60px] w-[90px] min-w-[90px] items-center justify-center">
              <Image
                src={props.carImageUrl ?? ""}
                width={90}
                height={60}
                alt=""
                className="h-full object-cover"
              />
            </div>

            <div className="my-2 mr-2 flex flex-col justify-center">
              <p className="text-subtitle text-sm font-semibold">Car</p>
              <p className="text-base font-semibold leading-5 text-white">
                {props.car ?? ""}
              </p>
            </div>
          </InfoSectionContainer>

          {/* OPEN LEADERBOARD */}
          <button className="mt-6 rounded-md border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.1)] transition-colors duration-200 ease-in-out hover:bg-white">
            <p className="px-2 py-3 text-base font-semibold text-white hover:text-black">
              Open Leaderboard
            </p>
          </button>
        </div>
      </li>
    </Link>
  );
}

const InfoSectionContainer: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div
      className={`flex flex-row overflow-hidden rounded-md border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.05)] ${className}`}
    >
      {children}
    </div>
  );
};
