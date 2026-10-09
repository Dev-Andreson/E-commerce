// src/middlewares/roleMiddleware.js
export function requireRole(...rolesPermitidas) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ erro: "Não autenticado" });
    }

    if (!rolesPermitidas.includes(req.user.role)) {
      return res.status(403).json({ erro: "Acesso negado" });
    }

    return next();
  };
}