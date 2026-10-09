// src/validators/mongodb/produtoValidator.js
import mongoose from "mongoose";

class ProdutoValidator {
  constructor() {
    // Campos obrigatórios na criação (estoque e ativo têm default no model)
    this.camposObrigatorios = ["nome", "descricao", "preco", "categoria"];

    // Categorias permitidas conforme o enum do schema
    this.categoriasPermitidas = [
      "Eletrónicos",
      "Roupas",
      "Alimentos",
      "Casa",
      "Outros",
    ];

    // Campos que podem ser enviados no body
    this.camposPermitidos = [
      "nome",
      "descricao",
      "preco",
      "categoria",
      "estoque",
      "atributos",
      "ativo",
    ];
  }

  /**
   * Valida os dados do produto.
   * @param {Object} dados - req.body
   * @param {Object} opcoes - { parcial: boolean } para atualizações parciais
   */
  
  async validarDados(dados, { parcial = false } = {}) {
    if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
      return this._invalido(
        "body",
        "Dados do produto devem ser enviados em um objeto.",
      );
    }

    // Se for atualização parcial, exige pelo menos um campo permitido
    if (parcial) {
      const enviouAlgumCampo = this.camposPermitidos.some(
        (campo) => dados[campo] !== undefined,
      );
      if (!enviouAlgumCampo) {
        return this._invalido(
          "body",
          "Informe pelo menos um campo para atualização.",
        );
      }
    } else {
      // Criação: verifica campos obrigatórios
      for (const campo of this.camposObrigatorios) {
        const valor = dados[campo];
        if (valor === undefined || valor === null || valor === "") {
          return this._invalido(campo, `O campo "${campo}" é obrigatório.`);
        }
      }
    }

    // Validação individual dos campos (apenas se presentes)
    if (dados.nome !== undefined) {
      if (typeof dados.nome !== "string") {
        return this._invalido("nome", "O nome deve ser uma string.");
      }
      const nome = dados.nome.trim();
      if (nome.length < 2) {
        return this._invalido(
          "nome",
          "O nome deve ter pelo menos 2 caracteres.",
        );
      }
      if (nome.length > 100) {
        return this._invalido(
          "nome",
          "O nome deve ter no máximo 100 caracteres.",
        );
      }
    }

    if (dados.descricao !== undefined) {
      if (typeof dados.descricao !== "string") {
        return this._invalido("descricao", "A descrição deve ser uma string.");
      }
      if (dados.descricao.trim().length === 0) {
        return this._invalido("descricao", "A descrição não pode ser vazia.");
      }
      if (dados.descricao.length > 500) {
        return this._invalido(
          "descricao",
          "A descrição deve ter no máximo 500 caracteres.",
        );
      }
    }

    if (dados.preco !== undefined) {
      if (typeof dados.preco !== "number" || Number.isNaN(dados.preco)) {
        return this._invalido("preco", "O preço deve ser um número.");
      }
      if (dados.preco < 0) {
        return this._invalido("preco", "O preço não pode ser negativo.");
      }
    }

    if (dados.categoria !== undefined) {
      if (typeof dados.categoria !== "string") {
        return this._invalido("categoria", "A categoria deve ser uma string.");
      }
      if (!this.categoriasPermitidas.includes(dados.categoria)) {
        return this._invalido(
          "categoria",
          `Categoria inválida. Valores permitidos: ${this.categoriasPermitidas.join(", ")}.`,
        );
      }
    }

    if (dados.estoque !== undefined) {
      if (typeof dados.estoque !== "number" || Number.isNaN(dados.estoque)) {
        return this._invalido("estoque", "O estoque deve ser um número.");
      }
      if (!Number.isInteger(dados.estoque)) {
        return this._invalido(
          "estoque",
          "O estoque deve ser um número inteiro.",
        );
      }
      if (dados.estoque < 0) {
        return this._invalido("estoque", "O estoque não pode ser negativo.");
      }
    }

    if (dados.atributos !== undefined) {
      if (
        typeof dados.atributos !== "object" ||
        dados.atributos === null ||
        Array.isArray(dados.atributos)
      ) {
        return this._invalido(
          "atributos",
          "Os atributos devem ser um objeto (Map).",
        );
      }
    }

    if (dados.ativo !== undefined) {
      if (typeof dados.ativo !== "boolean") {
        return this._invalido("ativo", "O campo ativo deve ser booleano.");
      }
    }

    return { valido: true };
  }

  /**
   * Valida o ID recebido em req.params (id ou _id).
   */
  async validarId(params) {
    if (!params || typeof params !== "object") {
      return this._invalido("params", "Parâmetros da requisição inválidos.");
    }

    const id = params.id || params._id;

    if (!id) {
      return this._invalido("id", "O id é obrigatório.");
    }

    if (typeof id !== "string" || !this._isObjectIdValido(id)) {
      return this._invalido("id", "O id deve ser um ObjectId válido.");
    }

    return { valido: true, id };
  }

  _isObjectIdValido(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }

  _invalido(campo, mensagem) {
    return {
      valido: false,
      campo,
      mensagem,
    };
  }
}

export default new ProdutoValidator();
