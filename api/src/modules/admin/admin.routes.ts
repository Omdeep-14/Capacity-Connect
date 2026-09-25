import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { roleCheck } from "../../middlewares/role.middleware.js";
import {
  getTrainers,
  updateTrainerStatusService,
  competencyMatch,
} from "./admin.controller.js";

const router = Router();

router.get("/trainers-pending", authenticate, roleCheck("admin"), getTrainers);
router.post(
  "/trainer-update-status",
  authenticate,
  roleCheck("admin"),
  updateTrainerStatusService,
);
router.get(
  "/trainer-competency-match",
  authenticate,
  roleCheck("admin"),
  competencyMatch,
);

export default router;
