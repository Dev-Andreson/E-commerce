// src/controllers/redisdb/carrinhoController.js
import CarrinhoService from "../services/carrinhoService.js";
import CarrinhoValidator from "../validators/carrinhoValidator.js";

class CarrinhoController {
  async add(req, res, next) {
    try {
      const userId = req.user.id;

      const dadosValidados = await CarrinhoValidator.validarDados(req.body);
      if (!dadosValidados.valido) {
        return res.status(400).json({
          campo: dadosValidados.campo,
          mensagem: dadosValidados.mensagem,
        });
      }

      const carrinho = await CarrinhoService.adicionarItem(userId, req.body);

      return res.status(201).json(carrinho);
    } catch (error) {
      next(error);
    }
  }

  async list(req, res, next) {
    try {
      const userId = req.user.id;

      // Carrinho vazio é estado válido: { itens: [], valorTotal: 0 }
      const carrinho = await CarrinhoService.listarCarrinho(userId);

      return res.status(200).json(carrinho);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const userId = req.user.id;
      const { produtoId } = req.params;

      const produtoIdValidado = CarrinhoValidator.validarProdutoId(produtoId);
      if (!produtoIdValidado.valido) {
        return res.status(400).json({
          campo: produtoIdValidado.campo,
          mensagem: produtoIdValidado.mensagem,
        });
      }

      // Atualização parcial: só quantidade costuma mudar aqui
      const dadosValidados = await CarrinhoValidator.validarDados(req.body, {
        parcial: true,
      });
      if (!dadosValidados.valido) {
        return res.status(400).json({
          campo: dadosValidados.campo,
          mensagem: dadosValidados.mensagem,
        });
      }

      const carrinhoAtt = await CarrinhoService.editarItem(
        userId,
        produtoId,
        req.body
      );

      return res.status(200).json(carrinhoAtt);
    } catch (error) {
      next(error);
    }
  }

  async remove(req, res, next) {
    try {
      const userId = req.user.id;
      const { produtoId } = req.params;

      const produtoIdValidado = CarrinhoValidator.validarProdutoId(produtoId);
      if (!produtoIdValidado.valido) {
        return res.status(400).json({
          campo: produtoIdValidado.campo,
          mensagem: produtoIdValidado.mensagem,
        });
      }

      const carrinho = await CarrinhoService.removerItem(userId, produtoId);

      return res.status(200).json(carrinho);
    } catch (error) {
      next(error);
    }
  }

  // Restaurado — o router tem DELETE /api/carrinho/ apontando para cá
  async clear(req, res, next) {
    try {
      const userId = req.user.id;

      const carrinho = await CarrinhoService.limparCarrinho(userId);

      return res.status(200).json(carrinho);
    } catch (error) {
      next(error);
    }
  }
}

export default new CarrinhoController();