import express from "express";
import {
  createBill,
  deleteBill,
  getBill,
  getBills,
  updateBill,
} from "../controllers/bills.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/bills", verifyToken, getBills);
router.get("/bills/:id", verifyToken, getBill);
router.post("/bills", verifyToken, createBill);
router.put("/bills/:id", verifyToken, updateBill);
router.delete("/bills/:id", verifyToken, deleteBill);

export default router;
