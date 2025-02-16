import { google } from "googleapis";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

type GoogleSheetRaceResultsValues = Array<Array<string>>;
type RaceResultItem = {
  driverName: string;
  laptimeISO8601Duration: string;
  laptimeFormattedDuration: string;
  laptimeGoogleSheetsDuration: string;
  laptimeISO8601Date: string;
};
type NormalizedRacesList = Array<RaceResultItem>;

const normalizeRacesList = (
  racesListValues: GoogleSheetRaceResultsValues,
): NormalizedRacesList => {
  const keys = racesListValues[0];

  if (!keys) {
    return [];
  }

  const values = racesListValues.slice(1);

  return values.map((valuesRow) => {
    const raceListItem = keys.reduce((acc, key, index) => {
      // @ts-expect-error - we know that the valuesRow has the same length as keys
      acc[key] = valuesRow[index];
      return acc;
    }, {}) as RaceResultItem;

    return raceListItem;
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
          range: `${input.sheetName}!A:E`,
        });

        const racesListValues = result.data
          .values as GoogleSheetRaceResultsValues;
        const normalizedRacesList = normalizeRacesList(racesListValues);

        return normalizedRacesList;
      } catch (error) {
        return null;
      }
    }),
});
