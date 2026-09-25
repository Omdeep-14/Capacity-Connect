import { create } from "node:domain";
import { db } from "../../db/db.js";
import {
  courses,
  courseModules,
  resources,
  trainer,
  assessments,
  questions,
  users,
} from "../../db/schema.js";
import { AppError } from "../../utils/appError.js";
import { getTrainerId } from "../trainer/trainer.repository.js";
import { resourcesType } from "./courses.model.js";
import { eq, and, isNull, desc } from "drizzle-orm";

export const createCourseRepo = async (
  title: string,
  description: string,
  trainerId: number,
) => {
  return await db.insert(courses).values({
    title: title,
    description: description,
    trainerId: trainerId,
  });
};

export const addModuleRepo = async (
  courseId: number,
  title: string,
  description: string,
  position: number,
) => {
  return await db.insert(courseModules).values({
    courseId: courseId,
    title: title,
    description: description,
    position: position,
  });
};

export const addResourcesRepo = async (resourceData: resourcesType) => {
  return await db.insert(resources).values({
    moduleId: resourceData.moduleId,
    title: resourceData.title,
    type: resourceData.type,
    url: resourceData.url,
    position: resourceData.position,
  });
};

export const getCoursesRepo = async (trainerId: number) => {
  return db
    .select({
      id: courses.id,
      title: courses.title,
      description: courses.description,

      createdAt: courses.createdAt,
      updatedAt: courses.updatedAt,
    })
    .from(courses)
    .where(and(eq(courses.trainerId, trainerId), isNull(courses.deletedAt)))
    .orderBy(desc(courses.createdAt));
};

export const createAssessmentRepo = async (
  userId: number,
  moduleId: number,
  title: string,
  description: string,
  questionList: {
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    optionE: string;
    correctOption: "a" | "b" | "c" | "d" | "e";
    marks: number;
  }[],
) => {
  const trainerId = await getTrainerId(userId);
  return db.transaction(async (tx) => {
    const module = await tx
      .select({
        moduleId: courseModules.id,
      })
      .from(courseModules)
      .innerJoin(courses, eq(courseModules.courseId, courses.id))
      .where(
        and(
          eq(courseModules.id, moduleId),
          eq(courses.trainerId, trainerId),
          isNull(courses.deletedAt),
        ),
      )
      .limit(1);

    if (module.length === 0) {
      throw new AppError(404, "module not found or unauthorized");
    }

    const [assessment] = await tx
      .insert(assessments)
      .values({
        moduleId,
        title,
        description,
      })
      .returning({
        id: assessments.id,
      });

    if (!assessment) {
      throw new AppError(500, "Failed to create assessment");
    }

    const questionRows = questionList.map((q) => ({
      assessmentId: assessment.id,
      question: q.question,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      optionE: q.optionE,
      correctOption: q.correctOption,
      marks: q.marks,
    }));

    await tx.insert(questions).values(questionRows);

    return assessment;
  });
};

export const getACourseRepo = async (courseId: number) => {
  return db.transaction(async (tx) => {
    const [course] = await tx
      .select({
        title: courses.title,
        trainer: users.name,
        description: courses.description,
        createdAt: courses.createdAt,
      })
      .from(courses)
      .innerJoin(trainer, eq(courses.trainerId, trainer.id))
      .innerJoin(users, eq(trainer.userId, users.id))
      .where(and(eq(courses.id, courseId), isNull(courses.deletedAt)))
      .limit(1);

    if (!course) {
      throw new AppError(404, "course not found");
    }

    const modules = await tx
      .select({
        title: courseModules.title,
        description: courseModules.description,
        position: courseModules.position,
        createdAt: courseModules.createdAt,
      })
      .from(courseModules)
      .where(eq(courseModules.courseId, courseId))
      .orderBy(courseModules.position);

    return {
      id: courseId,
      title: course.title,
      description: course.description,
      createdAt: course.createdAt,
      modules: modules,
    };
  });
};
