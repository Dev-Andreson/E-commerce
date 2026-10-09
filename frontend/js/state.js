
import { STORAGE_KEYS } from "./config.js";

export const state = {
  token: localStorage.getItem(STORAGE_KEYS.token) || null,
  user: safeParse(localStorage.getItem(STORAGE_KEYS.user)),
  produtos: [],
  carrinho: { itens: [], valorTotal: 0 },
  pedidos: [],
};

function safeParse(raw) {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setSession(token, user) {
  state.token = token;
  state.user = user;

  if (token) {
    localStorage.setItem(STORAGE_KEYS.token, token);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.user);
  }
}

export function clearCarrinho() {
  state.carrinho = { itens: [], valorTotal: 0 };
}