// frontend/js/produtos.js
import { api } from "./api.js";
import { state } from "./state.js";
import { money, escapeHtml } from "./ui.js";
import { adicionarAoCarrinho } from "./carrinho.js";

export async function carregarProdutos() {
  const wrap = document.getElementById("produtos");
  wrap.innerHTML = `<div class="loading">Carregando produtos...</div>`;

  try {
    const lista = await api("/produtos");
    state.produtos = lista || [];
    renderProdutos();
  } catch (err) {
    wrap.innerHTML = `<div class="loading">Erro: ${escapeHtml(err.message)}</div>`;
  }
}

export function renderProdutos() {
  const wrap = document.getElementById("produtos");

  if (!state.produtos.length) {
    wrap.innerHTML = `<div class="loading">Nenhum produto cadastrado ainda.</div>`;
    return;
  }

  wrap.innerHTML = state.produtos
    .map((p) => {
      const estoque = p.estoque ?? 0;
      const semEstoque = estoque <= 0;

      return `
        <div class="produto-card">
          <div>
            <div class="produto-nome">${escapeHtml(p.nome)}</div>
            ${
              p.categoria
                ? `<span class="produto-cat">${escapeHtml(p.categoria)}</span>`
                : ""
            }
          </div>
          <p class="produto-desc">${escapeHtml(p.descricao || "")}</p>
          <div class="produto-preco">${money(p.preco)}</div>
          <div class="produto-estoque">
            ${semEstoque ? "Sem estoque" : `${estoque} em estoque`}
          </div>
          <button
            class="btn-primary"
            data-add="${p._id}"
            ${semEstoque ? "disabled" : ""}
          >
            ${semEstoque ? "Indisponível" : "Adicionar ao carrinho"}
          </button>
        </div>`;
    })
    .join("");

  wrap.querySelectorAll("[data-add]").forEach((btn) => {
    btn.onclick = () => adicionarAoCarrinho(btn.getAttribute("data-add"));
  });
}