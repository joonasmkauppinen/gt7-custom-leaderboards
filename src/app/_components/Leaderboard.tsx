"use client";

import type { FC, ReactNode } from "react";
import {
  LeaderboardItem,
  type NormalizedLeaderboardList,
} from "@/server/api/routers/leaderboard";

import { use, useEffect, useState } from "react";
import { format } from "date-fns";
import { diffFromNow, longDateFormat } from "../helpers/dateFormatHelpers";

/**
 * Helper function to convert milliseconds to mm:ss.SSS format
 */
function millisecondsToLaptime(milliseconds: number): string {
  const date = new Date(milliseconds);
  return format(date, "mm:ss.SSS");
}

const TableData: FC<{
  children: ReactNode;
  className?: string;
  isHighlighted?: boolean;
}> = ({ children, className, isHighlighted }) => {
  const highlightClasses = isHighlighted
    ? "border-y border-y-table-highlighted-row-border first:border-l first:border-l-table-highlighted-row-border last:border-r last:border-r-table-highlighted-row-border bg-table-highlighted-row-bg"
    : "last:border-r-0";

  return (
    <td
      className={`text-shadow-sm border-r border-gray-700 px-3 py-[10px] font-mono text-base font-semibold first:rounded-l-lg last:rounded-r-lg ${className} ${highlightClasses}`}
    >
      {children}
    </td>
  );
};

type RaceResultsProps = {
  results: Promise<NormalizedLeaderboardList | null>;
};

export default function Leaderboard({ results }: RaceResultsProps) {
  const unsortedResults = use(results);
  const tabs = ["Driver best", "All"] as const;
  const [activeTab, setActiveTab] =
    useState<(typeof tabs)[number]>("Driver best");
  const [highlightedRowIndex, setHighlightedRowIndex] = useState<number | null>(
    null,
  );

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

  const handleRowClick = (index: number) => {
    if (activeTab === "Driver best" && index < 3) {
      return;
    }

    if (highlightedRowIndex === index) {
      setHighlightedRowIndex(null);
      return;
    }

    setHighlightedRowIndex(index);
  };

  useEffect(() => {
    setHighlightedRowIndex(null);
  }, [activeTab]);

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
          <thead>
            <tr>
              <th className="px-4 text-start">#</th>
              <th className="px-4 text-start">Driver</th>
              <th className="px-4 text-start">Laptime</th>
              <th className="px-4 text-start">Gap to leader</th>
              <th className="px-4 text-start">Gap to next</th>
              <th className="px-4 text-start">Date</th>
            </tr>
          </thead>
          <tbody>
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

              const podiumColors = [
                "bg-podium-gold",
                "bg-podium-silver",
                "bg-podium-bronze",
              ];

              const defaultRowBgClass = "bg-gray-800";
              const podiumColor =
                activeTab === "Driver best"
                  ? (podiumColors[index] ?? defaultRowBgClass)
                  : defaultRowBgClass;

              const isHighlighted = (() => {
                if (activeTab === "Driver best" && index < 3) {
                  return false;
                }

                if (highlightedRowIndex === null) {
                  return false;
                }

                return highlightedRowIndex === index;
              })();

              return (
                <tr
                  key={index}
                  onClick={() => handleRowClick(index)}
                  className={`${podiumColor} border-table-highlighted-row-border`}
                >
                  <TableData
                    isHighlighted={isHighlighted}
                    className="text-center"
                  >
                    {index + 1}
                  </TableData>
                  <TableData isHighlighted={isHighlighted}>
                    {result.driverName}
                  </TableData>
                  <TableData isHighlighted={isHighlighted}>
                    {laptimeFormattedDuration}
                  </TableData>
                  <TableData isHighlighted={isHighlighted}>
                    {index === 0 ? "-" : formattedGapToLeader}
                  </TableData>
                  <TableData isHighlighted={isHighlighted}>
                    {index === 0 ? "-" : formattedGapToNext}
                  </TableData>
                  <TableData isHighlighted={isHighlighted}>
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
