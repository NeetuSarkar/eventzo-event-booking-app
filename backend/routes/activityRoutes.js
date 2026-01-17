import express, { Router } from "express";
import {
  getEventById,
  getEvents,
  getFeaturedEvents,
  getUpcomingEvents,
} from "../controllers/activityController.js";

const router = Router();

router.get("/events", getEvents);
router.get("/events/featured", getFeaturedEvents);
router.get("/events/upcoming", getUpcomingEvents);
router.get("/:id", getEventById);
export default router;
