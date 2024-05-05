import { Router } from "express";
import { register, login, resetPassword, confirmResetPassword } from "../controllers/authController.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/reset", resetPassword);
router.post("/confirm", confirmResetPassword);

export default router;
