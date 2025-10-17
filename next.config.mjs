import { fileURLToPath } from "node:url";
import createJiti from "jiti";
import { createSecureHeaders } from "next-secure-headers";

const jiti = createJiti(fileURLToPath(import.meta.url));

// Import env here to validate during build. Using jiti@^1 we can import .ts files :)
jiti("./src/lib/env");

/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  headers() {
    return [
      {
        locale: false,
        source: "/(.*)",
        headers: createSecureHeaders({
          frameGuard: false,
          noopen: "noopen",
          nosniff: "nosniff",
          xssProtection: "sanitize",
          forceHTTPSRedirect: [
            true,
            { maxAge: 60 * 60 * 24 * 360, includeSubDomains: true },
          ],
          referrerPolicy: "same-origin",
          contentSecurityPolicy: {
            directives: {
              connectSrc: ["*"],
            },
          },
        }),
      },
    ];
  },
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
