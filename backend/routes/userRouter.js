import { Router } from "express";
import {
  getOrganizationEvents,
  getUserAvatar,
  updateUser,
  updateUserAvatar,
} from "../controllers/userController.js";
import multer from "multer";
import { isAuth } from "../middleware/isAuth.js";

const upload = multer({ dest: "public/avatars" });

const router = Router();

router.get("/avatar/:userId", getUserAvatar);
router.get("/events/:userId", getOrganizationEvents);
router.patch("/:userId", updateUser);
router.patch(
  "/avatar/:userId",
  isAuth,
  upload.single("avatar"),
  updateUserAvatar
);

export default router;
