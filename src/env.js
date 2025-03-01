import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    SHEET_ID: z.string(),
    ADMIN_USERNAME: z.string(),
    ADMIN_PASSWORD: z.string(),
    AUTH_SECRET: z.string(),
    GCP_PROJECT_ID: z.string(),
    // GCP_PRIVATE_KEY_ID: z.string(),
    GCP_PRIVATE_KEY: z.string(),
    GCP_SERVICE_ACCOUNT_EMAIL: z.string(),
    // GCP_CLIENT_ID: z.string(),
    // GCP_CLIENT_X509_CERT_URL: z.string(),
    // GCP_AUTH_URI: z.string(),
    // GCP_TOKEN_URI: z.string(),
    // GCP_AUTH_PROVIDER_X509_CERT_URL: z.string(),
    // GCP_UNIVERSE_DOMAIN: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    SHEET_ID: process.env.SHEET_ID,
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    AUTH_SECRET: process.env.AUTH_SECRET,
    GCP_SERVICE_ACCOUNT_EMAIL: process.env.GCP_SERVICE_ACCOUNT_EMAIL,
    GCP_PRIVATE_KEY: process.env.GCP_PRIVATE_KEY,
    GCP_PROJECT_ID: process.env.GCP_PROJECT_ID,
    // GCP_AUTH_PROVIDER_X509_CERT_URL:
    //   process.env.GCP_AUTH_PROVIDER_X509_CERT_URL,
    // GCP_AUTH_URI: process.env.GCP_AUTH_URI,
    // GCP_CLIENT_ID: process.env.GCP_CLIENT_ID,
    // GCP_CLIENT_X509_CERT_URL: process.env.GCP_CLIENT_X509_CERT_URL,
    // GCP_PRIVATE_KEY_ID: process.env.GCP_PRIVATE_KEY_ID,
    // GCP_TOKEN_URI: process.env.GCP_TOKEN_URI,
    // GCP_UNIVERSE_DOMAIN: process.env.GCP_UNIVERSE_DOMAIN,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
