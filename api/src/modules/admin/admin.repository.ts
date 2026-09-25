import { eq, isNull, desc, sql, and } from "drizzle-orm";
import { db } from "../../db/db.js";
import {
  trainer,
  users,
  trainerApproval,
  trainerCompetencies,
} from "../../db/schema.js";
import { updateTrainerStatusModelType } from "./admin.model.js";

export const findPendingTrainers = async () => {
  return await db
    .select({
      userId: users.id,
      name: users.name,
      email: users.email,

      bio: trainer.bio,
      experienceYears: trainer.experienceYears,
      linkedinUrl: trainer.linkdein_url,
      githubUrl: trainer.github_url,
    })
    .from(users)
    .innerJoin(trainer, eq(users.id, trainer.userId))
    .where(eq(users.status, "pending"));
};

export const updateTrainerStatusRepo = async (
  applicationId: number,
  reviewedBy: number,
  reviewedAt: Date,
  data: updateTrainerStatusModelType,
) => {
  return await db
    .update(trainerApproval)
    .set({
      status: data.status,
      actionReason: data.actionReason,
      reviewedBy,
      reviewedAt,
    })
    .where(eq(trainerApproval.id, applicationId));
};

export const getTrainersByCompetency = async (competencyId: number) => {
  const latestApproval = db
    .select({
      trainerId: trainerApproval.trainerId,
      status: trainerApproval.status,
      rowNumber: sql<number>`
        ROW_NUMBER() OVER (
          PARTITION BY ${trainerApproval.trainerId}
          ORDER BY ${trainerApproval.createdAt} DESC
        )
      `.as("row_number"),
    })
    .from(trainerApproval)
    .as("latest_approval");

  return db
    .select({
      trainerId: trainer.id,
      userId: users.id,
      name: users.name,
      email: users.email,
      bio: trainer.bio,
      experienceYears: trainer.experienceYears,
      competencyExperience: trainerCompetencies.yearsOfExperience,
    })
    .from(trainerCompetencies)
    .innerJoin(trainer, eq(trainerCompetencies.trainerId, trainer.id))
    .innerJoin(users, eq(trainer.userId, users.id))
    .innerJoin(
      latestApproval,
      and(
        eq(latestApproval.trainerId, trainer.id),
        eq(latestApproval.rowNumber, 1),
      ),
    )
    .where(
      and(
        eq(trainerCompetencies.competencyId, competencyId),
        eq(latestApproval.status, "approved"),
        isNull(trainer.deletedAt),
      ),
    )
    .orderBy(desc(trainerCompetencies.yearsOfExperience));
};
