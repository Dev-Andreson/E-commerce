// src/repositories/redisdb/carrinhoRepository.js
import redisDB from "../config/redis.js";

const TTL_SEGUNDOS = 604800; // 7 dias

class CarrinhoRepository {
  _key(userId) {
    return `carrinho:${userId}`;
  }

  async buscar(userId) {
    const raw = await redisDB.get(this._key(userId));
    if (!raw) return { itens: [], valorTotal: 0 };
    return JSON.parse(raw);
  }

  async salvar(userId, carrinho) {
    // setEx renova o TTL a cada escrita (sliding expiration)
    await redisDB.setEx(
      this._key(userId),
      TTL_SEGUNDOS,
      JSON.stringify(carrinho)
    );
    return carrinho;
  }

  async limpar(userId) {
    const vazio = { itens: [], valorTotal: 0 };
    return this.salvar(userId, vazio);
  }
}

export default new CarrinhoRepository();