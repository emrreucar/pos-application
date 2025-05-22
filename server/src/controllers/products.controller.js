import { poolPromise } from "../lib/db.js";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

// GET /products -> Get all products
export const getProducts = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Bu işlemi yapma yetkiniz yok!" });
  }

  try {
    const pool = await poolPromise;
    const query = `SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id`;
    const result = await pool.request().query(query);

    const products = result.recordset;

    res.status(200).json(products);
  } catch (error) {
    console.log("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /products/:id -> Get a single product by ID
export const getProduct = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Bu işlemi yapma yetkiniz yok!" });
  }

  const { id } = req.params;

  try {
    const pool = await poolPromise;
    const query = `SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = @id`;
    const result = await pool.request().input("id", id).query(query);

    const product = result.recordset[0];

    if (!product) {
      return res.status(404).json({ message: "Ürün bulunamadı" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.log("Error fetching product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /products -> Create a new product
export const createProduct = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({ message: "Bu işlemi yapma yetkiniz yok!" });
  }

  const { category_id, title, price } = req.body;

  const missingFields = [];
  if (!category_id) missingFields.push("category_id");
  if (!title) missingFields.push("title");
  if (!price) missingFields.push("price");

  if (missingFields.length > 0) {
    return res
      .status(400)
      .json({ message: `Eksik alanlar: ${missingFields.join(", ")}` });
  }

  try {
    let imageUrl = null;

    if (req.files?.productImage) {
      const uploadedFile = req.files.productImage[0];
      const inputPath = uploadedFile.path;
      const ext = "webp";
      const fileName = `product-${uuidv4()}.${ext}`;
      const outputDir = path.join("uploads", "products");
      const outputPath = path.join(outputDir, fileName);

      // WEBP + Resize
      await sharp(inputPath)
        .resize(300, 300, { fit: "inside", withoutEnlargement: true })
        .toFormat("webp", { quality: 80 })
        .toFile(outputPath);

      // Orijinal dosyayı sil
      fs.unlink(inputPath, (err) => {
        if (err) console.error("Orijinal dosya silinirken hata oluştu: ", err);
      });

      imageUrl = `/uploads/products/${fileName}`;
    }

    const pool = await poolPromise;
    const insertQuery = `
    INSERT INTO products (category_id, title, price, image_url, created_at, updated_at) OUTPUT INSERTED.id 
    VALUES (@category_id, @title, @price, @image_url, GETDATE(), GETDATE())`;

    const insertResult = await pool
      .request()
      .input("category_id", category_id)
      .input("title", title)
      .input("price", price)
      .input("image_url", imageUrl)
      .query(insertQuery);

    const insertedId = insertResult.recordset[0].id;

    if (!insertedId) {
      return res.status(400).json({ message: "Ürün oluşturulamadı" });
    }

    const productQuery = `
      SELECT p.*, c.name AS category_name 
      FROM products p 
      JOIN categories c ON p.category_id = c.id 
      WHERE p.id = @id
    `;

    const productResult = await pool
      .request()
      .input("id", insertedId)
      .query(productQuery);

    const product = productResult.recordset[0];

    res.status(201).json(product);
  } catch (error) {
    console.log("Error creating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PUT /products/:id -> Update a product by ID
export const updateProduct = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({ message: "Bu işlemi yapma yetkiniz yok!" });
  }

  const { id } = req.params;
  const { category_id, title, price } = req.body;

  const missingFields = [];
  if (!category_id) missingFields.push("category_id");
  if (!title) missingFields.push("title");
  if (!price) missingFields.push("price");

  if (missingFields.length > 0) {
    return res
      .status(400)
      .json({ message: `Eksik alanlar: ${missingFields.join(", ")}` });
  }

  try {
    const pool = await poolPromise;

    // Önce eski veriyi al.
    const existingQuery = `SELECT * FROM products WHERE id = @id`;
    const existingResult = await pool
      .request()
      .input("id", id)
      .query(existingQuery);

    if (existingResult.recordset.length === 0) {
      return res.status(404).json({ message: "Ürün bulunamadı" });
    }

    const existingProduct = existingResult.recordset[0];
    let imageUrl = existingProduct.image_url;

    // Yeni resim yüklendiyse
    if (req.files?.productImage) {
      const uploadedFile = req.files.productImage[0];
      const inputPath = uploadedFile.path;
      const ext = "webp";
      const fileName = `product-${uuidv4()}.${ext}`;
      const outputDir = path.join("uploads", "products");
      const outputPath = path.join(outputDir, fileName);

      // WEBP + Resize
      await sharp(inputPath)
        .resize(300, 300, { fit: "inside", withoutEnlargement: true })
        .toFormat("webp", { quality: 80 })
        .toFile(outputPath);

      // Orijinal dosyayı sil
      fs.unlink(inputPath, (err) => {
        if (err) console.error("Orijinal dosya silinirken hata oluştu: ", err);
      });

      // Eski resmi sil
      if (existingProduct.image_url) {
        const oldPath = path.join(process.cwd(), existingProduct.image_url);
        fs.unlink(oldPath, (err) => {
          if (err) console.error("Eski resim silinirken hata oluştu: ", err);
        });
      }

      imageUrl = `/uploads/products/${fileName}`;
    }

    // Veritabanında güncelle
    const updateQuery = `
        UPDATE products 
        SET category_id = @category_id, 
            title = @title, 
            price = @price,
            image_url = @image_url,
            updated_at = GETDATE() 
        WHERE id = @id
      `;

    await pool
      .request()
      .input("category_id", category_id)
      .input("title", title)
      .input("price", price)
      .input("image_url", imageUrl)
      .input("id", id)
      .query(updateQuery);

    // Güncellenmiş ürünü al
    const resultQuery = `
        SELECT p.*, c.name AS category_name 
        FROM products p 
        JOIN categories c ON p.category_id = c.id 
        WHERE p.id = @id
      `;

    const productResult = await pool
      .request()
      .input("id", id)
      .query(resultQuery);

    const updatedProduct = productResult.recordset[0];

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.log("Error updating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE /products/:id -> Delete a product by ID
export const deleteProduct = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({ message: "Bu işlemi yapma yetkiniz yok!" });
  }

  const { id } = req.params;

  try {
    const pool = await poolPromise;

    // 1. Ürün var mı kontrol et
    const existingQuery = `SELECT * FROM products WHERE id = @id`;
    const existingResult = await pool
      .request()
      .input("id", id)
      .query(existingQuery);

    if (existingResult.recordset.length === 0) {
      return res.status(404).json({ message: "Ürün bulunamadı" });
    }

    // 2. Ürünü sil
    const deleteQuery = `DELETE FROM products WHERE id = @id`;
    await pool.request().input("id", id).query(deleteQuery);

    const deletedProduct = existingResult.recordset[0];

    // 3. Sunucudan resmi sil
    if (deletedProduct.image_url) {
      const oldPath = path.join(process.cwd(), deletedProduct.image_url);
      fs.unlink(oldPath, (err) => {
        if (err) {
          console.error("Eski resim silinirken hata oluştu: ", err);
        }
      });
    }

    // 4. Başarılı yanıt gönder
    res.status(200).json({ message: "Ürün başarıyla silindi" });
  } catch (error) {
    console.log("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /products/category/:categoryId -> Get products by category ID
export const getProductsByCategory = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Bu işlemi yapma yetkiniz yok!" });
  }

  const { categoryId } = req.params;

  try {
    const pool = await poolPromise;
    const query = `
      SELECT p.*, c.name AS category_name 
      FROM products p 
      JOIN categories c ON p.category_id = c.id 
      WHERE p.category_id = @categoryId
    `;

    const result = await pool
      .request()
      .input("categoryId", categoryId)
      .query(query);

    const products = result.recordset;

    if (products.length === 0) {
      return res.status(404).json({ message: "Ürün bulunamadı" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.log("Error fetching products by category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /search-products -> Search products by name and category
export const getProductsBySearch = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Bu işlemi yapma yetkiniz yok!" });
  }

  const { search } = req.query;

  try {
    const pool = await poolPromise;
    const query = `
      SELECT p.*, c.name AS category_name 
      FROM products p 
      JOIN categories c ON p.category_id = c.id 
      WHERE p.title LIKE @search OR c.name LIKE @search 
    `;
    const result = await pool
      .request()
      .input("search", `%${search}%`)
      .query(query);

    const products = result.recordset;
    if (products.length === 0) {
      return res.status(404).json({ message: "Ürün bulunamadı" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.log("Error searching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
