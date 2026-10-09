import Produto from "../models/produtoModel.js";

class ProdutoRepository {
  async criarProduto(dados) {
    try {
      const produtoCriado = await Produto.create(dados);
      if (!produtoCriado) throw new Error("Erro ao criar produto");
      return produtoCriado;
    } catch (error) {
      throw new Error(`Erro ao criar produto: ${error.message}`);
    }
  }

  async listarProdutos() {
    try {
      return await Produto.find();
    } catch (error) {
      throw new Error(`Erro ao listar produtos: ${error.message}`);
    }
  }

  async buscarPorId(id) {
    try {
      const produto = await Produto.findById(id);
      if (!produto) throw new Error("Produto não encontrado");
      return produto;
    } catch (error) {
      throw new Error(`Erro ao buscar produto por ID: ${error.message}`);
    }
  }

  async atualizarProduto(id, dados) {
    try {
      const produtoAtt = await Produto.findByIdAndUpdate(id, dados, { new: true });
      if (!produtoAtt) throw new Error("Erro ao atualizar produto");
      return produtoAtt;
    } catch (error) {
      throw new Error(`Erro ao atualizar produto: ${error.message}`);
    }
  }

  async deletarProduto(id) {
    try {
      const produtoDeletado = await Produto.findByIdAndDelete(id);
      if (!produtoDeletado) throw new Error("Erro ao deletar produto");
      return produtoDeletado;
    } catch (error) {
      throw new Error(`Erro ao deletar produto: ${error.message}`);
    }
  }

  async decrementarEstoque(id, quantidade) {
    const produtoAtualizado = await Produto.findOneAndUpdate(
      { _id: id, estoque: { $gte: quantidade } },
      { $inc: { estoque: -quantidade } },
      { new: true }
    );
    if (!produtoAtualizado) throw new Error("Estoque insuficiente");
    return produtoAtualizado;
  }

  async incrementarEstoque(id, quantidade) {
    const produto = await Produto.findOneAndUpdate(
      { _id: id },
      { $inc: { estoque: quantidade } },
      { new: true }
    );
    if (!produto) throw new Error("Produto não encontrado");
    return produto;
  }
}

export default new ProdutoRepository();