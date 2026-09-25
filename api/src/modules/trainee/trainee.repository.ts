import { db } from "../../db/db.js";
import {
  courses,
  users,
  trainer,
  resources,
  courseModules,
  courseEnrollments,
} from "../../db/schema.js";
import { eq, and, isNull, inArray } from "drizzle-orm";

export const getCoursesRepo = async () => {
  return db
    .select({
      id: courses.id,
      name: courses.title,
      description: courses.description,
      trainer: users.name,
      createdAt: courses.createdAt,
    })
    .from(courses)
    .innerJoin(trainer, eq(courses.trainerId, trainer.id))
    .innerJoin(users, eq(trainer.userId, users.id));
};

export const viewCourseRepo = async (courseId: number) => {
  return db.select({
    name: courses.title,
    description: courses.description,
    trainer: users.name,
  });
};

export const getCourseRepo = async (courseId: number) => {
  const course = await db
    .select({
      id: courses.id,
      title: courses.title,
      description: courses.description,
      trainerName: users.name,
      createdAt: courses.createdAt,
    })
    .from(courses)
    .innerJoin(trainer, eq(courses.trainerId, trainer.id))
    .innerJoin(users, eq(trainer.userId, users.id))
    .where(and(eq(courses.id, courseId), isNull(courses.deletedAt)))
    .limit(1);

  if (course.length === 0) {
    return null;
  }

  const modules = await db
    .select({
      id: courseModules.id,
      title: courseModules.title,
      description: courseModules.description,
      position: courseModules.position,
    })
    .from(courseModules)
    .where(eq(courseModules.courseId, courseId))
    .orderBy(courseModules.position);

  const moduleIds = modules.map((module) => module.id);

  let resourceList: {
    id: number;
    moduleId: number;
    title: string;
    type: string;
    url: string;
    position: number;
  }[] = [];

  if (moduleIds.length > 0) {
    resourceList = await db
      .select({
        id: resources.id,
        moduleId: resources.moduleId,
        title: resources.title,
        type: resources.type,
        url: resources.url,
        position: resources.position,
      })
      .from(resources)
      .where(inArray(resources.moduleId, moduleIds))
      .orderBy(resources.position);
  }

  return {
    ...course[0],
    modules: modules.map((module) => ({
      ...module,
      resources: resourceList.filter(
        (resource) => resource.moduleId === module.id,
      ),
    })),
  };
};

export const enrollCourseRepo = async (courseId: number, userId: number) => {
  return db.insert(courseEnrollments).values({
    courseId: courseId,
    userId: userId,
  });
};
