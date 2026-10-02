import { z } from "zod";

export const authModel = z.object({
  email: z.email(),
  password: z.string().min(5).max(12),
});

export type authModelType = z.infer<typeof authModel>;
