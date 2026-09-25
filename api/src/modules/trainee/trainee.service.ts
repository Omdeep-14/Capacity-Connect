import {
  getCoursesRepo,
  viewCourseRepo,
  enrollCourseRepo,
} from "./trainee.repository.js";

export const getCoursesService = async () => {
  return await getCoursesRepo();
};

export const viewCourseService = async (courseId: number) => {
  return await viewCourseRepo(courseId);
};

export const enrollCourseService = async (courseId: number, userId: number) => {
  return await enrollCourseRepo(courseId, userId);
};
