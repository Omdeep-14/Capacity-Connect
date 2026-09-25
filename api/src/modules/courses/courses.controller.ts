import { Request, Response } from "express";
import {
  courseModel,
  courseModules,
  resourcesModel,
  createAssessmentModel,
} from "./courses.model.js";
import { AppError } from "../../utils/appError.js";
import {
  createCourseService,
  addModuleService,
  addResourcesService,
  getCoursesService,
  createAssignmentService,
  getACourseService,
} from "./courses.service.js";

export const createCourse = async (req: Request, res: Response) => {
  const validatedData = courseModel.safeParse(req.body);
  if (!validatedData.success) {
    throw new AppError(400, "Invalid request body");
  }

  const userId = Number(req.user.id);

  await createCourseService(validatedData.data, userId);

  return res.status(201).json({
    success: true,
    message: "Course created successfully",
  });
};

export const addModules = async (req: Request, res: Response) => {
  const validatedData = courseModules.safeParse(req.body);
  if (!validatedData.success) {
    throw new AppError(400, "Invalid request body");
  }

  await addModuleService(validatedData.data);

  return res.status(201).json({
    success: true,
    message: "Module added successfully",
  });
};

export const addResources = async (req: Request, res: Response) => {
  const validatedData = resourcesModel.safeParse(req.body);
  if (!validatedData.success) {
    throw new AppError(400, "Invalid request body");
  }

  await addResourcesService(validatedData.data);

  return res.status(201).json({
    success: true,
    message: "Resources added successfully",
  });
};

export const getCourses = async (req: Request, res: Response) => {
  const userId = Number(req.user.id);

  const coursesData = await getCoursesService(userId);

  return res.status(200).json({
    success: true,
    message: "Courses fetched successfully",
    coursesData,
  });
};

export const getACourse = async (req: Request, res: Response) => {
  const courseId = Number(req.params.id);

  if (Number.isNaN(courseId) || courseId <= 0) {
    throw new AppError(400, "Not a valid course id");
  }

  const course = await getACourseService(courseId);

  return res.status(200).json({
    success: true,
    message: "COurse info retrieved successfully",
    course,
  });
};

export const createAssessment = async (req: Request, res: Response) => {
  const validData = createAssessmentModel.safeParse(req.body);

  if (!validData.success) {
    throw new AppError(400, "Please provide proper assessment details");
  }

  const userId = Number(req.user.id);

  await createAssignmentService(userId, validData.data);

  return res.status(201).json({
    success: true,
    message: "Assessment created successfulyy",
  });
};
