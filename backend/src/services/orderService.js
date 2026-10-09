import OrderRepository from "../repositories/orderRepository.js";
import CarrinhoService from "./carrinhoService.js";
import ProdutoService from "./produtoService.js";

class OrderService {
  async finalizarCompra(usuarioId) {
    const carrinho = await CarrinhoService.listarCarrinho(usuarioId);

    if (!carrinho.itens || carrinho.itens.length === 0) {
      const err = new Error("Carrinho vazio");
      err.status = 400;
      throw err;
    }

    for (const item of carrinho.itens) {
      const produto = await ProdutoService.buscarPorId(item.produtoId);
      if ((produto.estoque ?? 0) < item.quantidade) {
        const err = new Error(
          `Estoque insuficiente para "${produto.nome}". Disponível: ${produto.estoque}`
        );
        err.status = 400;
        throw err;
      }
    }

    const pedido = await OrderRepository.criarPedido({
      usuarioId,
      valorTotal: carrinho.valorTotal,
      status: "pago",
      itens: carrinho.itens,
    });

    for (const item of carrinho.itens) {
      await ProdutoService.decrementarEstoque(item.produtoId, item.quantidade);
    }

    await CarrinhoService.limparCarrinho(usuarioId);

    return {
      pedidoId: pedido.id,
      usuarioId: pedido.usuario_id,
      valorTotal: Number(pedido.valor_total),
      status: pedido.status,
      criadoEm: pedido.criado_em,
      itens: carrinho.itens,
    };
  }

  async listarPedidos(usuarioId) {
    return OrderRepository.listarPorUsuario(usuarioId);
  }

  async devolverPedido(usuarioId, pedidoId) {
    const pedido = await OrderRepository.buscarPorId(pedidoId, usuarioId);
    if (!pedido) {
      const err = new Error("Pedido não encontrado");
      err.status = 404;
      throw err;
    }

    if (pedido.status !== "pago") {
      const err = new Error(`Este pedido já está como "${pedido.status}"`);
      err.status = 400;
      throw err;
    }

    const itens = await OrderRepository.buscarItens(pedidoId);
    for (const item of itens) {
      await ProdutoService.incrementarEstoque(item.produto_id, item.quantidade);
    }

    const pedidoAtualizado = await OrderRepository.atualizarStatus(
      pedidoId,
      "devolvido"
    );

    return pedidoAtualizado;
  }
}

export default new OrderService();