import express from "express";
import {
  followUserController,
  unfollowUserController,
} from "../controllers/follow.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * /api/follow:
 *   post:
 *     summary: Follow the current user
 *     tags:
 *       - Follow
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Follow action completed
 *       401:
 *         description: Authentication required
 */
router.post("/", authMiddleware, followUserController);

/**
 * @swagger
 * /api/follow/{userId}:
 *   post:
 *     summary: Follow a specific user
 *     tags:
 *       - Follow
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Follow action completed
 *       401:
 *         description: Authentication required
 */
router.post("/:userId", authMiddleware, followUserController);

/**
 * @swagger
 * /api/follow:
 *   delete:
 *     summary: Unfollow the current user
 *     tags:
 *       - Follow
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Unfollow action completed
 *       401:
 *         description: Authentication required
 */
router.delete("/", authMiddleware, unfollowUserController);

/**
 * @swagger
 * /api/follow/{userId}:
 *   delete:
 *     summary: Unfollow a specific user
 *     tags:
 *       - Follow
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Unfollow action completed
 *       401:
 *         description: Authentication required
 */
router.delete("/:userId", authMiddleware, unfollowUserController);

export default router;
