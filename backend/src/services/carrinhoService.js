// src/services/redisdb/carrinhoService.js
import CarrinhoRepository from "../repositories/carrinhoRepository.js";
import ProdutoService from "./produtoService.js";

class CarrinhoService {
  _recalcular(carrinho) {
    carrinho.valorTotal = carrinho.itens.reduce(
      (acc, item) => acc + item.preco * item.quantidade,
      0
    );
    return carrinho;
  }

  async adicionarItem(userId, { produtoId, quantidade }) {
    let produto;
    try {
      produto = await ProdutoService.buscarPorId(produtoId);
    } catch {
      const err = new Error("Produto não encontrado");
      err.status = 404;
      throw err;
    }

    const carrinho = await CarrinhoRepository.buscar(userId);
    const existente = carrinho.itens.find((i) => i.produtoId === produtoId);

    if (existente) {
      existente.quantidade += quantidade;
    } else {
      carrinho.itens.push({
        produtoId,
        nome: produto.nome,
        preco: produto.preco,
        quantidade,
      });
    }

    this._recalcular(carrinho);
    return CarrinhoRepository.salvar(userId, carrinho);
  }

  async listarCarrinho(userId) {
    return CarrinhoRepository.buscar(userId);
  }

  async editarItem(userId, produtoId, { quantidade }) {
    if (quantidade === undefined) {
      const err = new Error("Informe a quantidade");
      err.status = 400;
      throw err;
    }

    const carrinho = await CarrinhoRepository.buscar(userId);
    const item = carrinho.itens.find((i) => i.produtoId === produtoId);

    if (!item) {
      const err = new Error("Item não encontrado no carrinho");
      err.status = 404;
      throw err;
    }

    item.quantidade = quantidade;
    this._recalcular(carrinho);
    return CarrinhoRepository.salvar(userId, carrinho);
  }

  async removerItem(userId, produtoId) {
    const carrinho = await CarrinhoRepository.buscar(userId);
    carrinho.itens = carrinho.itens.filter((i) => i.produtoId !== produtoId);
    this._recalcular(carrinho);
    return CarrinhoRepository.salvar(userId, carrinho);
  }

  async limparCarrinho(userId) {
    return CarrinhoRepository.limpar(userId);
  }
}

export default new CarrinhoService();