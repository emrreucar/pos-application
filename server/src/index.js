import mssql from "mssql";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import booksRoutes from "./routes/books.route.js";

dotenv.config();

const app = express();

//! middleware
app.use(express.json());
app.use(cors());

app.use("/api", booksRoutes);

//! listen to the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
