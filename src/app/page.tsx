import Image from "next/image";
import Link from "next/link";

import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const races = await api.racesList.getRacesList();

  return (
    <HydrateClient>
      <main>
        <div className="flex flex-col gap-6">
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight">
            Gran Turismo 7 Custom Leaderboards
          </h1>
          <h2 className="text-2xl font-bold tracking-tight">Races list</h2>
          <div className="flex flex-col gap-2">
            {races?.map((race, index) => (
              <Link
                href={`/race/${race.raceResultsSheetName}`}
                key={`${index}-${race.raceResultsSheetName}`}
              >
                <div className="flex flex-col gap-2 rounded-lg border border-gray-700 bg-gray-800 p-4">
                  <section className="flex flex-row justify-between gap-2">
                    <Image
                      alt={`Logo of ${race.trackLocation}.`}
                      height={200}
                      src={decodeURIComponent(race.trackLocationLogoBase64)}
                      width={200}
                    />
                    <Image
                      alt={`Image of ${race.car}.`}
                      className="rounded object-cover"
                      height={200}
                      src={race.carImageUrl}
                      width={300}
                    />
                  </section>
                  <p className="text-lg">
                    {race.region} - {race.trackCountryFlag}{" "}
                    {race.trackCountryName} - {race.trackLocation}{" "}
                    {race.trackLayout} - {race.car}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
