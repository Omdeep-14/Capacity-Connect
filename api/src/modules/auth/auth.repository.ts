import { eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { userSchema } from "../../db/schema.js";
import { AppError } from "../../utils/error.js";

export const userExistsRepo = async (userEmail: string) => {
  const user = await db
    .select({ email: userSchema.email })
    .from(userSchema)
    .where(eq(userSchema.email, userEmail));

  return user.length > 0;
};
