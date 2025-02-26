import type { RaceListItem } from "@/server/api/routers/racesList";
import { Suspense, type FC, type ReactNode } from "react";
import Leaderboard from "@/app/_components/Leaderboard";
import { api, HydrateClient } from "@/trpc/server";
import { diffFromNow, longDateFormat } from "@/app/helpers/dateFormatHelpers";
import Image from "next/image";
import { InfoSectionContainer } from "@/app/_components/InfoSectionContainer";
import HeaderLeaderboard from "@/app/_components/HeaderLeaderboard";
import { AddLaptimeButton } from "@/app/_components/AddLaptimeButton";

type Slug = {
  sheetName: string;
};

type SearchParams = RaceListItem;

type Params = {
  searchParams: Promise<SearchParams>;
  params: Promise<Slug>;
};

export default async function Page({ params, searchParams }: Params) {
  const { sheetName } = await params;
  const query = await searchParams;

  const results = api.leaderboard.getLeaderboard({
    sheetName,
  });

  const raceStartedSince = diffFromNow(query.raceCreatedAtDate);
  const formattedRaceStartDate = longDateFormat(query.raceCreatedAtDate);
  const trackLengthInKm = ((query.trackLengthInMeters ?? 0) / 1000).toFixed(2);

  return (
    <HydrateClient>
      <main>
        <HeaderLeaderboard />

        {/* HERO IMAGE AND TRACK PROMO IMAGE SECTION */}
        <SectionContainer className="relative mb-8 mt-4 flex items-center justify-center overflow-hidden rounded-t-2xl">
          <Image
            src={query.trackPromoImageUrl ?? ""}
            alt=""
            width={1920}
            height={1080}
            objectFit="cover"
            className="mb-8 mask-image-gradient-linear"
          />
          <div className="absolute bottom-0 flex h-[150px] w-[200px] items-center justify-center rounded-md bg-white p-2">
            <Image
              src={query.trackLocationLogoUrl ?? ""}
              alt=""
              width={200}
              height={150}
            />
          </div>
        </SectionContainer>

        {/* TITTLE SECTION */}
        <SectionContainer className="mb-6">
          <p className="text-sm font-semibold text-subtitle">
            {query.region} · {query.trackCountryName}
          </p>
          <h1 className="text-2xl font-bold">
            {query.trackLocation} - {query.trackLayout}
          </h1>
        </SectionContainer>

        {/* RACE DETAILS SECTION */}
        <SectionContainer className="mb-6 flex flex-col gap-2">
          <div>
            <p className="text-sm font-semibold leading-3 text-subtitle">
              Race opened
            </p>
            <p className="text-base font-semibold text-white">
              {raceStartedSince} · {formattedRaceStartDate}
            </p>
          </div>

          <InfoSectionContainer>
            <div className="mr-3 flex w-[90px] min-w-[90px] items-center justify-center self-stretch bg-white p-1">
              <Image
                src={query.trackMapImageUrl ?? ""}
                width={80}
                height={80}
                alt=""
                className="object-fill"
              />
            </div>
            <div className="my-2 mr-2 flex flex-col justify-center">
              <p className="text-sm font-semibold leading-5 text-subtitle">
                Track
              </p>
              <p className="text-base font-semibold leading-5 text-white">
                {query.trackLocation ?? ""} - {query.trackLayout}
              </p>
              <p className="text-sm font-semibold text-subtitle">
                {trackLengthInKm} km
              </p>
            </div>
          </InfoSectionContainer>

          <InfoSectionContainer>
            <div className="bg-white1 mr-3 flex min-h-[60px] w-[90px] min-w-[90px] items-center justify-center">
              <Image
                src={query.carImageUrl ?? ""}
                width={90}
                height={60}
                alt=""
                className="h-full object-cover"
              />
            </div>

            <div className="my-2 mr-2 flex flex-col justify-center">
              <p className="text-sm font-semibold text-subtitle">Car</p>
              <p className="text-base font-semibold leading-5 text-white">
                {query.car ?? ""}
              </p>
            </div>
          </InfoSectionContainer>
        </SectionContainer>

        {/* ADD LAP TIME BUTTON SECTION */}
        <SectionContainer className="mb-6">
          <AddLaptimeButton sheetName={sheetName} />
        </SectionContainer>

        {/* LEADERBOARD SECTION */}
        <SectionContainer className="mb-4">
          <p className="text-lg font-semibold">Leaderboard</p>
        </SectionContainer>
        <Suspense
          fallback={
            <div className="min-h-screen w-screen overflow-x-auto p-4">
              <p>Loading...</p>
            </div>
          }
        >
          <Leaderboard results={results} />
        </Suspense>
      </main>
    </HydrateClient>
  );
}

const SectionContainer: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <div className={`mx-4 ${className}`}>{children}</div>;
};
