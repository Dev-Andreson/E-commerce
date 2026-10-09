// src/routes/orderRouter.js
import { Router } from "express";
import OrderController from "../controllers/orderController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/checkout", requireRole("cliente"), OrderController.checkout);
router.get("/pedidos", requireRole("cliente"), OrderController.list);
router.post("/pedidos/:id/devolver", requireRole("cliente"), OrderController.devolver);

export default router;