import { poolPromise } from "../lib/db.js";
import bcryptjs from "bcryptjs";

// GET /users -> Get all users
export const getUsers = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Bu işlemi yapma yetkiniz yok!" });
  }

  try {
    const pool = await poolPromise;
    const query = "SELECT * FROM users";
    const result = await pool.request().query(query);

    const users = result.recordset;

    // Remove password from each user object
    users.forEach((user) => {
      delete user.password;
    });

    res.status(200).json(users);
  } catch (error) {
    console.log("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /users/:id ->  Get a single user by ID
export const getUser = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Bu işlemi yapma yetkiniz yok!" });
  }

  const { id } = req.params;

  try {
    const pool = await poolPromise;
    const query = "SELECT * FROM users WHERE id = @id";
    const result = await pool.request().input("id", id).query(query);

    const user = result.recordset[0];

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PUT /users/:id ->  Update a user by ID
export const updateUser = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({ message: "Bu işlemi yapma yetkiniz yok!" });
  }

  const { id } = req.params;
  const {
    name,
    surname,
    company_name,
    phone_number,
    username,
    email,
    password,
    role,
  } = req.body;

  try {
    const pool = await poolPromise;

    // Check if the user exists before updating
    const existingUser = await pool
      .request()
      .input("id", id)
      .query("SELECT * FROM users WHERE id = @id");
    if (existingUser.recordset.length === 0) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    // Check if the username or email already exists
    const existingUsername = await pool
      .request()
      .input("username", username?.trim())
      .input("id", id)
      .query("SELECT * FROM users WHERE username = @username AND id != @id");
    if (existingUsername.recordset.length > 0) {
      return res.status(400).json({ message: "Kullanıcı adı zaten mevcut" });
    }

    const existingEmail = await pool
      .request()
      .input("email", email?.trim())
      .input("id", id)
      .query("SELECT * FROM users WHERE email = @email AND id != @id");
    if (existingEmail.recordset.length > 0) {
      return res.status(400).json({ message: "E-posta adresi zaten mevcut" });
    }

    const query = `
        UPDATE users 
        SET 
            name = @name,
            surname = @surname,
            company_name = @company_name,
            phone_number = @phone_number,
            username = @username, 
            email = @email, 
            role = @role, 
            ${password ? "password = @password," : ""}
            updated_at = GETDATE()
        OUTPUT inserted.* 
        WHERE id = @id
        
    `;

    const request = pool
      .request()
      .input("name", name)
      .input("surname", surname)
      .input("company_name", company_name)
      .input("phone_number", phone_number)
      .input("username", username)
      .input("email", email)
      .input("role", role)
      .input("id", id);

    if (password) {
      const hashedPassword = await bcryptjs.hash(password, 10);
      request.input("password", hashedPassword);
    }

    const result = await request.query(query);

    const updatedUser = result.recordset[0];

    if (!updatedUser) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    delete updatedUser.password; // Remove password from the response
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE /users/:id ->  Delete a user by ID
export const deleteUser = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({ message: "Bu işlemi yapma yetkiniz yok!" });
  }

  const { id } = req.params;

  try {
    const pool = await poolPromise;
    const query = "DELETE FROM users WHERE id = @id";
    const result = await pool.request().input("id", id).query(query);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    res.status(200).json({ message: "Kullanıcı silindi" });
  } catch (error) {
    console.log("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
