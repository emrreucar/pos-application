import express from "express";
import {
  addBook,
  deleteBook,
  getAllBooks,
  getBookById,
  searchBooks,
  updateBook,
} from "../controllers/books.controller.js";

const router = express.Router();

router.get("/books", getAllBooks);
router.get("/books/:id", getBookById);
router.post("/books", addBook);
router.put("/books/:id", updateBook);
router.delete("/books/:id", deleteBook);
router.get("/search-books", searchBooks);

export default router;
