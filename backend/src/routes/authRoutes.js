// src/routes/authRoutes.js
import { Router } from "express";
import UserController from "../controllers/userController.js";

const router = Router();

router.post("/register", UserController.create);
router.post("/login", UserController.login);

export default router;