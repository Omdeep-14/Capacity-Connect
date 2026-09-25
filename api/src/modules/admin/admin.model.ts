import { z } from "zod";

export const updateTrainerStatusModel = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("approved"),
    actionReason: z.never().optional(),
  }),
  z.object({
    status: z.literal("rejected"),
    actionReason: z.string().trim().min(1).max(300),
  }),
]);

export type updateTrainerStatusModelType = z.infer<
  typeof updateTrainerStatusModel
>;
