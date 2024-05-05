import { Router } from "express";
import {
  createLike,
  deleteLike,
  getLikedEventsByUser,
  getLikesUnderEvent,
  isUserLikedEvent,
} from "../controllers/likesController.js";
import { isAuth } from "../middleware/isAuth.js";

const router = Router();

router.get("/:eventId", getLikesUnderEvent);
router.get("/isUserLiked/:userId/:eventId", isUserLikedEvent);
router.get("/user/:userId", getLikedEventsByUser);
router.post("/create", isAuth, createLike);
router.delete("/delete/:userId/:eventId", isAuth, deleteLike);

export default router;
