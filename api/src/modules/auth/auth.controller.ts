import type { Request, Response } from "express";
import { signInModel, signUpModel } from "./auth.model.js";
import { AppError } from "../../utils/appError.js";
import { signInService, signUpService } from "./auth.service.js";
import { env } from "../../config/env.js";

export const signInController = async (req: Request, res: Response) => {
  const parsedData = signInModel.safeParse(req.body);

  if (!parsedData.success) {
    throw new AppError(400, "Invalid request body");
  }

  const { email, password } = parsedData.data;

  const token = await signInService({ email, password });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: env.NODE_ENV === "prod",
    sameSite: "none",
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Sign in successful",
    token,
  });
};

export const signUpController = async (req: Request, res: Response) => {
  const parsedData = signUpModel.safeParse(req.body);

  if (!parsedData.success) {
    throw new AppError(400, "Invalid request body");
  }

  const { name, email, password, roleId } = parsedData.data;

  const token = await signUpService({ name, email, password, roleId });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: env.NODE_ENV === "prod",
    sameSite: "none",
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Sign up successful",
    token,
  });
};
