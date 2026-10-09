// src/controllers/postgres/orderController.js
import OrderService from "../services/orderService.js";

class OrderController {
  async checkout(req, res, next) {
    try {
      const usuarioId = req.user.id;
      const pedido = await OrderService.finalizarCompra(usuarioId);
      return res.status(201).json(pedido);
    } catch (error) {
      next(error);
    }
  }

  async list(req, res, next) {
    try {
      const usuarioId = req.user.id;
      const pedidos = await OrderService.listarPedidos(usuarioId);
      return res.status(200).json(pedidos);
    } catch (error) {
      next(error);
    }
  }

  async devolver(req, res, next) {
    try {
      const usuarioId = req.user.id;
      const { id } = req.params;
      const pedido = await OrderService.devolverPedido(usuarioId, id);
      return res.status(200).json(pedido);
    } catch (error) {
      next(error);
    }
  }
}

export default new OrderController();