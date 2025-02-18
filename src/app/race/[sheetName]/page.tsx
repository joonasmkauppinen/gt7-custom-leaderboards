import { api, HydrateClient } from "@/trpc/server";

export default async function Page({
  params,
}: {
  params: Promise<{ sheetName: string }>;
}) {
  const slug = (await params).sheetName;
  const results = await api.raceResults.getRaceResult({ sheetName: slug });

  return (
    <HydrateClient>
      <main>
        <h1 className="mb-2 flex flex-col">
          <span className="text-sm">Results for</span>
          <span className="text-2xl">{slug}</span>
        </h1>

        <table className="mt-4 table-auto">
          <thead>
            <tr>
              <th className="text-start">Driver</th>
              <th className="text-start">Laptime</th>
              <th className="text-start">Gap</th>
              <th className="text-start">Date</th>
            </tr>
          </thead>
          <tbody className="">
            {results?.map((result, index) => (
              <tr
                key={index}
                className="m-2 border border-gray-700 bg-gray-800"
              >
                <td className="border-r border-gray-700 p-1">
                  {result.driverName}
                </td>
                <td className="border-r border-gray-700 p-1">
                  {result.laptimeFormattedDuration}
                </td>
                <td className="border-r border-gray-700 p-1">TODO: calc gap</td>
                <td className="border-r border-gray-700 p-1">
                  {result.laptimeISO8601Date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </HydrateClient>
  );
}
