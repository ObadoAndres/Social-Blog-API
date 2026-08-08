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

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Admin dashboard
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Welcome message for admin users
 *       403:
 *         description: Forbidden
 */
router.get(
    "/dashboard",
    authMiddleware,
    authorize(["admin"]),
    adminDashboard
);

export default router;