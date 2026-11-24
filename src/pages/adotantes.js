import { cadastrarAdotante, editarAdotante, excluirAdotante, listarAdotantes } from "../api.js";
import { celula, mensagem } from "../ui.js";

export function telaAdotantes(raiz) {
  raiz.innerHTML = `
    <section>
      <h2>Adotantes</h2>
      <form id="form-adotante" class="cartao grade">
        <input type="hidden" name="id" />
        <label>Nome <input name="nome" required maxlength="150" /></label>
        <label>E-mail <input name="email" type="email" maxlength="100" /></label>
        <label>Telefone <input name="telefone" required maxlength="20" /></label>
        <label>Cidade <input name="cidade" required maxlength="80" /></label>
        <p id="msg-adotante" class="mensagem" hidden></p>
        <div class="acoes">
          <button type="submit">Salvar</button>
          <button type="reset" class="secundario">Limpar</button>
        </div>
      </form>
      <div class="rolagem">
        <table>
          <thead>
            <tr><th>Nome</th><th>E-mail</th><th>Telefone</th><th>Cidade</th><th></th></tr>
          </thead>
          <tbody id="lista-adotantes"></tbody>
        </table>
      </div>
    </section>
  `;
  const form = raiz.querySelector("#form-adotante");
  const msg = raiz.querySelector("#msg-adotante");
  const corpo = raiz.querySelector("#lista-adotantes");

  async function carregar() {
    corpo.innerHTML = "<tr><td colspan='5'>Carregando...</td></tr>";
    try {
      const adotantes = await listarAdotantes();
      corpo.innerHTML = "";
      for (const a of adotantes) {
        const tr = document.createElement("tr");
        celula(tr, a.nome);
        celula(tr, a.email);
        celula(tr, a.telefone);
        celula(tr, a.cidade);
        const acoes = celula(tr, "");
        const editar = document.createElement("button");
        editar.textContent = "Editar";
        editar.className = "secundario";
        editar.onclick = () => {
          form.id.value = a.id_adotante;
          form.nome.value = a.nome;
          form.email.value = a.email ?? "";
          form.telefone.value = a.telefone;
          form.cidade.value = a.cidade;
          form.nome.focus();
        };
        const excluir = document.createElement("button");
        excluir.textContent = "Excluir";
        excluir.className = "perigo";
        excluir.onclick = async () => {
          if (!confirm(`Excluir ${a.nome}?`)) return;
          try {
            await excluirAdotante(a.id_adotante);
            mensagem(msg, "Adotante excluído", "sucesso");
            carregar();
          } catch (erro) {
            mensagem(msg, erro.message);
          }
        };
        acoes.append(editar, excluir);
        corpo.append(tr);
      }
    } catch (erro) {
      corpo.innerHTML = "";
      mensagem(msg, erro.message);
    }
  }

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const dados = {
      nome: form.nome.value.trim(),
      email: form.email.value.trim(),
      telefone: form.telefone.value.trim(),
      cidade: form.cidade.value.trim(),
    };
    try {
      if (form.id.value) await editarAdotante(form.id.value, dados);
      else await cadastrarAdotante(dados);
      mensagem(msg, "Adotante salvo", "sucesso");
      form.reset();
      form.id.value = "";
      carregar();
    } catch (erro) {
      mensagem(msg, erro.message);
    }
  });
  form.addEventListener("reset", () => {
    form.id.value = "";
  });

  carregar();
}
