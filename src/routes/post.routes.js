import express from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { createPostSchema } from "../validators/post.schema.js";
import { createPostController, deletePostController, getPostByIdController, getPostController, updatePostController } from "../controllers/post.controllers.js";


const router = express.Router();

/**
 * @swagger
 * /api/post:
 *   get:
 *     summary: Get all posts
 *     tags:
 *       - Posts
 *     responses:
 *       200:
 *         description: List of posts
 */
router.get("/", getPostController);

/**
 * @swagger
 * /api/post/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post details
 *       404:
 *         description: Post not found
 */
router.get("/:id", getPostByIdController);

/**
 * @swagger
 * /api/post:
 *   post:
 *     summary: Create a new post
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: My First Post
 *               content:
 *                 type: string
 *                 example: This is my first post.
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Invalid post data
 *       401:
 *         description: Authentication required
 */
router.post("/", authMiddleware, validate(createPostSchema), createPostController);

/**
 * @swagger
 * /api/post/{id}:
 *   put:
 *     summary: Update a post
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated title
 *               content:
 *                 type: string
 *                 example: Updated content
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Post not found
 */
router.put("/:id", authMiddleware, updatePostController);

/**
 * @swagger
 * /api/post/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Post not found
 */
router.delete("/:id", authMiddleware, deletePostController)

export default router;