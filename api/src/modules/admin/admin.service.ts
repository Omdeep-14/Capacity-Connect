import { findPendingTrainers } from "./admin.repository.js";
import {
  updateTrainerStatusRepo,
  getTrainersByCompetency,
} from "./admin.repository.js";
import { updateTrainerStatusModelType } from "./admin.model.js";

export const getPendingTrainers = async () => {
  return await findPendingTrainers();
};

export const updateTrainerStatus = async (
  applicationId: number,
  reviewedBy: number,
  reviewedAt: Date,
  data: updateTrainerStatusModelType,
) => {
  return await updateTrainerStatusRepo(
    applicationId,
    reviewedBy,
    reviewedAt,
    data,
  );
};

export const competencyMatchService = async (competencyId: number) => {
  return await getTrainersByCompetency(competencyId);
};
