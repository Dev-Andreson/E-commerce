// src/validators/redisdb/carrinhoValidator.js
import mongoose from "mongoose";

class CarrinhoValidator {
  async validarDados(dados, { parcial = false } = {}) {
    if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
      return this._invalido("body", "Dados inválidos.");
    }

    if (parcial) {
      // Update: basta ter quantidade (produtoId vem da URL)
      if (dados.quantidade === undefined) {
        return this._invalido("quantidade", "Informe a quantidade.");
      }
    } else {
      // Add: produtoId E quantidade são obrigatórios
      if (dados.produtoId === undefined || dados.quantidade === undefined) {
        return this._invalido(
          "body",
          "Informe produtoId e quantidade."
        );
      }

      const produtoIdValidado = this.validarProdutoId(dados.produtoId);
      if (!produtoIdValidado.valido) {
        return produtoIdValidado;
      }
    }

    if (dados.quantidade !== undefined) {
      const { quantidade } = dados;
      if (
        typeof quantidade !== "number" ||
        Number.isNaN(quantidade) ||
        !Number.isInteger(quantidade) ||
        quantidade < 1
      ) {
        return this._invalido(
          "quantidade",
          "A quantidade deve ser um inteiro maior ou igual a 1."
        );
      }
    }

    return { valido: true };
  }

  // Síncrono e recebe string direto (sem cerimônia de objeto literal)
  validarProdutoId(produtoId) {
    if (!produtoId) {
      return this._invalido("produtoId", "O produtoId é obrigatório.");
    }
    if (
      typeof produtoId !== "string" ||
      !mongoose.Types.ObjectId.isValid(produtoId)
    ) {
      return this._invalido(
        "produtoId",
        "O produtoId deve ser um ObjectId válido."
      );
    }
    return { valido: true };
  }

  _invalido(campo, mensagem) {
    return { valido: false, campo, mensagem };
  }
}

export default new CarrinhoValidator();