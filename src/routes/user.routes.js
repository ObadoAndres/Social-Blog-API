import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { uploadImageMiddleware } from "../middlewares/upload.middleware.js";
import { uploadProfileImage } from "../controllers/user.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/users/profile-image:
 *   post:
 *     summary: Upload a profile image
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile image uploaded successfully
 *       401:
 *         description: Authentication required
 */
router.post("/profile-image", authMiddleware, uploadImageMiddleware, uploadProfileImage);

export default router;