import { SignInModelType, SignUpModelType } from "./auth.model.js";
import { db } from "../../db/db.js";
import { users } from "../../db/schema.js";
import { eq, and, isNull } from "drizzle-orm";
import { AppError } from "../../utils/appError.js";
import { generateJWTToken, verifyJWTToken } from "../../utils/jwt.js";

export const signInService = async ({ email, password }: SignInModelType) => {
  const existingUser = await db
    .select()
    .from(users)
    .where(and(eq(users.email, email), isNull(users.deletedAt)))
    .limit(1);

  if (existingUser.length === 0) {
    throw new AppError(401, "Invalid email or password");
  }

  const [existingUserData] = existingUser;

  const hashPass = existingUserData.passwordHash;

  if (hashPass !== password) {
    throw new AppError(401, "Invalid email or password");
  }

  const token = await generateJWTToken(
    existingUserData.id.toString(),
    existingUserData.roleId.toString(),
  );

  return token;
};

export const signUpService = async ({
  name,
  email,
  password,
  roleId,
}: SignUpModelType) => {
  const existingUser = await db
    .select()
    .from(users)
    .where(and(eq(users.email, email), isNull(users.deletedAt)))
    .limit(1);

  if (existingUser.length) {
    throw new AppError(409, "User already exists");
  }

  const [newUser] = await db
    .insert(users)
    .values({
      name: name,
      email: email,
      passwordHash: password,
      roleId: roleId,
      status: roleId === 3 ? "active" : "pending",
    })
    .returning();

  const userId = newUser.id;
  const userRoleId = newUser.roleId;

  const token = await generateJWTToken(
    userId.toString(),
    userRoleId.toString(),
  );

  return token;
};
