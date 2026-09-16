const sql = require("mssql");
const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, "../../.env")
});


const rawServer = process.env.DB_SERVER || "localhost";
const cleanServer = rawServer.split("\\")[0];

const config = {
  server: cleanServer,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    instanceName: process.env.DB_INSTANCE || "SQLEXPRESS",
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate: process.env.DB_TRUST_CERT === "true"
  }
};

let pool;

async function getConnection() {
  if (!pool) {
    pool = await new sql.ConnectionPool(config).connect();
  }
  return pool;
}

module.exports = {
  sql,
  getConnection
};