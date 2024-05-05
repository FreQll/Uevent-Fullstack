import { Router } from "express";
import authRouter from "./authRouter.js";
import userRouter from "./userRouter.js";
import eventRouter from "./eventRouter.js";
import ticketRouter from "./ticketRouter.js";
import commentRouter from "./commentRouter.js";
import likesRouter from "./likesRouter.js";
// import stripeRouter from "./stripeRouter.js";

const router = Router();

// * Routes
router.use("/api/auth", authRouter);
router.use("/api/user", userRouter);
router.use("/api/event", eventRouter);
router.use("/api/ticket", ticketRouter);
router.use("/api/comment", commentRouter);
router.use("/api/likes", likesRouter);
// router.use("/api/stripe", stripeRouter);

export default router;
