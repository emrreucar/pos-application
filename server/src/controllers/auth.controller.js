import { mssql, poolPromise } from "../lib/db.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/generateTokenAndSetCookie.js";

// POST /auth/register ->  Register a new user
export const register = async (req, res) => {
  const {
    name,
    surname,
    company_name,
    phone_number,
    username,
    password,
    email,
  } = req.body;

  try {
    const pool = await poolPromise;

    // 1. Check if the username or email already exists
    const checkQuery = `SELECT * FROM users WHERE username = @username OR email = @email`;

    const checkResult = await pool
      .request()
      .input("username", mssql.NVarChar, username)
      .input("email", mssql.NVarChar, email)
      .query(checkQuery);

    if (checkResult.recordset.length > 0) {
      const existing = checkResult.recordset[0];
      if (existing.email === email) {
        return res
          .status(400)
          .json({ message: "Bu e-posta adresi zaten kullanılıyor." });
      }
      if (existing.username === username) {
        return res
          .status(400)
          .json({ message: "Bu kullanıcı adı zaten kullanılıyor." });
      }
    }

    // Opt -> Check if the company name already exists
    const companyCheckQuery = `SELECT * FROM users WHERE company_name = @company_name`;
    const companyCheckResult = await pool
      .request()
      .input("company_name", mssql.NVarChar, company_name)
      .query(companyCheckQuery);

    if (companyCheckResult.recordset.length > 0) {
      return res
        .status(400)
        .json({ message: "Bu şirket adı zaten kullanılıyor." });
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insert the new user into the database
    const insertQuery = `INSERT INTO users (name, surname, company_name, phone_number, username, password, email, created_at, updated_at) OUTPUT INSERTED.* VALUES(@name, @surname, @company_name, @phone_number, @username, @password, @email, GETDATE(), GETDATE())`;

    const result = await pool
      .request()
      .input("name", mssql.NVarChar, name)
      .input("surname", mssql.NVarChar, surname)
      .input("company_name", mssql.NVarChar, company_name)
      .input("phone_number", mssql.NVarChar, phone_number)
      .input("username", mssql.NVarChar, username)
      .input("password", mssql.NVarChar, hashedPassword)
      .input("email", mssql.NVarChar, email)
      .query(insertQuery);

    if (result.rowsAffected[0] === 0) {
      return res.status(400).json({ message: "Kullanıcı oluşturulamadı." });
    }

    const newUser = result.recordset[0];

    // 4. Return the new user data without the password
    delete newUser.password;

    res.status(201).json(newUser);
  } catch (error) {
    console.log("Error creating user: ", error);
    res.status(500).json({ message: "Kullanıcı oluşturulurken hata oluştu." });
  }
};

// POST /auth/login ->  Login a user
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const pool = await poolPromise;

    // 1. Check if the user exists
    const checkQuery = `SELECT * FROM users WHERE username = @username`;

    const checkResult = await pool
      .request()
      .input("username", mssql.NVarChar, username)
      .query(checkQuery);

    const user = checkResult.recordset[0];
    if (!user) {
      return res.status(400).json({ message: "Kullanıcı bulunamadı." });
    }

    // 2. Compare the password
    const isPasswordValid = await bcrypt.compare(
      password,
      checkResult.recordset[0].password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Şifre yanlış" });
    }

    // 3. Generate a token and set it in a cookie
    generateTokenAndSetCookie(res, checkResult.recordset[0]);

    // 4. Return the user data without the password
    delete checkResult.recordset[0].password;

    // 5. Return the user data with the token
    res.status(200).json({
      user: checkResult.recordset[0],
      token: res.locals.token,
    });
  } catch (error) {
    console.log("Error logging in user: ", error);
    res.status(500).json({ message: "Giriş yapılırken hata oluştu." });
  }
};

// POST /auth/logout -> Logout a user
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Başarıyla çıkış yapıldı." });
};

// GET /check-auth ->  Get the current user
export const getCurrentUser = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id", mssql.Int, req.user.id)
      .query(`SELECT * FROM users WHERE id = @id`);

    const user = result.recordset[0];
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    // Remove the password from the user object
    const { password, ...userWithoutPassword } = user;

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.log("Error getting current user: ", error);
    res
      .status(500)
      .json({ message: "Kullanıcı bilgileri alınırken hata oluştu." });
  }
};
