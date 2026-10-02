import { z } from "zod";
import { AppError } from "../utils/error.js";

export const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string(),
});

const ENV = envSchema.safeParse(process.env);

if (!ENV.success) {
  const error = z.prettifyError(ENV.error);
  throw new AppError(400, `Env configuration failed ${error}`);
}

export const env = ENV.data;
