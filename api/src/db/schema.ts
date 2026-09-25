import {
  integer,
  pgTable,
  varchar,
  bigint,
  pgEnum,
  text,
  timestamp,
  smallint,
  boolean,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

//required types
export const userStatusEnum = pgEnum("user_status_enum", [
  "active",
  "pending",
  "rejected",
  "suspended",
]);

export const trainerApprovalStatusEnum = pgEnum(
  "trainer_approval_status_enum",
  ["approved", "pending", "rejected"],
);

export const resourceTypeEnum = pgEnum("resource_type_enum", [
  "pdf",
  "video",
  "image",
  "audio",
]);

export const quizEnum = pgEnum("quiz_options_enum", ["a", "b", "c", "d", "e"]);

//user roles table
export const roles = pgTable("roles", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).unique().notNull(),
});

//users table
export const users = pgTable("users", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  roleId: bigint("role_id", { mode: "number" })
    .notNull()
    .references(() => roles.id),
  status: userStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

//trainee profiles table
export const traineeProfiles = pgTable("trainee_profiles", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  userId: bigint("user_id", { mode: "number" })
    .notNull()
    .references(() => users.id),
  bio: text("bio"),
  phone: varchar({ length: 15 }),
  location: varchar({ length: 255 }),
  profile_photo_url: text("profile_photo_url"),
  linkdein_url: text("linkdein_url"),
  github_url: text("github_url"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

//Trainee Qualification
export const traineeQualifications = pgTable("trainee_qualifications", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  traineeId: bigint("trainee_id", { mode: "number" })
    .notNull()
    .references(() => traineeProfiles.id, { onDelete: "cascade" }),
  degree: varchar({ length: 255 }).notNull(),
  institution: varchar({ length: 255 }).notNull(),
  startYear: integer("start_year").notNull(),
  endYear: integer("end_year").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const organizations = pgTable("organizations", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 300 }),
  email: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const departments = pgTable("departments", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  organizationId: bigint("organization_id", { mode: "number" })
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const traineeExperiences = pgTable("trainee_experiences", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  traineeId: bigint("trainee_id", { mode: "number" })
    .notNull()
    .references(() => traineeProfiles.id, { onDelete: "cascade" }),
  organization: varchar({ length: 255 }).notNull(),
  jobTitle: varchar("jobTitle", { length: 255 }).notNull(),
  description: varchar({ length: 300 }),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const skills = pgTable("skills", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }),
});

export const traineeSkills = pgTable("trainee_skills", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  traineeId: bigint("trainee_id", { mode: "number" })
    .notNull()
    .references(() => traineeProfiles.id, { onDelete: "cascade" }),
  skillId: bigint("skill_id", { mode: "number" })
    .notNull()
    .references(() => skills.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const trainer = pgTable(
  "trainer",
  {
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    userId: bigint("user_id", { mode: "number" })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    bio: varchar({ length: 300 }),
    experienceYears: smallint("experience_years"),
    linkdein_url: text("linkdein_url"),
    github_url: text("github_url"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("trainer_active_user_id_unique")
      .on(table.userId)
      .where(sql`${table.deletedAt} IS NULL`),
  ],
);

export const trainerApproval = pgTable("trainer_approval", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  trainerId: bigint("trainer_id", { mode: "number" })
    .notNull()
    .references(() => trainer.id, { onDelete: "cascade" }),

  status: trainerApprovalStatusEnum("status").notNull().default("pending"),
  reviewedBy: bigint("reviewed_by", { mode: "number" }).references(
    () => users.id,
  ),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  actionReason: varchar("action_reason", { length: 300 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const competencies = pgTable("competencies", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 300 }),
  createdAt: timestamp("created_at", { withTimezone: true }),
});

export const trainerCompetencies = pgTable(
  "trainer_competencies",
  {
    trainerId: bigint("trainer_id", { mode: "number" })
      .notNull()
      .references(() => trainer.id, { onDelete: "cascade" }),
    competencyId: bigint("competency_id", { mode: "number" })
      .notNull()
      .references(() => competencies.id, { onDelete: "cascade" }),
    yearsOfExperience: smallint("years_of_experience"),
    verifed: boolean("is_verified").notNull().default(false),
  },
  (table) => [
    uniqueIndex("trainer_competency_unique").on(
      table.trainerId,
      table.competencyId,
    ),
  ],
);

//courses
export const courses = pgTable("courses", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  title: varchar("title", { length: 300 }).notNull(),
  trainerId: bigint("trainer_id", { mode: "number" })
    .notNull()
    .references(() => trainer.id, { onDelete: "cascade" }),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const courseModules = pgTable("course_modules", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  courseId: bigint({ mode: "number" })
    .notNull()
    .references(() => courses.id),
  title: varchar("title", { length: 300 }).notNull(),
  description: text("description"),
  position: integer(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const resources = pgTable("modules_resources", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  moduleId: bigint("module_id", { mode: "number" })
    .notNull()
    .references(() => courseModules.id),
  title: varchar("title", { length: 300 }).notNull(),
  type: resourceTypeEnum("type").notNull(),
  url: text("url").notNull(),
  position: integer().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const courseCompetencies = pgTable("course_competencies", {
  courseId: bigint("course_id", { mode: "number" })
    .notNull()
    .references(() => courses.id),
  competencyId: bigint("competency_id", { mode: "number" })
    .notNull()
    .references(() => competencies.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const courseEnrollments = pgTable(
  "course_enrollments",
  {
    courseId: bigint("course_id", { mode: "number" })
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),

    userId: bigint("user_id", { mode: "number" })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    primaryKey({
      columns: [table.courseId, table.userId],
    }),
  ],
);

export const assessments = pgTable("assessments", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  moduleId: bigint("module_id", { mode: "number" })
    .notNull()
    .references(() => courseModules.id, { onDelete: "cascade" }),
  title: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const questions = pgTable("questions", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  assessmentId: bigint({ mode: "number" })
    .notNull()
    .references(() => assessments.id),
  question: text().notNull(),
  optionA: text().notNull(),
  optionB: text().notNull(),
  optionC: text().notNull(),
  optionD: text().notNull(),
  optionE: text().notNull(),
  correctOption: quizEnum().notNull(),
  marks: integer().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
