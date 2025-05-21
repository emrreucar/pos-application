import express from "express";
import { getPaymentMethods } from "../controllers/sets.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/payment-methods", verifyToken, getPaymentMethods);

export default router;
