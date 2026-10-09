// frontend/js/ui.js
import { TOAST_MS } from "./config.js";

export function toast(msg, tipo = "success") {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.className = `toast ${tipo} show`;
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), TOAST_MS);
}

export function money(v) {
  return Number(v || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function showTela(qual) {
  document
    .getElementById("tela-catalogo")
    .classList.toggle("hidden", qual !== "catalogo");
  document
    .getElementById("tela-pedidos")
    .classList.toggle("hidden", qual !== "pedidos");
  document
    .getElementById("tela-auth")
    .classList.toggle("hidden", qual !== "auth");
}

export function renderAuthNav(isLogado, role = null) {
  const isAdmin = role === "admin";
  const isCliente = role === "cliente";

  document.getElementById("tela-auth").classList.toggle("hidden", isLogado);
  document.getElementById("btn-logout").classList.toggle("hidden", !isLogado);

  document
    .getElementById("btn-carrinho")
    .classList.toggle("hidden", !isLogado || !isCliente);
  document
    .getElementById("btn-pedidos")
    .classList.toggle("hidden", !isLogado || !isCliente);

  document
    .getElementById("btn-novo-produto")
    .classList.toggle("hidden", !isLogado || !isAdmin);
}