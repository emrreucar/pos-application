import express from "express";
import {
  createBill,
  deleteBill,
  getBill,
  getBills,
  getProductReport,
  sendBillEmail,
  updateBill,
} from "../controllers/bills.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/bills", verifyToken, getBills);
router.get("/bills/:id", verifyToken, getBill);
router.post("/bills", verifyToken, createBill);
router.put("/bills/:id", verifyToken, updateBill);
router.delete("/bills/:id", verifyToken, deleteBill);

router.get("/bills/report/products", verifyToken, getProductReport);

router.get("/send-email/:id", verifyToken, sendBillEmail);

export default router;
