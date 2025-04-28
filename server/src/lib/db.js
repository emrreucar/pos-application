import mssql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const config = {
  database: process.env.MSSQL_DATABASE,
  server: process.env.MSSQL_SERVER,
  user: process.env.MSSQL_USERNAME,
  password: process.env.MSSQL_PASSWORD,
  port: 1433,
  options: {
    encrypt: false,
    trustedConnection: true,
    trustServerCertificate: true,
  },
};

const poolPromise = new mssql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("Connected to MSSQL database...");
    return pool;
  })
  .catch((err) => {
    console.log("Error connecting to MSSQL: ", err);
    throw err;
  });

export { poolPromise, mssql };
