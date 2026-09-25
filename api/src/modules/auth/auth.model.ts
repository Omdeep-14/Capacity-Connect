import { z } from "zod";

export const signInModel = z.object({
  email: z.email(),
  password: z.string().min(6).max(32),
});

export const signUpModel = z.object({
  name: z.string().min(3).max(32),
  email: z.email(),
  password: z.string().min(6).max(32),
  roleId: z.coerce.number().pipe(z.union([z.literal(2), z.literal(3)])),
});

export type SignInModelType = z.infer<typeof signInModel>;
export type SignUpModelType = z.infer<typeof signUpModel>;
