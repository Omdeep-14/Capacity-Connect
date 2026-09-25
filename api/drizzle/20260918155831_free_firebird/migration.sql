CREATE TYPE "trainer_approval_status_enum" AS ENUM('approved', 'pending', 'rejected');--> statement-breakpoint
CREATE TABLE "competencies" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "competencies_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"description" varchar(300),
	"created_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "departments" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "departments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"organization_id" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "organizations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"description" varchar(300),
	"email" varchar(255) NOT NULL UNIQUE,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "skills_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"created_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "trainee_experiences" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "trainee_experiences_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"trainee_id" bigint NOT NULL,
	"organization" varchar(255) NOT NULL,
	"jobTitle" varchar(255) NOT NULL,
	"description" varchar(300),
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trainee_profiles" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "trainee_profiles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"user_id" bigint NOT NULL,
	"bio" text,
	"phone" varchar(15),
	"location" varchar(255),
	"profile_photo_url" text,
	"linkdein_url" text,
	"github_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "trainee_qualifications" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "trainee_qualifications_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"trainee_id" bigint NOT NULL,
	"degree" varchar(255) NOT NULL,
	"institution" varchar(255) NOT NULL,
	"start_year" integer NOT NULL,
	"end_year" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trainee_skills" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "trainee_skills_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"trainee_id" bigint NOT NULL,
	"skill_id" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trainer" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "trainer_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"user_id" bigint NOT NULL,
	"bio" varchar(300),
	"experience_years" smallint,
	"linkdein_url" text,
	"github_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "trainer_approval" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "trainer_approval_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"trainer_id" bigint NOT NULL,
	"application_note" varchar(300),
	"status" "trainer_approval_status_enum" DEFAULT 'pending'::"trainer_approval_status_enum" NOT NULL,
	"reviewed_by" bigint,
	"reviewed_at" timestamp with time zone,
	"rejection_reason" varchar(300),
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trainer_competencies" (
	"trainer_id" bigint NOT NULL,
	"competency_id" bigint NOT NULL,
	"years_of_experience" smallint,
	"is_verified" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "departments" ADD CONSTRAINT "departments_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "trainee_experiences" ADD CONSTRAINT "trainee_experiences_trainee_id_trainee_profiles_id_fkey" FOREIGN KEY ("trainee_id") REFERENCES "trainee_profiles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "trainee_profiles" ADD CONSTRAINT "trainee_profiles_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "trainee_qualifications" ADD CONSTRAINT "trainee_qualifications_trainee_id_trainee_profiles_id_fkey" FOREIGN KEY ("trainee_id") REFERENCES "trainee_profiles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "trainee_skills" ADD CONSTRAINT "trainee_skills_trainee_id_trainee_profiles_id_fkey" FOREIGN KEY ("trainee_id") REFERENCES "trainee_profiles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "trainee_skills" ADD CONSTRAINT "trainee_skills_skill_id_skills_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "trainer" ADD CONSTRAINT "trainer_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "trainer_approval" ADD CONSTRAINT "trainer_approval_trainer_id_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainer"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "trainer_approval" ADD CONSTRAINT "trainer_approval_reviewed_by_users_id_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "trainer_competencies" ADD CONSTRAINT "trainer_competencies_trainer_id_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainer"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "trainer_competencies" ADD CONSTRAINT "trainer_competencies_competency_id_competencies_id_fkey" FOREIGN KEY ("competency_id") REFERENCES "competencies"("id") ON DELETE CASCADE;