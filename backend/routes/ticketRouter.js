import { Router } from "express";
import {
  generateTicket,
  getRemainingTicketsCount,
  getTicketPDF,
  getUserTickets,
  getUsersWhoGoToEvent,
} from "../controllers/ticketController.js";
import { isAuth } from "../middleware/isAuth.js";

const router = Router();

router.get("/:ticketId", getTicketPDF);
router.get("/userTickets/:userId", getUserTickets);
router.get("/users/:eventId", getUsersWhoGoToEvent);
router.get("/remaining/:eventId", getRemainingTicketsCount);
router.post("/generate", isAuth, generateTicket);

export default router;
