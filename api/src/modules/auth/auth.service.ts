import type { authModelType } from "./auth.model.js";
import { generateJWTToken, verifyJWTToken } from "../../utils/jwt.js";
import { userExistsRepo } from "./auth.repository.js";
import { AppError } from "../../utils/error.js";
import { hashPass } from "../../utils/hashing.js";

export const signinServices = async (data: authModelType) => {
  const { email, password } = data;

  const userExists = await userExistsRepo(email);

  if (!userExists) {
    throw new AppError(400, "Invalid credentials");
  }

  const hashedPass = await hashPass(password);

  //   const passCheck =
};
