import { Router } from "express";
import {
  getAllEvents,
  getEventById,
  getAllTopics,
  searchEvent,
  getEventTopics,
  getEventPreview,
  updateEventPreview,
  // getLikesUnderEvent,
  getTopicById,
  editEvent,
  createEvent,
  createCheckoutSession,
  deleteEvent,
} from "../controllers/eventController.js";
import multer from "multer";
import { isAuth } from "../middleware/isAuth.js";

const upload = multer({ dest: "public/eventPreviews" });

const router = Router();

router.get("/", getAllEvents);
router.get("/:eventId", getEventById);
router.get("/search/filters", searchEvent);
router.get("/topic/getAll", getAllTopics);
router.get("/topic/info/:eventId", getEventTopics);
router.get("/topic/:eventId", getTopicById);
// router.get("/comments/:eventId", getEventComments);
router.get("/preview/:eventId", getEventPreview);
// router.get("/likes/:eventId", getLikesUnderEvent);

router.post("/create/:userId", isAuth, createEvent);

// auth?
router.post("/create-checkout-session", createCheckoutSession);

router.patch("/edit/:eventId", isAuth, editEvent);
router.patch(
  "/update/preview/:eventId",
  isAuth,
  upload.single("preview"),
  updateEventPreview
);

router.delete("/:eventId", deleteEvent);

export default router;
