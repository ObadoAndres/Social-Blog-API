import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { uploadImageMiddleware } from "../middlewares/upload.middleware.js";
import { uploadProfileImage } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/profile-image", authMiddleware, uploadImageMiddleware, uploadProfileImage);

export default router;