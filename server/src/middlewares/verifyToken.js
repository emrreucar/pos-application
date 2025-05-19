import jwt from "jsonwebtoken";
import { poolPromise } from "../lib/db.js";

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Token bulunamadı!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Token geçersiz!" });
    }

    const query = `SELECT * FROM users WHERE id = ${decoded.id}`;
    const pool = await poolPromise;
    const user = await pool.request().query(query);
    if (user.recordset.length === 0) {
      return res.status(401).json({ message: "Kullanıcı bulunamadı!" });
    }

    req.user = user.recordset[0];
    next();
  } catch (error) {
    console.error("Token doğrulama hatası: ", error);
    return res.status(500).json({ message: "Token doğrulama hatası!" });
  }
};
