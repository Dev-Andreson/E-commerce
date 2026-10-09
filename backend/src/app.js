// src/app.js
import express from "express";
import cors from "cors";
import "dotenv/config";

import authRoutes from "../src/routes/authRoutes.js";
import produtoRouter from "../src/routes/produtoRouter.js";
import carrinhoRouter from "../src/routes/carrinhoRouter.js";
import orderRouter from "../src/routes/orderRouter.js";

import { errorMiddleware } from "../src/middlewares/errorMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", produtoRouter);
app.use("/api", carrinhoRouter);
app.use("/api", orderRouter); 

app.use(errorMiddleware);

export default app;