import express from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  getProductsByCategory,
  getProductsBySearch,
  updateProduct,
} from "../controllers/products.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { uploadFiles } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/products", verifyToken, getProducts);
router.get("/products/:id", verifyToken, getProduct);
router.post(
  "/products",
  verifyToken,
  uploadFiles([{ name: "productImage", maxCount: 1 }]),
  createProduct
);
router.put(
  "/products/:id",
  verifyToken,
  uploadFiles([{ name: "productImage", maxCount: 1 }]),
  updateProduct
);
router.delete("/products/:id", verifyToken, deleteProduct);
router.get(
  "/products/category/:categoryId",
  verifyToken,
  getProductsByCategory
);
router.get("/search-products", verifyToken, getProductsBySearch);

export default router;
