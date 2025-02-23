import { google } from "googleapis";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

type GoogleSheetRaceResultsValues = Array<Array<string>>;
export type LeaderboardItem = {
  driverName: string;
  laptimeGoogleSheetsDuration: string;
  dateAdded: string;
  laptimeInMs: string;
};
export type NormalizedLeaderboardList = Array<LeaderboardItem>;

const normalizeLeaderboard = (
  leaderboardResultsValues: GoogleSheetRaceResultsValues,
): NormalizedLeaderboardList => {
  const keys = leaderboardResultsValues[0];

  if (!keys) {
    return [];
  }

  const values = leaderboardResultsValues.slice(1);

  return values.map((valuesRow) => {
    const leaderboardListItem = keys.reduce((acc, key, index) => {
      // @ts-expect-error - we know that the valuesRow has the same length as keys
      acc[key] = valuesRow[index];
      return acc;
    }, {}) as LeaderboardItem;

    return leaderboardListItem;
  });
};

export const leaderboardRouter = createTRPCRouter({
  getLeaderboard: publicProcedure
    .input(z.object({ sheetName: z.string() }))
    .query(async ({ input }) => {
      const auth = await google.auth.getClient({
        scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
      });
      const service = google.sheets({ version: "v4", auth });

      try {
        const result = await service.spreadsheets.values.get({
          spreadsheetId: process.env.SHEET_ID,
          range: `${input.sheetName}!A:D`,
        });

        const leaderboardValues = result.data
          .values as GoogleSheetRaceResultsValues;
        return normalizeLeaderboard(leaderboardValues);
      } catch (error) {
        return null;
      }
    }),
});
