import { Router } from "express";
import {
  createAnswerToComment,
  createComment,
  getEventComments,
} from "../controllers/commentController.js";
import { isAuth } from "../middleware/isAuth.js";

const router = Router();

router.get("/event/:eventId", getEventComments);
router.post("/create", isAuth, createComment);
router.post("/answer/create", isAuth, createAnswerToComment);

export default router;
