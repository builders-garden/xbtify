import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

// https://env.t3.gg/docs/nextjs
export const env = createEnv({
  server: {
    NEYNAR_API_KEY: z.string().min(1),
    JWT_SECRET: z.string().min(1),
    NOTIFICATION_SECRET: z.string().min(1),
    DATABASE_URL: z.string().min(1),
    AI_SERVICE_URL: z.string().url().min(1),
    AI_SERVICE_API_KEY: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_APP_ENV: z
      .enum(["development", "production"])
      .optional()
      .default("production"),
    // farcaster manifest
    NEXT_PUBLIC_URL: z.string().min(1),
    NEXT_PUBLIC_FARCASTER_HEADER: z.string().min(1),
    NEXT_PUBLIC_FARCASTER_PAYLOAD: z.string().min(1),
    NEXT_PUBLIC_FARCASTER_SIGNATURE: z.string().min(1),
    NEXT_PUBLIC_BASE_BUILDER_ADDRESS: z.string().min(1),
    // maintenance
    NEXT_PUBLIC_IS_IN_MAINTENANCE: z
      .string()
      .refine((s) => s === "true" || s === "false")
      .transform((s) => s === "false"),
    NEXT_PUBLIC_MAINTENANCE_END_TIME: z.string().optional(),
    // application general info
    NEXT_PUBLIC_APPLICATION_NAME: z.string().min(1),
    NEXT_PUBLIC_APPLICATION_DESCRIPTION: z.string().min(1),
  },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: {
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_FARCASTER_HEADER: process.env.NEXT_PUBLIC_FARCASTER_HEADER,
    NEXT_PUBLIC_FARCASTER_PAYLOAD: process.env.NEXT_PUBLIC_FARCASTER_PAYLOAD,
    NEXT_PUBLIC_FARCASTER_SIGNATURE:
      process.env.NEXT_PUBLIC_FARCASTER_SIGNATURE,
    NEXT_PUBLIC_BASE_BUILDER_ADDRESS:
      process.env.NEXT_PUBLIC_BASE_BUILDER_ADDRESS,
    NEXT_PUBLIC_IS_IN_MAINTENANCE: process.env.NEXT_PUBLIC_IS_IN_MAINTENANCE,
    NEXT_PUBLIC_MAINTENANCE_END_TIME:
      process.env.NEXT_PUBLIC_MAINTENANCE_END_TIME,
    NEXT_PUBLIC_APPLICATION_NAME: process.env.NEXT_PUBLIC_APPLICATION_NAME,
    NEXT_PUBLIC_APPLICATION_DESCRIPTION:
      process.env.NEXT_PUBLIC_APPLICATION_DESCRIPTION,
  },
});
