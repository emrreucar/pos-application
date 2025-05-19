import express from "express";
import {
  getCurrentUser,
  login,
  logout,
  register,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import {
  loginValidator,
  registerValidator,
} from "../validators/authValidator.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router.post("/auth/register", registerValidator, validate, register);
router.post("/auth/login", loginValidator, validate, login);
router.post("/auth/logout", logout);
router.get("/check-auth", verifyToken, getCurrentUser);

export default router;
