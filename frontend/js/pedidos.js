// frontend/js/pedidos.js
import { api } from "./api.js";
import { state } from "./state.js";
import { money, escapeHtml, toast } from "./ui.js";

export async function carregarPedidos() {
  const wrap = document.getElementById("pedidos-lista");
  wrap.innerHTML = `<div class="loading">Carregando pedidos...</div>`;

  try {
    const pedidos = await api("/pedidos", { auth: true });
    state.pedidos = pedidos || [];
    renderPedidos();
  } catch (err) {
    wrap.innerHTML = `<div class="loading">Erro: ${escapeHtml(err.message)}</div>`;
  }
}

export function renderPedidos() {
  const wrap = document.getElementById("pedidos-lista");

  if (!state.pedidos.length) {
    wrap.innerHTML = `<div class="loading">Você ainda não fez pedidos.</div>`;
    return;
  }

  wrap.innerHTML = state.pedidos
    .map((p) => {
      const podeDevolver = p.status === "pago";
      return `
        <div class="pedido-card">
          <div class="pedido-header">
            <div>
              <div class="pedido-id">Pedido #${p.id}</div>
              <div class="pedido-data">
                ${new Date(p.criado_em).toLocaleString("pt-BR")}
              </div>
            </div>
            <span class="status ${p.status}">${p.status}</span>
          </div>
          ${(p.itens || [])
            .map(
              (i) => `
              <div class="pedido-item">
                <span>${i.quantidade}× ${escapeHtml(i.nome)}</span>
                <span>${money(i.preco * i.quantidade)}</span>
              </div>`
            )
            .join("")}
          <div class="pedido-total">
            <span>Total</span>
            <span>${money(p.valor_total)}</span>
          </div>
          ${
            podeDevolver
              ? `<button class="btn-devolver" data-devolver="${p.id}">
                   Devolver pedido
                 </button>`
              : ""
          }
        </div>`;
    })
    .join("");

  wrap.querySelectorAll("[data-devolver]").forEach((btn) => {
    btn.onclick = () => devolverPedido(btn.getAttribute("data-devolver"));
  });
}

async function devolverPedido(pedidoId) {
  if (!confirm("Tem certeza que deseja devolver este pedido?")) return;
  try {
    await api(`/pedidos/${pedidoId}/devolver`, {
      method: "POST",
      auth: true,
    });
    toast("Pedido devolvido com sucesso!", "success");
    await carregarPedidos();
  } catch (err) {
    toast(err.message, "error");
  }
}