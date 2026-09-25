import { Router } from "express";
import { signInController, signUpController } from "./auth.controller.js";

const router = Router();

router.post("/sign-up", signUpController);
router.post("/sign-in", signInController);

export default router;
