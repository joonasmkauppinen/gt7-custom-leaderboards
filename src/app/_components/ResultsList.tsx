"use client";

import type { FC, ReactNode } from "react";
import { type NormalizedRaceResultsList } from "@/server/api/routers/raceResults";

import { use } from "react";
import { format } from "date-fns";

// Helper function to convert milliseconds to MM:SS.000 format
function millisecondsToLaptime(milliseconds: number): string {
  const date = new Date(milliseconds);
  return format(date, "mm:ss.SSS");
}

const TableData: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <td
    className={`border-r border-gray-700 p-2 px-4 font-mono text-base ${className}`}
  >
    {children}
  </td>
);

type RaceResultsProps = {
  results: Promise<NormalizedRaceResultsList | null>;
};

export default function ResultsList({ results }: RaceResultsProps) {
  const allResults = use(results);

  if (!allResults || allResults.length === 0) {
    return <p>No data.</p>;
  }

  const leaderTime = allResults[0]?.laptimeInMs;

  return (
    <div className="min-h-screen w-screen overflow-x-auto">
      <table className="mx-4 min-w-[600px] table-auto border-separate border-spacing-y-2 whitespace-nowrap">
        <thead className="sticky top-0">
          <tr>
            <th className="px-4 text-start">#</th>
            <th className="px-4 text-start">Driver</th>
            <th className="px-4 text-start">Laptime</th>
            <th className="px-4 text-start">Gap</th>
            <th className="px-4 text-start">Date</th>
          </tr>
        </thead>
        <tbody className="">
          {allResults.map((result, index) => {
            const gap = leaderTime ? result.laptimeInMs - leaderTime : 0;
            const formattedGap = `+ ${millisecondsToLaptime(gap)}`;

            return (
              <tr key={index} className="border border-gray-700 bg-gray-800">
                <TableData className="rounded-l-lg px-3 text-center">
                  {index + 1}
                </TableData>
                <TableData>{result.driverName}</TableData>
                <TableData>{result.laptimeFormattedDuration}</TableData>
                <TableData>{index === 0 ? "" : formattedGap}</TableData>
                <TableData className="rounded-r-lg border-none">
                  {result.dateAdded}
                </TableData>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
