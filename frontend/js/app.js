// frontend/js/app.js
import { state } from "./state.js";
import { showTela, renderAuthNav } from "./ui.js";

import { initAuth } from "./auth.js";
import { carregarProdutos } from "./produtos.js";
import { carregarCarrinho, initCarrinhoUI, initCheckout } from "./carrinho.js";
import { carregarPedidos } from "./pedidos.js";
import { initProdutoForm } from "./produtos-form.js";

function initNavegacao() {
  document.getElementById("btn-catalogo").onclick = async () => {
    showTela("catalogo");
    await carregarProdutos();
  };

  document.getElementById("btn-pedidos").onclick = async () => {
    showTela("pedidos");
    await carregarPedidos();
  };
}

async function boot() {
  initAuth();
  initCarrinhoUI();
  initCheckout();
  initProdutoForm();
  initNavegacao();

  if (state.token && state.user) {
    const role = state.user.role;
    renderAuthNav(true, role);
    showTela("catalogo");
    await carregarProdutos();

    if (role === "cliente") {
      await carregarCarrinho();
    }
  } else {
    renderAuthNav(false, null);
    showTela("auth");
  }
}

boot();