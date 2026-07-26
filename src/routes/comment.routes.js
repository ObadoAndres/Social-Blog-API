import express from "express";
import { createCommentController, getCommentsByPostIdController } from "../controllers/comments.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get('/:postId', getCommentsByPostIdController);
router.post('/:postId', authMiddleware, createCommentController);

export default router;