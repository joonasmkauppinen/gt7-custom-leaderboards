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
        console.log(error);
      }
    }),

  postLapTime: publicProcedure
    .input(
      z.object({
        sheetName: z.string(),
        driverName: z.string(),
        laptimeGoogleSheetsDuration: z.string(),
        dateAdded: z.string(),
        laptimeInMs: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const auth = await google.auth.getClient({
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });
      const service = google.sheets({ version: "v4", auth });

      const values = [
        [
          input.driverName,
          input.laptimeGoogleSheetsDuration,
          input.dateAdded,
          input.laptimeInMs,
        ],
      ];

      const resource = {
        values,
      };

      try {
        // @ts-expect-error - append function does take in the resource parameter
        const result = await service.spreadsheets.values.append({
          spreadsheetId: process.env.SHEET_ID,
          range: `${input.sheetName}!A1`,
          insertDataOption: "INSERT_ROWS",
          valueInputOption: "USER_ENTERED",
          resource,
        });
        // @ts-expect-error - we know that the result has a data property
        console.log(result.data);
      } catch (error) {
        console.error(error);
      }
    }),
});
