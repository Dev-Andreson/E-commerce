// src/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ erro: "Token não fornecido" });
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    return res.status(401).json({ erro: "Token não fornecido" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, email, iat, exp }
    return next();
  } catch {
    return res.status(401).json({ erro: "Token inválido" });
  }
}