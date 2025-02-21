import { google } from "googleapis";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

type GoogleSheetRaceResultsValues = Array<Array<string>>;
type RaceResultItem = {
  driverName: string;
  laptimeFormattedDuration: string;
  laptimeGoogleSheetsDuration: string;
  dateAdded: string;
  laptimeISO8601Duration: string;
  laptimeInMs: number;
};
export type NormalizedRaceResultsList = Array<RaceResultItem>;

const normalizeRaceResults = (
  raceResultsValues: GoogleSheetRaceResultsValues,
): NormalizedRaceResultsList => {
  const keys = raceResultsValues[0];

  if (!keys) {
    return [];
  }

  const values = raceResultsValues.slice(1);

  return values.map((valuesRow) => {
    const resultListItem = keys.reduce((acc, key, index) => {
      // @ts-expect-error - we know that the valuesRow has the same length as keys
      acc[key] = valuesRow[index];
      return acc;
    }, {}) as RaceResultItem;

    return resultListItem;
  });
};

export const raceResultsRouter = createTRPCRouter({
  getRaceResult: publicProcedure
    .input(z.object({ sheetName: z.string() }))
    .query(async ({ input }) => {
      const auth = await google.auth.getClient({
        scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
      });
      const service = google.sheets({ version: "v4", auth });

      try {
        const result = await service.spreadsheets.values.get({
          spreadsheetId: process.env.SHEET_ID,
          range: `${input.sheetName}!A:F`,
        });

        const raceResultsValues = result.data
          .values as GoogleSheetRaceResultsValues;
        const normalizedRaceResultsList =
          normalizeRaceResults(raceResultsValues);

        return normalizedRaceResultsList;
      } catch (error) {
        return null;
      }
    }),
});
