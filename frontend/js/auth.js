// frontend/js/auth.js
import { api } from "./api.js";
import { setSession, state } from "./state.js";
import { toast, showTela, renderAuthNav } from "./ui.js";
import { carregarProdutos } from "./produtos.js";
import { carregarCarrinho, renderCarrinho } from "./carrinho.js";

export function initAuth() {
  const tabLogin = document.getElementById("tab-login");
  const tabRegister = document.getElementById("tab-register");
  const formLogin = document.getElementById("form-login");
  const formRegister = document.getElementById("form-register");

  tabLogin.onclick = () => {
    tabLogin.classList.add("active");
    tabRegister.classList.remove("active");
    formLogin.classList.remove("hidden");
    formRegister.classList.add("hidden");
  };

  tabRegister.onclick = () => {
    tabRegister.classList.add("active");
    tabLogin.classList.remove("active");
    formRegister.classList.remove("hidden");
    formLogin.classList.add("hidden");
  };

  formLogin.onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      const data = await api("/auth/login", {
        method: "POST",
        body: {
          email: fd.get("email"),
          password: fd.get("password"),
        },
      });

      setSession(data.token, data.usuario);
      renderAuthNav(true, data.usuario.role);
      toast(`Bem-vindo(a)! (${data.usuario.role})`, "success");
      showTela("catalogo");
      await carregarProdutos();

      if (data.usuario.role === "cliente") {
        await carregarCarrinho();
      }
    } catch (err) {
      toast(err.message, "error");
    }
  };

  formRegister.onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      await api("/auth/register", {
        method: "POST",
        body: {
          name: fd.get("name"),
          email: fd.get("email"),
          password: fd.get("password"),
          role: fd.get("role"),
        },
      });
      toast("Conta criada! Faça login.", "success");
      tabLogin.click();
      formRegister.reset();
    } catch (err) {
      toast(err.message, "error");
    }
  };

  document.getElementById("btn-logout").onclick = () => {
    setSession(null, null);
    state.carrinho = { itens: [], valorTotal: 0 };
    renderCarrinho();
    renderAuthNav(false, null);
    showTela("auth");
  };
}