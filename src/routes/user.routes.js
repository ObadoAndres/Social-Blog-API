import express from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { uploadImage } from "../services/cloudinary.service.js";


const router = express.Router();

router.post("/profile-image", authMiddleware, upload.single("image"), uploadImage)