import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError.js";

export const roleCheck = (...reqRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return next(new AppError(401, "unauthorized"));
    }

    if (reqRoles.includes(req.user.role)) {
      return next();
    }

    return next(new AppError(403, "forbidden"));
  };
};
