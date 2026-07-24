import express from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { createPostSchema } from "../validators/post.schema.js";
import { createPostController } from "../controllers/post.controllers.js";


const router = express.Router();


router.post("/", authMiddleware, validate(createPostSchema), createPostController);

export default router;