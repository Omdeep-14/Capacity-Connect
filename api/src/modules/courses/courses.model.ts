import { z } from "zod";

export const courseModel = z.object({
  title: z
    .string()
    .min(1, "Title should have atleast one character")
    .max(300, "title can have max 300 characters"),

  description: z.string().max(1000, "description can have max 1000 characters"),
});

export const courseModules = z.object({
  courseId: z.number().int().positive(),
  title: z
    .string()
    .min(1, "Title should have atleast one character")
    .max(300, "Title can have max 300 characters"),
  description: z.string().max(1000, "description can have max 1000 characters"),
  position: z.number(),
});

export const resourcesModel = z.object({
  moduleId: z.number().int().positive(),
  title: z
    .string()
    .min(1, "title should have minimum 1 character")
    .max(300, "title can have max 300 characters"),
  type: z.enum(["video", "image", "pdf", "audio"]),
  url: z.url(),
  position: z.number(),
});

export const createAssessmentModel = z.object({
  moduleId: z.coerce.number().int().positive(),

  title: z.string().trim().min(1).max(200),

  description: z.string().trim(),

  questions: z
    .array(
      z.object({
        question: z.string().trim().min(1),

        optionA: z.string().trim().min(1),
        optionB: z.string().trim().min(1),
        optionC: z.string().trim().min(1),
        optionD: z.string().trim().min(1),
        optionE: z.string().trim().min(1),

        correctOption: z.enum(["a", "b", "c", "d"]),

        marks: z.coerce.number().int().positive(),
      }),
    )
    .min(1),
});

export type courseModelType = z.infer<typeof courseModel>;
export type courseModuleModelType = z.infer<typeof courseModules>;
export type resourcesType = z.infer<typeof resourcesModel>;
export type createAssessmentType = z.infer<typeof createAssessmentModel>;
