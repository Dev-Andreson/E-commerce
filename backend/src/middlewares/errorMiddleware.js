// src/middlewares/errorMiddleware.js
export function errorMiddleware(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error("[errorMiddleware]", err);

  const status = err.status || 500;
  const mensagem = status === 500 ? "Erro interno no servidor" : err.message;

  res.status(status).json({ erro: mensagem });
}