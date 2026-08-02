import express from "express";
import {
  followUserController,
  unfollowUserController,
} from "../controllers/follow.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router({ mergeParams: true });

router.post("/", authMiddleware, followUserController);
router.post("/:userId", authMiddleware, followUserController);
router.delete("/", authMiddleware, unfollowUserController);
router.delete("/:userId", authMiddleware, unfollowUserController);

export default router;
