import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { roleCheck } from "../../middlewares/role.middleware.js";
import { getCourses, viewCourse, enrollCourse } from "./trainee.controller.js";

const router = Router();

router.get("/get-all-courses", authenticate, roleCheck("trainee"), getCourses);
router.get(
  "/view-course/:courseId",
  authenticate,
  roleCheck("trainee"),
  viewCourse,
);
router.post("/enroll", authenticate, roleCheck("trainee"), enrollCourse);
