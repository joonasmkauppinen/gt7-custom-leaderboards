import ResultsList from "@/app/_components/ResultsList";
import { api, HydrateClient } from "@/trpc/server";
import { Suspense } from "react";

type Params = {
  params: Promise<{
    sheetName: string;
  }>;
};

export default async function Page({ params }: Params) {
  const sheetName = (await params).sheetName;
  const results = api.raceResults.getRaceResult({ sheetName });

  return (
    <HydrateClient>
      <main>
        <h1 className="mx-4 mb-2 flex flex-col">
          <span className="text-sm">Results for</span>
          <span className="text-2xl">{sheetName}</span>
        </h1>

        <Suspense fallback={<p>Loading...</p>}>
          <ResultsList results={results} />
        </Suspense>
      </main>
    </HydrateClient>
  );
}
