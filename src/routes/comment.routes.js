import express from "express";
import { createCommentController, getCommentsByPostIdController } from "../controllers/comments.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { commentSchema } from "../validators/comments.validate.js";

const router = express.Router();

router.get('/:postId', getCommentsByPostIdController);
router.post('/:postId', authMiddleware, validate(commentSchema), createCommentController);

export default router;