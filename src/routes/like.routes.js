import express from "express"
import { likePostController, unlikePostController } from "../controllers/like.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, likePostController);
router.post("/", unlikePostController, unlikePostController)


