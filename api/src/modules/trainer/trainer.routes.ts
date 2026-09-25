import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { roleCheck } from "../../middlewares/role.middleware.js";
import {
  trainerDetails,
  trainerCompetencyDetails,
} from "./trainer.controller.js";

const router = Router();

router.post(
  "/trainer-details",
  authenticate,
  roleCheck("trainer"),
  trainerDetails,
);
router.post(
  "/trainer-competency-details",
  authenticate,
  roleCheck("trainer"),
  trainerCompetencyDetails,
);

export default router;
