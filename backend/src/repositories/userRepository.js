import { pool } from "../config/postgres.js";

class UserRepository {
  async criarUsuario(nome, email, password, role = "cliente") {
    const sql = `
      INSERT INTO usuarios(name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role`;

    const result = await pool.query(sql, [nome, email, password, role]);
    return result.rows[0];
  }

  async buscarPorEmail(email) {
    const sql = `SELECT * FROM usuarios WHERE email = $1`;
    const result = await pool.query(sql, [email]);
    return result.rows[0];
  }
}

export default new UserRepository();