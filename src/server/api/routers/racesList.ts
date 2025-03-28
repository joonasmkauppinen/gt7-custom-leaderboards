import { google } from "googleapis";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { env } from "@/env";
import { getGoogleAuthOptions } from "@/app/helpers/getGoogleAuthOptions";

type GoogleSheetRacesListValues = Array<Array<string>>;

export type RaceListItem = {
  car: string;
  carImageUrl?: string;
  raceCreatedAtDate: string;
  raceResultsSheetName?: string;
  region: string;
  trackCountryFlag?: string;
  trackCountryName: string;
  trackLayout: string;
  trackLengthInMeters?: number;
  trackLocation: string;
  trackLocationLogoUrl?: string;
  trackMapImageUrl?: string;
  trackPromoImageUrl?: string;
};

type NormalizedRacesList = Array<RaceListItem>;

const SHEET_NAME = "races-list";

const normalizeRacesList = (
  racesListValues: GoogleSheetRacesListValues,
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
    }, {}) as RaceListItem;

    return raceListItem;
  });
};

export const racesListRouter = createTRPCRouter({
  getRacesList: publicProcedure.query(async () => {
    const auth = await google.auth.getClient(
      getGoogleAuthOptions({ scope: "readonly" }),
    );
    const service = google.sheets({ version: "v4", auth });

    try {
      const result = await service.spreadsheets.values.get({
        spreadsheetId: env.SHEET_ID,
        range: `${SHEET_NAME}!A:M`,
      });

      const racesListValues = result.data.values as GoogleSheetRacesListValues;
      const normalizedRacesList = normalizeRacesList(racesListValues);

      return normalizedRacesList;
    } catch (error) {
      return null;
    }
  }),
});
