import { Request, Response } from "express";
import { authModel } from "./auth.model.js";
import { AppError } from "../../utils/error.js";
import { z } from "zod";

export const signin = async (req: Request, res: Response) => {
  const validatedData = authModel.safeParse(req.body);

  if (!validatedData.success) {
    const errorMessage = z.prettifyError(validatedData.error);
    throw new AppError(400, `SignIn validation error ${errorMessage}`);
  }
};

export const signup = async (req: Request, res: Response) => {
  const validatedData = authModel.safeParse(req.body);

  if (!validatedData.success) {
    const errorMessage = z.prettifyError(validatedData.error);

    throw new AppError(400, `Signup validation error ${errorMessage}`);
  }
};
