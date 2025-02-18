import { api, HydrateClient } from "@/trpc/server";
import { RaceListItem } from "./_components/RaceListItem";

export default async function Home() {
  const races = await api.racesList.getRacesList();

  return (
    <HydrateClient>
      <main className="mb-14">
        <div className="flex flex-col gap-6">
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight">
            Gran Turismo 7 Custom Leaderboards
          </h1>
          <h2 className="text-2xl font-bold tracking-tight">Races list</h2>
          <ul className="flex flex-col gap-4">
            {races?.map((race) => (
              <RaceListItem key={race.raceResultsSheetName} {...race} />
            ))}
          </ul>
        </div>
      </main>
    </HydrateClient>
  );
}
