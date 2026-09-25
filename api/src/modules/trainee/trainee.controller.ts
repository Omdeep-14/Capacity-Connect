import { Request, Response } from "express";
import { getCoursesService } from "./trainee.service.js";
import { AppError } from "../../utils/appError.js";
import { viewCourseService, enrollCourseService } from "./trainee.service.js";

export const getCourses = async (req: Request, res: Response) => {
  const coursesData = await getCoursesService();

  return res.status(201).json({
    success: true,
    message: "Courses fetched successfully",
    coursesData,
  });
};

export const viewCourse = async (req: Request, res: Response) => {
  const courseId = Number(req.params?.courseId);
  if (Number.isNaN(courseId) || courseId <= 0) {
    throw new AppError(400, "Invalid courseId");
  }

  const courseData = await viewCourseService(courseId);

  return res.status(200).json({
    success: true,
    message: "Course info fetched successfully",
    courseData,
  });
};

export const enrollCourse = async (req: Request, res: Response) => {
  const courseId = Number(req.body.courseId);
  if (Number.isNaN(courseId) || courseId <= 0) {
    throw new AppError(400, "Invalid course Id");
  }

  const userId = Number(req.user.id);

  await enrollCourseService(courseId, userId);

  return res.status(200).json({
    success: true,
    message: "Enrolled successfully",
  });
};
