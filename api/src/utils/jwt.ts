import { env } from "../config/env.js";
import { SignJWT, jwtVerify } from "jose";
import { AppError } from "./error.js";

const secret = new TextEncoder().encode(env.JWT_SECRET);
const alg = "HS256";

export const generateJWTToken = async (
  userId: string,
  role: string,
): Promise<string> => {
  return new SignJWT({ type: "access" })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setSubject(userId)
    .sign(secret);
};

export const verifyJWTToken = async (token: string) => {
  const { payload } = await jwtVerify(token, secret, {
    algorithms: [alg],
  });
  if (payload.type !== "access") {
    throw new AppError(401, "Invalid token type");
  }

  return payload;
};
