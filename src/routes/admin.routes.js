import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = express.Router();

const adminDashboard = (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the admin dashboard"
    });
};

router.get(
    "/dashboard",
    authMiddleware,
    authorize(["admin"]),
    adminDashboard
);

export default router;