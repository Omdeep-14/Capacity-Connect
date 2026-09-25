import { z } from "zod";

export const trainerDetailsModel = z.object({
  bio: z.string().max(300, "bio can have maximum 300 characters"),
  experienceYears: z
    .int()
    .min(-32768, { message: "Value is too small for a smallint" })
    .max(32767, { message: "Value is too large for a smallint" }),
  linkdein_url: z.url("Please enter a valid url"),
  github_url: z.url("Please enter a valid url"),
});

export const createCompetencyModel = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Competency should have min 2 characters")
    .max(255, "Competency can have max 255 characters"),

  description: z
    .string()
    .trim()
    .max(300, "Description can have max 300 characters")
    .optional(),
});

export const addTrainerCompetencyModel = z.object({
  competencyId: z.number().int().positive(),

  yearsOfExperience: z.number().int().min(0).max(60),
});

export type createCompetencyType = z.infer<typeof createCompetencyModel>;
export type addTrainerCompetencyType = z.infer<
  typeof addTrainerCompetencyModel
>;
export type trainerDetailsType = z.infer<typeof trainerDetailsModel>;
