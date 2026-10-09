// src/routes/produtoRouter.js
import { Router } from "express";
import ProdutoController from "../controllers/produtoController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";

const router = Router();

// Público
router.get("/produtos", ProdutoController.list);
router.get("/produtos/:id", ProdutoController.getById);

// Somente admin
router.post("/produtos", authMiddleware, requireRole("admin"), ProdutoController.create);
router.put("/produtos/:id", authMiddleware, requireRole("admin"), ProdutoController.update);
router.delete("/produtos/:id", authMiddleware, requireRole("admin"), ProdutoController.delete);

export default router;