import { Router } from "express";
import { applyToJob, getMyApplications, updateApplicationStatus } from "../controllers/applications.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/:jobId", authenticate, applyToJob);
router.get("/my", authenticate, getMyApplications);
router.patch("/:id/status", authenticate, updateApplicationStatus);

export default router;