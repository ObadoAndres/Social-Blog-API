import express from "express";
import { createCommentController, getCommentsByPostIdController } from "../controllers/comments.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { commentSchema } from "../validators/comments.validate.js";

const router = express.Router();

/**
 * @swagger
 * /api/comment/{postId}:
 *   get:
 *     summary: Get comments for a post
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 */
router.get('/:postId', getCommentsByPostIdController);

/**
 * @swagger
 * /api/comment/{postId}:
 *   post:
 *     summary: Create a comment on a post
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Great post!
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       401:
 *         description: Authentication required
 */
router.post('/:postId', authMiddleware, validate(commentSchema), createCommentController);

export default router;