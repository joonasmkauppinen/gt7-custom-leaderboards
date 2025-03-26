/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.wikia.nocookie.net",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "msvstatic.blob.core.windows.net",
      },
      {
        protocol: "https",
        hostname: "weathertechraceway.com",
      },
      {
        protocol: "https",
        hostname: "ugc.gt7.game.gran-turismo.com",
      },
    ],
  },
};

export default config;
