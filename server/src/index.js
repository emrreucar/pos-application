import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import usersRoutes from "./routes/users.route.js";
import categoriesRoutes from "./routes/categories.route.js";
import productsRoutes from "./routes/products.route.js";
import customersRoutes from "./routes/customers.route.js";
import billsRoutes from "./routes/bills.route.js";
import setsRoutes from "./routes/sets.route.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:7000",
  "https://www.pos.mereminsoft.com",
];

//! middleware
// application/json için gerekli.
app.use(
  express.json({
    limit: "50mb",
  })
);

// application/x-www-form-urlencoded için gerekli.
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// CORS ayarları
// origin -> Tarayıcıdan gelen isteğin kaynağını belirtir.
// callback -> İzin verilen kaynakları kontrol eder.
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("CORS policy does not allow this origin!"));
      }
    },
    credentials: true,
  })
);

// cookie-parser middleware -> gelen isteklerdeki Cookie başlığını parse eder ve req.cookies nesnesine ekler.
// Bu sayede gelen isteklerdeki cookie bilgilerine req.cookies üzerinden erişebiliriz.
app.use(cookieParser());

// static middleware -> statik dosyaları sunmak için kullanılır.
// Yüklenen dosyaların kaydedileceği dizini belirtir.
app.use("/uploads", express.static("uploads"));

app.use("/api", authRoutes);
app.use("/api", usersRoutes);
app.use("/api", categoriesRoutes);
app.use("/api", productsRoutes);
app.use("/api", customersRoutes);
app.use("/api", billsRoutes);
app.use("/api", setsRoutes);

//! listen to the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
