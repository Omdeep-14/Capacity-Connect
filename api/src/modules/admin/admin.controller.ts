import { Request, Response } from "express";
import {
  getPendingTrainers,
  updateTrainerStatus,
  competencyMatchService,
} from "./admin.service.js";
import { updateTrainerStatusModel } from "./admin.model.js";
import { AppError } from "../../utils/appError.js";

export const getTrainers = async (req: Request, res: Response) => {
  const trainers = await getPendingTrainers();

  res.status(200).json({
    success: true,
    data: trainers,
  });
};

export const updateTrainerStatusService = async (
  req: Request,
  res: Response,
) => {
  const validData = updateTrainerStatusModel.safeParse(req.body);
  if (!validData.success) {
    throw new AppError(400, "Invalid data provided");
  }
  const applicationId = Number(req.params.applicationId);
  if (!Number.isInteger(applicationId) || applicationId <= 0) {
    throw new AppError(400, "Invalid application id");
  }
  const data = validData.data;
  const reviewed_by = Number(req.user.id);
  const reviewed_at = new Date();

  await updateTrainerStatus(applicationId, reviewed_by, reviewed_at, data);

  res.status(200).json({
    success: true,
    message: "Trainer status updated successfully",
  });
};

export const competencyMatch = async (req: Request, res: Response) => {
  const competencyId = Number(req.body);
  if (Number.isNaN(competencyId) || competencyId <= 0) {
    throw new AppError(400, "Invalid competency");
  }
  await competencyMatchService(competencyId);

  return res.status(201).json({
    success: true,
    messagae: "competencies matched successfully",
  });
};
