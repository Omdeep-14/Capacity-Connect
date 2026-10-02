import { smallint, timestamp } from "drizzle-orm/pg-core";
import { pgTable, bigint, text, pgEnum } from "drizzle-orm/pg-core";

//Enums
export const userRolesEnum = pgEnum("user_roles_enum", [
  "super admin",
  "admin",
  "trainer",
  "trainee",
]);

//user
export const userSchema = pgTable("users", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  email: text("email"),
  passwordHash: text("password_hash"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

//roles
export const roles = pgTable("roles", {
  id: smallint().primaryKey().generatedAlwaysAsIdentity(),
  role: userRolesEnum("role").notNull(),
});
