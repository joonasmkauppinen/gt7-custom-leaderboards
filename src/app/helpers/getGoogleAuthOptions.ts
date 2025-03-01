import { env } from "@/env";

export const getGoogleAuthOptions = ({
  scope,
}: {
  scope: "readonly" | "write";
}) => {
  const sheetScope =
    scope === "readonly"
      ? "https://www.googleapis.com/auth/spreadsheets.readonly"
      : "https://www.googleapis.com/auth/spreadsheets";

  return {
    scopes: [sheetScope],
    credentials: {
      client_email: env.GCP_SERVICE_ACCOUNT_EMAIL,
      private_key: env.GCP_PRIVATE_KEY,
    },
    projectId: env.GCP_PROJECT_ID,
  };
};
