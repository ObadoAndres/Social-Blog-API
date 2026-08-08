import express from "express";
import { likePostController, unlikePostController } from "../controllers/like.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/like:
 *   post:
 *     summary: Like the current post
 *     tags:
 *       - Likes
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
 *         description: Like action completed
 *       401:
 *         description: Authentication required
 */
router.post("/", authMiddleware, likePostController);

/**
 * @swagger
 * /api/like/{postId}:
 *   post:
 *     summary: Like a specific post
 *     tags:
 *       - Likes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Like action completed
 *       401:
 *         description: Authentication required
 */
router.post("/:postId", authMiddleware, likePostController);

/**
 * @swagger
 * /api/like:
 *   delete:
 *     summary: Unlike the current post
 *     tags:
 *       - Likes
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
 *         description: Unlike action completed
 *       401:
 *         description: Authentication required
 */
router.delete("/", authMiddleware, unlikePostController);

/**
 * @swagger
 * /api/like/{postId}:
 *   delete:
 *     summary: Unlike a specific post
 *     tags:
 *       - Likes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Unlike action completed
 *       401:
 *         description: Authentication required
 */
router.delete("/:postId", authMiddleware, unlikePostController);

export default router;

