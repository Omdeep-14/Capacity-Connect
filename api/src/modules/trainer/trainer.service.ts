import {
  trainerDetailsType,
  addTrainerCompetencyType,
} from "./trainer.model.js";
import { AppError } from "../../utils/appError.js";
import {
  saveTrainerPersonalDetails,
  findTrainerId,
  getTrainerId,
  competencyExists,
  trainerCompetencyExists,
  saveTrainerCompetencyDetails,
} from "./trainer.repository.js";

export const trainerDetailService = async (
  userId: number,
  { bio, experienceYears, linkdein_url, github_url }: trainerDetailsType,
) => {
  if (await findTrainerId(userId)) {
    throw new AppError(409, "Trainer details already exist");
  }

  return await saveTrainerPersonalDetails(
    userId,
    bio,
    experienceYears,
    linkdein_url,
    github_url,
  );
};

export const trainerCompetencies = async (
  userId: number,
  { competencyId, yearsOfExperience }: addTrainerCompetencyType,
) => {
  const trainerId = await getTrainerId(userId);

  if (!(await competencyExists(competencyId))) {
    throw new AppError(404, "Competency not found");
  }

  if (await trainerCompetencyExists(trainerId, competencyId)) {
    throw new AppError(409, "Competency already added");
  }

  return await saveTrainerCompetencyDetails(
    trainerId,
    competencyId,
    yearsOfExperience,
  );
};
