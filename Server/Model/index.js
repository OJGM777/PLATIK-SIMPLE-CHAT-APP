import dotenv from "dotenv";
import {createPool } from "mysql2/promise";

dotenv.config({ path: "./.env" });

export const pool = createPool({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  database: process.env.SQL_DB,
  password: process.env.SQL_PWORD,
  waitForConnections: true,
  queueLimit: 100,
  idleTimeout: 60000,
  connectionLimit: 5,
  queueLimit: 0,
});

export const testTable = async () => {
  const connection = await pool.getConnection();
  try {
    const result = await connection.query("SELECT * FROM TestTable;");
    console.log(result[0]);
  } catch (error) {
    console.log(error); //// MAYBE EL PROBLEMA ES DE LA DB
  }
};

// 
// setInterval(() => {
//   console.log(`📊 Pool Status:
//   Free: ${pool.pool._freeConnections.length}
//   Used: ${pool.pool._allConnections.length - pool.pool._freeConnections.length}
//   Queue: ${pool.pool._connectionQueue.length}`);
// }, 2000);


// pool.on('acquire', (connection) => {
//   console.log(`🔒 Conexión ${connection.threadId} adquirida`);
// });

// pool.on('enqueue', () => {
//   console.log(`⌛ Request en cola (Total: ${pool.pool._connectionQueue.length})`);
// });