import { poolPromise } from "../lib/db.js";

// GET /customers -> Get all customers
export const getCustomers = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Yetkisiz Erişim" });
  }

  try {
    const pool = await poolPromise;
    const query = `SELECT * FROM customers`;
    const result = await pool.request().query(query);

    const customers = result.recordset;

    res.status(200).json(customers);
  } catch (error) {
    console.log("Error fetching customers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /customers/:id -> Get a single customer by ID
export const getCustomer = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Yetkisiz Erişim" });
  }

  const { id } = req.params;

  try {
    const pool = await poolPromise;
    const query = `SELECT * FROM customers WHERE id = @id`;
    const result = await pool.request().input("id", id).query(query);
    const customer = result.recordset[0];
    if (!customer) {
      return res.status(404).json({ message: "Müşteri bulunamadı" });
    }

    res.status(200).json(customer);
  } catch (error) {
    console.log("Error fetching customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /customers -> Create a new customer
export const createCustomer = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({ message: "Yetkisiz Erişim" });
  }

  const { name, surname, email, phone_number, address, tc_no } = req.body;

  try {
    const pool = await poolPromise;

    // Check if all required fields are provided
    const checkQuery = `SELECT * FROM customers WHERE email = @email OR phone_number = @phone_number OR tc_no = @tc_no`;
    const checkResult = await pool
      .request()
      .input("email", email)
      .input("phone_number", phone_number)
      .input("tc_no", tc_no)
      .query(checkQuery);

    if (checkResult.recordset.length > 0) {
      const existingCustomer = checkResult.recordset[0];
      if (existingCustomer.email === email) {
        return res
          .status(400)
          .json({ message: "Bu e-posta adresi zaten mevcut" });
      }
      if (existingCustomer.phone_number === phone_number) {
        return res
          .status(400)
          .json({ message: "Bu telefon numarası zaten mevcut" });
      }
      if (existingCustomer.tc_no === tc_no) {
        return res
          .status(400)
          .json({ message: "Bu TC kimlik numarası zaten mevcut" });
      }
    }

    const query = `INSERT INTO customers (name, surname, email, phone_number, address, tc_no, created_at, updated_at) OUTPUT INSERTED.* VALUES (@name, @surname, @email, @phone_number, @address, @tc_no, GETDATE(), GETDATE())`;
    const result = await pool
      .request()
      .input("name", name)
      .input("surname", surname)
      .input("email", email)
      .input("phone_number", phone_number)
      .input("address", address)
      .input("tc_no", tc_no)
      .query(query);

    if (result.rowsAffected[0] === 0) {
      return res.status(400).json({ message: "Müşteri oluşturulamadı" });
    }

    const customer = result.recordset[0];
    res.status(201).json(customer);
  } catch (error) {
    console.log("Error creating customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PUT /customers/:id -> Update a customer by ID
export const updateCustomer = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({ message: "Yetkisiz Erişim" });
  }

  const { id } = req.params;
  const { name, surname, email, phone_number, address, tc_no } = req.body;

  try {
    const pool = await poolPromise;

    // Check if all required fields are provided
    const checkQuery = `SELECT * FROM customers WHERE email = @email OR phone_number = @phone_number OR tc_no = @tc_no`;
    const checkResult = await pool
      .request()
      .input("email", email)
      .input("phone_number", phone_number)
      .input("tc_no", tc_no)
      .query(checkQuery);

    if (checkResult.recordset.length > 0) {
      const existingCustomer = checkResult.recordset[0];
      if (existingCustomer.email === email) {
        return res
          .status(400)
          .json({ message: "Bu e-posta adresi zaten mevcut" });
      }
      if (existingCustomer.phone_number === phone_number) {
        return res
          .status(400)
          .json({ message: "Bu telefon numarası zaten mevcut" });
      }
      if (existingCustomer.tc_no === tc_no) {
        return res
          .status(400)
          .json({ message: "Bu TC kimlik numarası zaten mevcut" });
      }
    }

    const query = `UPDATE customers SET name = @name, surname = @surname, email = @email, phone_number = @phone_number, address = @address, tc_no = @tc_no, updated_at = GETDATE() OUTPUT INSERTED.* WHERE id = @id`;
    const result = await pool
      .request()
      .input("id", id)
      .input("name", name)
      .input("surname", surname)
      .input("email", email)
      .input("phone_number", phone_number)
      .input("address", address)
      .input("tc_no", tc_no)
      .query(query);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Müşteri bulunamadı" });
    }

    const updatedCustomer = result.recordset[0];
    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.log("Error updating customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE /customers/:id -> Delete a customer by ID
export const deleteCustomer = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({ message: "Yetkisiz Erişim" });
  }

  const { id } = req.params;

  try {
    const pool = await poolPromise;
    const query = `DELETE FROM customers WHERE id = @id`;
    const result = await pool.request().input("id", id).query(query);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Müşteri bulunamadı" });
    }

    res.status(200).send({ message: "Müşteri başarıyla silindi" });
  } catch (error) {
    console.log("Error deleting customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
