import type { Request, Response, NextFunction } from "express";

import { verifyJWTToken } from "../utils/jwt.js";
import { AppError } from "../utils/appError.js";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.jwt;

  if (!token) {
    throw new AppError(401, "Authentication required");
  }

  const payload = await verifyJWTToken(token);

  if (!payload.sub || typeof payload.role !== "string") {
    throw new AppError(401, "Invalid authentication token");
  }

  req.user = {
    id: Number(payload.sub),
    role: payload.role,
  };

  next();
};
