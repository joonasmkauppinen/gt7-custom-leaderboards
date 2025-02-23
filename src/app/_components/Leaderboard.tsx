"use client";

import type { FC, ReactNode } from "react";
import {
  LeaderboardItem,
  type NormalizedLeaderboardList,
} from "@/server/api/routers/leaderboard";

import { use, useState } from "react";
import { format } from "date-fns";
import { diffFromNow, longDateFormat } from "../helpers/dateFormatHelpers";

/**
 * Helper function to convert milliseconds to MM:SS.000 format
 */
function millisecondsToLaptime(milliseconds: number): string {
  console.log("[millisecondsToLaptime] input:", milliseconds);
  const date = new Date(milliseconds);
  const formattedTime = format(date, "mm:ss.SSS");
  console.log("[millisecondsToLaptime] output:", formattedTime);
  return formattedTime;
}

const TableData: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <td
    className={`border-r border-gray-700 p-2 px-4 font-mono text-base font-semibold ${className}`}
  >
    {children}
  </td>
);

type RaceResultsProps = {
  results: Promise<NormalizedLeaderboardList | null>;
};

export default function Leaderboard({ results }: RaceResultsProps) {
  const unsortedResults = use(results);
  const tabs = ["Driver best", "All"] as const;
  const [activeTab, setActiveTab] =
    useState<(typeof tabs)[number]>("Driver best");

  if (!unsortedResults || unsortedResults.length === 0) {
    return (
      <div className="min-h-screen w-screen overflow-x-auto">
        <p>No data.</p>
      </div>
    );
  }

  const resultsSorted = unsortedResults
    .slice()
    .sort((a, b) => +a.laptimeInMs - +b.laptimeInMs);

  const resultsByDriverBest = Object.values(
    resultsSorted.reduce(
      (acc, result) => {
        if (!acc[result.driverName]) {
          acc[result.driverName] = result;
        }
        return acc;
      },
      {} as Record<string, LeaderboardItem>,
    ),
  ).sort((a, b) => +a.laptimeInMs - +b.laptimeInMs);

  const leaderTime = parseInt(resultsSorted[0]?.laptimeInMs ?? "0");

  const tableData =
    activeTab === "Driver best" ? resultsByDriverBest : resultsSorted;

  return (
    <div>
      {/* TAB SWITCHER */}
      <div className="relative mx-4 mb-4 flex flex-row gap-4 overflow-hidden rounded-lg bg-button p-2">
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <span className="h-1/2 w-[1px] rounded bg-gray-600" />
        </div>
        {tabs.map((tab) => (
          <div
            key={tab}
            className={`z-10 flex-1 cursor-pointer rounded py-[6px] text-center text-sm font-medium ${
              activeTab === tab ? "bg-gray-600" : "bg-gray-800"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      <div className="min-h-screen w-screen overflow-x-auto">
        <table className="mx-4 min-w-[600px] table-auto border-separate border-spacing-y-2 whitespace-nowrap">
          <thead className="sticky top-0">
            <tr>
              <th className="px-4 text-start">#</th>
              <th className="px-4 text-start">Driver</th>
              <th className="px-4 text-start">Laptime</th>
              <th className="px-4 text-start">Gap to leader</th>
              <th className="px-4 text-start">Gap to next</th>
              <th className="px-4 text-start">Date</th>
            </tr>
          </thead>
          <tbody className="">
            {tableData.map((result, index) => {
              const lapTimeInMsInt = parseInt(result.laptimeInMs);
              const laptimeFormattedDuration =
                millisecondsToLaptime(lapTimeInMsInt);

              const gapToLeader = leaderTime ? lapTimeInMsInt - leaderTime : 0;

              const gapToNext =
                index === 0
                  ? 0
                  : lapTimeInMsInt -
                    (parseInt(tableData[index - 1]?.laptimeInMs ?? "0") ?? 0);

              const formattedGapToLeader = `+ ${millisecondsToLaptime(gapToLeader)}`;
              const formattedGapToNext = `+ ${millisecondsToLaptime(gapToNext)}`;
              const sinceAddedDateString = diffFromNow(result.dateAdded);
              const formattedDateAdded = longDateFormat(result.dateAdded);

              return (
                <tr key={index} className="border border-gray-700 bg-gray-800">
                  <TableData className="rounded-l-lg px-3 text-center">
                    {index + 1}
                  </TableData>
                  <TableData>{result.driverName}</TableData>
                  <TableData>{laptimeFormattedDuration}</TableData>
                  <TableData>
                    {index === 0 ? "-" : formattedGapToLeader}
                  </TableData>
                  <TableData>
                    {index === 0 ? "-" : formattedGapToNext}
                  </TableData>
                  <TableData className="rounded-r-lg border-none">
                    {sinceAddedDateString} · {formattedDateAdded}
                  </TableData>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
