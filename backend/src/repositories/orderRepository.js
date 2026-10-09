// src/repositories/postgre/orderRepository.js
import { pool } from "../config/postgres.js";

class OrderRepository {
  async criarPedido({ usuarioId, valorTotal, status, itens }) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const pedidoResult = await client.query(
        `INSERT INTO pedidos (usuario_id, valor_total, status)
         VALUES ($1, $2, $3)
         RETURNING id, usuario_id, valor_total, status, criado_em`,
        [usuarioId, valorTotal, status]
      );
      const pedido = pedidoResult.rows[0];

      const valores = [];
      const placeholders = itens.map((item, i) => {
        const base = i * 5;
        valores.push(
          pedido.id,
          item.produtoId,
          item.nome,
          item.preco,
          item.quantidade
        );
        return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5})`;
      });

      await client.query(
        `INSERT INTO pedido_itens
           (pedido_id, produto_id, nome, preco, quantidade)
         VALUES ${placeholders.join(", ")}`,
        valores
      );

      await client.query("COMMIT");
      return pedido;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async listarPorUsuario(usuarioId) {
    const sql = `
      SELECT p.id, p.valor_total, p.status, p.criado_em,
             json_agg(
               json_build_object(
                 'produtoId', i.produto_id,
                 'nome', i.nome,
                 'preco', i.preco,
                 'quantidade', i.quantidade
               )
             ) AS itens
      FROM pedidos p
      JOIN pedido_itens i ON i.pedido_id = p.id
      WHERE p.usuario_id = $1
      GROUP BY p.id
      ORDER BY p.criado_em DESC`;
    const result = await pool.query(sql, [usuarioId]);
    return result.rows;
  }

  async buscarPorId(id, usuarioId) {
    const sql = `
      SELECT id, usuario_id, valor_total, status, criado_em
      FROM pedidos
      WHERE id = $1 AND usuario_id = $2`;
    const result = await pool.query(sql, [id, usuarioId]);
    return result.rows[0];
  }

  async buscarItens(pedidoId) {
    const sql = `
      SELECT produto_id, quantidade
      FROM pedido_itens
      WHERE pedido_id = $1`;
    const result = await pool.query(sql, [pedidoId]);
    return result.rows;
  }

  async atualizarStatus(id, status) {
    const sql = `
      UPDATE pedidos
      SET status = $1
      WHERE id = $2
      RETURNING id, usuario_id, valor_total, status, criado_em`;
    const result = await pool.query(sql, [status, id]);
    return result.rows[0];
  }
}

export default new OrderRepository();