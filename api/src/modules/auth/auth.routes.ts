import { Router } from "express";
import { signin, signup } from "./auth.controller.js";

const router = Router();

router.post("/sign-in", signin);
router.post("/sign-up", signup);

export default router;
