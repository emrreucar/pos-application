import { poolPromise } from "../lib/db.js";

// GET /categories -> Get all categories
export const getCategories = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Bu işlemi yapma yetkiniz yok!" });
  }

  try {
    const pool = await poolPromise;
    const query = `SELECT * FROM categories`;
    const result = await pool.request().query(query);

    const categories = result.recordset;

    res.status(200).json(categories);
  } catch (error) {
    console.log("Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /categories/:id -> Get a single category by ID
export const getCategory = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Bu işlemi yapma yetkiniz yok!" });
  }

  const { id } = req.params;

  try {
    const pool = await poolPromise;
    const query = `SELECT * FROM categories WHERE id = @id`;
    const result = await pool.request().input("id", id).query(query);

    const category = result.recordset[0];

    if (!category) {
      return res.status(404).json({ message: "Kategori bulunamadı" });
    }

    res.status(200).json(category);
  } catch (error) {}
};

// POST /categories -> Create a new category
export const createCategory = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({ message: "Bu işlemi yapma yetkiniz yok!" });
  }

  const { name } = req.body;

  try {
    const pool = await poolPromise;
    const query = `INSERT INTO categories (name, created_at, updated_at) OUTPUT INSERTED.* VALUES (@name, GETDATE(), GETDATE())`;
    const result = await pool.request().input("name", name).query(query);

    if (result.rowsAffected[0] === 0) {
      return res.status(400).json({ message: "Kategori oluşturulamadı" });
    }

    const newCategory = result.recordset[0];

    res.status(201).json(newCategory);
  } catch (error) {}
};

// PUT /categories/:id -> Update a category by ID
export const updateCategory = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({ message: "Bu işlemi yapma yetkiniz yok!" });
  }

  const { id } = req.params;

  const { name } = req.body;

  try {
    const pool = await poolPromise;
    const query = `UPDATE categories SET name = @name, updated_at = GETDATE() OUTPUT INSERTED.* WHERE id = @id`;
    const result = await pool
      .request()
      .input("name", name)
      .input("id", id)
      .query(query);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Kategori bulunamadı" });
    }

    const updatedCategory = result.recordset[0];

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.log("Error updating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE /categories/:id -> Delete a category by ID
export const deleteCategory = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({ message: "Bu işlemi yapma yetkiniz yok!" });
  }

  const { id } = req.params;

  try {
    const pool = await poolPromise;
    const query = "DELETE FROM categories WHERE id = @id";
    const result = await pool.request().input("id", id).query(query);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Kategori bulunamadı" });
    }

    res.status(200).json({ message: "Kategori silindi" });
  } catch (error) {
    console.log("Error deleting category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
