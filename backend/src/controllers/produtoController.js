import ProdutoService from "../services/produtoService.js";
import ProdutoValidador from "../validators/produtoValidator.js";

class ProdutoController {
  async create(req, res) {
    try {
      const dadosValidados = await ProdutoValidador.validarDados(req.body);
      if (!dadosValidados.valido) {
        return res.status(400).json({
          campo: dadosValidados.campo,
          mensagem: dadosValidados.mensagem,
        });
      }

      const produtoCriado = await ProdutoService.registrarProduto(req.body);

      res.status(201).json(produtoCriado);
    } catch (error) {
      console.error("Erro ao criar produto: ", error);
      res.status(500).json({ erro: "Erro interno no servidor" });
    }
  }

  async list(req, res) {
    try {
      const produtos = await ProdutoService.listarProdutos();
      if (!produtos) {
        return res.status(400).json({ erro: "Nenhum produto encontrado" });
      }

      res.status(200).json(produtos);
    } catch (error) {
      console.error("Erro ao listar produtos: ", error);
      res.status(500).json({ erro: "Erro interno no servidor" });
    }
  }

  async getById(req, res) {
    try {
      const idValidado = await ProdutoValidador.validarId(req.params);
      if (!idValidado.valido) {
        return res
          .status(400)
          .json({ campo: idValidado.campo, mensagem: idValidado.mensagem });
      }

      const produto = await ProdutoService.buscarPorId(req.params.id);

      res.status(200).json(produto);
    } catch (error) {
      console.error("Erro ao buscar produto: ", error);
      res.status(500).json({ erro: "Erro interno no servidor" });
    }
  }

  async update(req, res) {
    try {
      const idValidado = await ProdutoValidador.validarId(req.params);
      if (!idValidado.valido) {
        return res
          .status(400)
          .json({ campo: idValidado.campo, mensagem: idValidado.mensagem });
      }

      const dadosValidados = await ProdutoValidador.validarDados(req.body, {
        parcial: true,
      });
      if (!dadosValidados.valido) {
        return res.status(400).json({
          campo: dadosValidados.campo,
          mensagem: dadosValidados.mensagem,
        });
      }

      const produtoAtt = await ProdutoService.editarProduto(
        req.params.id,
        req.body,
      );

      res.status(200).json(produtoAtt);
    } catch (error) {
      console.error("Erro ao atualizar produto: ", error);
      res.status(500).json({ erro: "Erro interno no servidor" });
    }
  }

  async delete(req, res) {
    try {
      const idValidado = await ProdutoValidador.validarId(req.params);
      if (!idValidado.valido) {
        return res
          .status(400)
          .json({ campo: idValidado.campo, mensagem: idValidado.mensagem });
      }

      const produtoDeletado = await ProdutoService.removerProduto(
        req.params.id,
      );

      res.status(200).json(produtoDeletado);
    } catch (error) {
      console.error("Erro ao deletar produto: ", error);
      res.status(500).json({ erro: "Erro interno no servidor" });
    }
  }
}

export default new ProdutoController();
