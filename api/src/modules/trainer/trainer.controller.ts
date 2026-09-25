import { Request, Response } from "express";
import {
  trainerDetailsModel,
  addTrainerCompetencyModel,
} from "./trainer.model.js";
import { AppError } from "../../utils/appError.js";
import {
  trainerCompetencies,
  trainerDetailService,
} from "./trainer.service.js";

export const trainerDetails = async (req: Request, res: Response) => {
  const validatedData = trainerDetailsModel.safeParse(req.body);

  if (!validatedData.success) {
    throw new AppError(400, "Invalid request body");
  }

  const { bio, experienceYears, linkdein_url, github_url } = validatedData.data;

  const userId = req.user.id;

  const trainerDetails = await trainerDetailService(userId, {
    bio,
    experienceYears,
    linkdein_url,
    github_url,
  });

  return res.status(201).json({
    success: true,
    message: "Trainer personal details saved successfully",
    data: trainerDetails,
  });
};

export const trainerCompetencyDetails = async (req: Request, res: Response) => {
  const validData = addTrainerCompetencyModel.safeParse(req.body);

  if (!validData.success) {
    throw new AppError(400, "Invalid request body");
  }

  const { competencyId, yearsOfExperience } = validData.data;

  const userId = req.user.id;

  const trainerCompetency = await trainerCompetencies(userId, {
    competencyId,
    yearsOfExperience,
  });

  return res.status(201).json({
    success: true,
    message: "Trainer competency added successfully",
    data: trainerCompetency,
  });
};
