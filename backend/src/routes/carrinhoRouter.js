// src/routes/carrinhoRouter.js
import { Router } from "express";
import CarrinhoController from "../controllers/carrinhoController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/carrinho", CarrinhoController.add);
router.get("/carrinho", CarrinhoController.list);
router.put("/carrinho/:produtoId", CarrinhoController.update);
router.delete("/carrinho/:produtoId", CarrinhoController.remove);
router.delete("/carrinho", CarrinhoController.clear);

export default router;