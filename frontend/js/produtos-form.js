// frontend/js/produtos-form.js
import { api } from "./api.js";
import { toast } from "./ui.js";
import { carregarProdutos } from "./produtos.js";

export function initProdutoForm() {
  const modal = document.getElementById("modal-produto");
  const btnAbrir = document.getElementById("btn-novo-produto");
  const btnFechar = document.getElementById("modal-close");
  const form = document.getElementById("form-produto");

  btnAbrir.onclick = () => modal.classList.remove("hidden");
  btnFechar.onclick = () => modal.classList.add("hidden");

  modal.onclick = (e) => {
    if (e.target === modal) modal.classList.add("hidden");
  };

  form.onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const btn = form.querySelector("button[type=submit]");

    btn.disabled = true;
    btn.textContent = "Cadastrando...";

    try {
      const dados = {
        nome: String(fd.get("nome")).trim(),
        descricao: String(fd.get("descricao")).trim(),
        preco: Number(fd.get("preco")),
        estoque: Number(fd.get("estoque")),
        categoria: String(fd.get("categoria")),
      };

      await api("/produtos", { method: "POST", auth: true, body: dados });

      toast("Produto cadastrado!", "success");
      form.reset();
      modal.classList.add("hidden");
      await carregarProdutos();
    } catch (err) {
      toast(err.message, "error");
    } finally {
      btn.disabled = false;
      btn.textContent = "Cadastrar produto";
    }
  };
}