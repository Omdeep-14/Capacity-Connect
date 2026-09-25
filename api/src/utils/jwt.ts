import { env } from "../config/env.js";
import { SignJWT, jwtVerify } from "jose";
import { AppError } from "./appError.js";

const secret = new TextEncoder().encode(env.JWT_SECRET);
const algo = "HS256";

export const generateJWTToken = (
  userId: string,
  role: string,
): Promise<string> => {
  return new SignJWT({ type: "access", role })
    .setProtectedHeader({ alg: algo })
    .setSubject(userId)
    .setIssuedAt()
    .sign(secret);
};

export const verifyJWTToken = async (token: string) => {
  const { payload } = await jwtVerify(token, secret, { algorithms: [algo] });

  if (payload.type !== "access") {
    throw new AppError(401, "Invalid token type");
  }

  return payload;
};
