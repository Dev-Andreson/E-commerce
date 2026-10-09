import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASS,
  database: process.env.POSTGRES_DB,
});

export async function conectarPostgre() {
  try {
    await pool.query("SELECT 1");
    console.log("Conectado com o PostgreSql");
  } catch (error) {
    console.log("Erro ao conectar com Postgre", error);
    throw error;
  }
  return pool;
}

export { pool };
