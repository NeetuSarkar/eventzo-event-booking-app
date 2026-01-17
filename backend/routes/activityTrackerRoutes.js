import express from "express";

import { trackUserVisit } from "../controllers/activityTrackerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/track-user-visit", protect, trackUserVisit);

export default router;
