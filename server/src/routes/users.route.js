import express from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/users.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { updateUserValidatior } from "../validators/userValidator.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router.get("/users", verifyToken, getUsers);
router.get("/users/:id", verifyToken, getUser);
router.put(
  "/users/:id",
  verifyToken,
  updateUserValidatior,
  validate,
  updateUser
);
router.delete("/users/:id", verifyToken, deleteUser);

export default router;
