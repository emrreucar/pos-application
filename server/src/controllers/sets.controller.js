import { poolPromise } from "../lib/db.js";

export const getPaymentMethods = async (req, res) => {
  try {
    const pool = await poolPromise;
    const query = `SELECT * FROM payment_methods`;
    const result = await pool.request().query(query);
    const paymentMethods = result.recordset;
    res.status(200).json(paymentMethods);
  } catch (error) {
    console.log("Error fetching payment methods: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
