import { mssql, poolPromise } from "../lib/db.js";

//! Fetch all books from the database
export const getAllBooks = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM books");
    res.status(200).json(result.recordset);
  } catch (error) {
    console.log("Error fetching books: ", error);
    res.status(500).json({ message: "Error fetching books" });
  }
};

//! Fetch a book by ID from the database
export const getBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("id", mssql.Int, id)
      .query("SELECT * FROM books WHERE id = @id");
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.log("Error fetching book: ", error);
    res.status(500).json({ message: "Error fetching book" });
  }
};

//! Add a new book to the database
export const addBook = async (req, res) => {
  const { title, author, publishedDate, isbn, pages } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("title", mssql.NVarChar, title)
      .input("author", mssql.NVarChar, author)
      .input("published_date", mssql.Date, publishedDate)
      .input("isbn", mssql.NVarChar, isbn)
      .input("pages", mssql.Int, pages)
      .query(
        `INSERT INTO books (title, author, published_date, isbn, pages) 
        OUTPUT INSERTED.* 
        VALUES (@title, @author, @published_date, @isbn, @pages)`
      );

    if (result.rowsAffected[0] === 0) {
      return res.status(400).json({ message: "Failed to add book" });
    }

    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.log("Error adding book: ", error);
    res.status(500).json({ message: "Error adding book" });
  }
};

//! Update a book in the database
export const updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, publishedDate, isbn, pages } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("id", mssql.Int, id)
      .input("title", mssql.NVarChar, title)
      .input("author", mssql.NVarChar, author)
      .input("published_date", mssql.Date, publishedDate)
      .input("isbn", mssql.NVarChar, isbn)
      .input("pages", mssql.Int, pages)
      .query(
        `UPDATE books 
        SET title = @title, 
            author = @author, 
            published_date = @published_date, 
            isbn = @isbn, 
            pages = @pages 
        WHERE id = @id`
      );

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Fetch the updated book
    const selectResult = await pool
      .request()
      .input("id", mssql.Int, id)
      .query("SELECT * FROM books WHERE id = @id");

    res.status(200).json(selectResult.recordset[0]);
  } catch (error) {
    console.log("Error updating book: ", error);
    res.status(500).json({ message: "Error updating book" });
  }
};

//! Delete a book from the database
export const deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("id", mssql.Int, id)
      .query("DELETE FROM books WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.log("Error deleting book: ", error);
    res.status(500).json({ message: "Error deleting book" });
  }
};

//! Search for books by title or author with params
export const searchBooks = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Query parameter is required" });
  }

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("query", mssql.NVarChar, `%${query}%`)
      .query(
        `SELECT * FROM books WHERE title LIKE @query OR author LIKE @query`
      );

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No books found" });
    }

    res.status(200).json(result.recordset);
  } catch (error) {
    console.log("Error searching books: ", error);
    res.status(500).json({ message: "Error searching books" });
  }
};
