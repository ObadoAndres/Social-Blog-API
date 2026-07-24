import express from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { createPostSchema } from "../validators/post.schema.js";
import { createPostController, deletePostController, getPostByIdController, getPostController, updatePostController } from "../controllers/post.controllers.js";


const router = express.Router();

router.get("/", getPostController);
router.get("/:id", getPostByIdController);
router.post("/", authMiddleware, validate(createPostSchema), createPostController);
router.put("/:id", authMiddleware, updatePostController);
router.delete("/:id", authMiddleware, deletePostController)

export default router;