import { z } from "zod";

const envSchema = z.looseObject({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(["dev", "prod", "test"]),
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(1),
});

const envValid = envSchema.passthrough().safeParse(process.env);

if (!envValid.success) {
  console.error("wrong environment variables provided");
  const error = z.treeifyError(envValid.error);
  console.error(JSON.stringify(error, null, 2));

  process.exit(1);
}

export const env = envValid.data;
export type Env = z.infer<typeof envSchema>;
