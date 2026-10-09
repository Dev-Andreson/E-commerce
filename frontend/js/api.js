import { API_URL } from "./config.js";
import { state } from "./state.js";

export async function api(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth && state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {

  }

  if (!res.ok) {
    const msg = data?.mensagem || data?.erro || `Erro ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}