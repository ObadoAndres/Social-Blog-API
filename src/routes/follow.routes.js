import express from "express";
import {
  followUserController,
  unfollowUserController,
} from "../controllers/follow.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router({ mergeParams: true });

// POST /api/users/:userId/follow
router.post("/", authMiddleware, followUserController);

// DELETE /api/users/:userId/follow
router.delete("/", authMiddleware, unfollowUserController);

export default router;
