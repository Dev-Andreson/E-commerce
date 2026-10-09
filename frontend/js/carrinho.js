// frontend/js/carrinho.js
import { api } from "./api.js";
import { state, clearCarrinho } from "./state.js";
import { money, escapeHtml, toast, showTela } from "./ui.js";
import { carregarProdutos } from "./produtos.js";
import { carregarPedidos } from "./pedidos.js";

/* ---------- API interna ---------- */
export async function carregarCarrinho() {
  if (!state.token) return;
  try {
    const c = await api("/carrinho", { auth: true });
    state.carrinho = c;
    renderCarrinho();
  } catch (err) {
    console.error(err);
  }
}

export async function adicionarAoCarrinho(produtoId) {
  try {
    const c = await api("/carrinho", {
      method: "POST",
      auth: true,
      body: { produtoId, quantidade: 1 },
    });
    state.carrinho = c;
    renderCarrinho();
    toast("Produto adicionado!", "success");
    abrirCarrinho();
  } catch (err) {
    toast(err.message, "error");
  }
}

async function atualizarQtd(produtoId, quantidade) {
  if (quantidade < 1) return removerItem(produtoId);
  try {
    const c = await api(`/carrinho/${produtoId}`, {
      method: "PUT",
      auth: true,
      body: { quantidade },
    });
    state.carrinho = c;
    renderCarrinho();
  } catch (err) {
    toast(err.message, "error");
  }
}

async function removerItem(produtoId) {
  try {
    const c = await api(`/carrinho/${produtoId}`, {
      method: "DELETE",
      auth: true,
    });
    state.carrinho = c;
    renderCarrinho();
  } catch (err) {
    toast(err.message, "error");
  }
}

/* ---------- Render ---------- */
export function renderCarrinho() {
  const itens = state.carrinho.itens || [];
  const total = state.carrinho.valorTotal || 0;

  document.getElementById("cart-count").textContent = itens.reduce(
    (acc, i) => acc + i.quantidade,
    0
  );
  document.getElementById("cart-total").textContent = money(total);

  const wrap = document.getElementById("cart-itens");

  if (!itens.length) {
    wrap.innerHTML = `<div class="cart-empty">Seu carrinho está vazio</div>`;
  } else {
    wrap.innerHTML = itens
      .map(
        (item) => `
        <div class="cart-item">
          <div class="cart-item-info">
            <div class="cart-item-nome">${escapeHtml(item.nome)}</div>
            <div class="cart-item-preco">${money(item.preco)} cada</div>
            <div class="cart-item-qty">
              <button data-dec="${item.produtoId}">−</button>
              <span>${item.quantidade}</span>
              <button data-inc="${item.produtoId}">+</button>
              <button
                data-del="${item.produtoId}"
                style="margin-left:auto;background:transparent;color:var(--danger)"
              >Remover</button>
            </div>
          </div>
        </div>`
      )
      .join("");

    wrap.querySelectorAll("[data-dec]").forEach((b) => {
      const id = b.getAttribute("data-dec");
      const item = itens.find((i) => i.produtoId === id);
      b.onclick = () => atualizarQtd(id, item.quantidade - 1);
    });
    wrap.querySelectorAll("[data-inc]").forEach((b) => {
      const id = b.getAttribute("data-inc");
      const item = itens.find((i) => i.produtoId === id);
      b.onclick = () => atualizarQtd(id, item.quantidade + 1);
    });
    wrap.querySelectorAll("[data-del]").forEach((b) => {
      b.onclick = () => removerItem(b.getAttribute("data-del"));
    });
  }

  document.getElementById("btn-checkout").disabled = itens.length === 0;
}

/* ---------- Sidebar ---------- */
export function abrirCarrinho() {
  document.getElementById("cart-sidebar").classList.add("open");
  document.getElementById("cart-overlay").classList.add("open");
}

export function fecharCarrinho() {
  document.getElementById("cart-sidebar").classList.remove("open");
  document.getElementById("cart-overlay").classList.remove("open");
}

/* ---------- Checkout ---------- */
export function initCheckout() {
  document.getElementById("btn-checkout").onclick = async () => {
    const btn = document.getElementById("btn-checkout");
    btn.disabled = true;
    btn.textContent = "Processando...";

    try {
      const pedido = await api("/checkout", { method: "POST", auth: true });
      toast(`Pedido #${pedido.pedidoId} criado com sucesso!`, "success");

      clearCarrinho();
      renderCarrinho();
      fecharCarrinho();

      await carregarProdutos();
      await carregarPedidos();
      showTela("pedidos");
    } catch (err) {
      toast(err.message, "error");
    } finally {
      btn.textContent = "Finalizar compra";
      btn.disabled = (state.carrinho.itens || []).length === 0;
    }
  };
}

/* ---------- Eventos da sidebar ---------- */
export function initCarrinhoUI() {
  document.getElementById("btn-carrinho").onclick = abrirCarrinho;
  document.getElementById("cart-close").onclick = fecharCarrinho;
  document.getElementById("cart-overlay").onclick = fecharCarrinho;
}