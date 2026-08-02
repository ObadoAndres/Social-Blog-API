import jwt from "jsonwebtoken";
import { getJwtSecret } from "../utils/generate.token.js";
import { getCookieValue } from "../utils/cookies.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  const token = tokenFromHeader || getCookieValue(req, "accessToken");

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());

    req.user = {
      id: decoded.sub || decoded.id,
      role: decoded.role,
    };

    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};
