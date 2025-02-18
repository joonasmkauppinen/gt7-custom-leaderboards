import { google } from "googleapis";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

type GoogleSheetDriverNamesValues = Array<Array<string>>;
type NormalizedDriverNames = Array<{ name: string }>;

const SHEET_NAME = "drivers-list";

const normalizeDriverNames = (
  driverNamesValues: GoogleSheetDriverNamesValues,
): NormalizedDriverNames => {
  const filteredDriverNames = driverNamesValues.flat().filter(Boolean);

  return filteredDriverNames.map((driverName) => ({
    name: driverName,
  }));
};

export const driverNamesRouter = createTRPCRouter({
  getNames: publicProcedure.query(async () => {
    const auth = await google.auth.getClient({
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
    const service = google.sheets({ version: "v4", auth });

    try {
      const result = await service.spreadsheets.values.get({
        spreadsheetId: process.env.SHEET_ID,
        range: `${SHEET_NAME}!A:A`,
      });

      const driverNames = result.data.values as GoogleSheetDriverNamesValues;
      const normalizedDriverNames = normalizeDriverNames(driverNames);

      return normalizedDriverNames;
    } catch (error) {
      return null;
    }
  }),
});
