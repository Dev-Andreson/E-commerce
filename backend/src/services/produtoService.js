import ProdutoRepository from "../repositories/produtoRepository.js";

class ProdutoService {
  async registrarProduto(dados) {
    try {
      const produtoCriado = await ProdutoRepository.criarProduto(dados);
      if (!produtoCriado) throw new Error("Erro ao registar produto");
      return produtoCriado;
    } catch (error) {
      throw new Error(`Erro ao registrar produto: ${error.message}`);
    }
  }

  async listarProdutos() {
    try {
      const produtos = await ProdutoRepository.listarProdutos();
      if (!produtos) throw new Error("Erro ao listar produtos");
      return produtos.filter((p) => (p.estoque ?? 0) > 0);
    } catch (error) {
      throw new Error(`Erro ao listar produtos: ${error.message}`);
    }
  }

  async buscarPorId(id) {
    try {
      const produto = await ProdutoRepository.buscarPorId(id);
      if (!produto) throw new Error("Erro ao buscar produto");
      return produto;
    } catch (error) {
      throw new Error(`Erro ao buscar produto por id: ${error.message}`);
    }
  }

  async editarProduto(id, dados) {
    try {
      const produtoEditado = await ProdutoRepository.atualizarProduto(id, dados);
      if (!produtoEditado) throw new Error("Erro ao editar produto");
      return produtoEditado;
    } catch (error) {
      throw new Error(`Erro ao editar produto: ${error.message}`);
    }
  }

  async removerProduto(id) {
    try {
      const produtoDeletado = await ProdutoRepository.deletarProduto(id);
      if (!produtoDeletado) throw new Error("Erro ao deletar produto");
      return produtoDeletado;
    } catch (error) {
      throw new Error(`Erro ao deletar produto ${error.message}`);
    }
  }

  async decrementarEstoque(id, quantidade) {
    try {
      return await ProdutoRepository.decrementarEstoque(id, quantidade);
    } catch (error) {
      const err = new Error(`Estoque insuficiente para o produto ${id}`);
      err.status = 400;
      throw err;
    }
  }

  async incrementarEstoque(id, quantidade) {
    return await ProdutoRepository.incrementarEstoque(id, quantidade);
  }
}

export default new ProdutoService();