import { and, eq, isNull, desc, sql } from "drizzle-orm";
import { db } from "../../db/db.js";
import {
  competencies,
  trainer,
  trainerCompetencies,
  trainerApproval,
  users,
} from "../../db/schema.js";
import { AppError } from "../../utils/appError.js";

export const findTrainerId = async (userId: number) => {
  const [reqTrainer] = await db
    .select({ id: trainer.id })
    .from(trainer)
    .where(and(eq(trainer.userId, userId), isNull(trainer.deletedAt)));

  return reqTrainer?.id;
};

export const getTrainerId = async (userId: number) => {
  const trainerId = await findTrainerId(userId);

  if (!trainerId) {
    throw new AppError(404, "Not eligible trainer");
  }
  return trainerId;
};

export const competencyExists = async (competencyId: number) => {
  const [competency] = await db
    .select({ id: competencies.id })
    .from(competencies)
    .where(eq(competencies.id, competencyId));

  return Boolean(competency);
};

export const trainerCompetencyExists = async (
  trainerId: number,
  competencyId: number,
) => {
  const [existingCompetency] = await db
    .select({ trainerId: trainerCompetencies.trainerId })
    .from(trainerCompetencies)
    .where(
      and(
        eq(trainerCompetencies.trainerId, trainerId),
        eq(trainerCompetencies.competencyId, competencyId),
      ),
    );

  return Boolean(existingCompetency);
};

export const saveTrainerPersonalDetails = async (
  userId: number,
  bio: string,
  experienceYears: number,
  linkdein_url: string,
  github_url: string,
) => {
  return db.insert(trainer).values({
    userId: userId,
    bio: bio,
    experienceYears: experienceYears,
    linkdein_url: linkdein_url,
    github_url: github_url,
  });
};

export const saveTrainerCompetencyDetails = async (
  trainerId: number,
  competencyId: number,
  yearsOfExperience: number,
) => {
  return await db.insert(trainerCompetencies).values({
    trainerId,
    competencyId,
    yearsOfExperience,
  });
};

