import {
  courseModelType,
  courseModuleModelType,
  resourcesType,
  createAssessmentType,
} from "./courses.model.js";
import { getTrainerId } from "../trainer/trainer.repository.js";
import {
  createCourseRepo,
  addModuleRepo,
  addResourcesRepo,
  getCoursesRepo,
  createAssessmentRepo,
  getACourseRepo,
} from "./courses.repository.js";

export const createCourseService = async (
  { title, description }: courseModelType,
  userId: number,
) => {
  const trainerId = await getTrainerId(userId);
  return await createCourseRepo(title, description, trainerId);
};

export const addModuleService = async ({
  courseId,
  title,
  description,
  position,
}: courseModuleModelType) => {
  return await addModuleRepo(courseId, title, description, position);
};

export const addResourcesService = async (resourceData: resourcesType) => {
  return await addResourcesRepo(resourceData);
};

export const getCoursesService = async (userId: number) => {
  const trainerId = await getTrainerId(userId);
  return await getCoursesRepo(trainerId);
};

export const createAssignmentService = async (
  userId: number,
  data: createAssessmentType,
) => {
  return await createAssessmentRepo(
    userId,
    data.moduleId,
    data.title,
    data.description,
    data.questions,
  );
};

export const getACourseService = async (courseId: number) => {
  return await getACourseRepo(courseId);
};
