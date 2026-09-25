import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { roleCheck } from "../../middlewares/role.middleware.js";
import {
  createCourse,
  addModules,
  addResources,
  getCourses,
  createAssessment,
  getACourse,
} from "./courses.controller.js";

const router = Router();

router.post("/create-course", authenticate, roleCheck("trainer"), createCourse);
router.post("/add-modules", authenticate, roleCheck("trainer"), addModules);
router.post("/add-resources", authenticate, roleCheck("trainer"), addResources);
router.get("/trainer-courses", authenticate, roleCheck("trainer"), getCourses);
router.post(
  "/add-assignments",
  authenticate,
  roleCheck("trainer"),
  createAssessment,
);
router.get("/get-course/:id", authenticate, roleCheck("trainee"), getACourse);
