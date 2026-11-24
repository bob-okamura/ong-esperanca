import { cadastrarAnimal, excluirAnimal, listarAnimais, listarEspecies } from "../api.js";
import { celula, formatarData, mensagem } from "../ui.js";

const NOMES_STATUS = {
  disponivel: "Disponível",
  em_tratamento: "Em tratamento",
  adotado: "Adotado",
};
const NOMES_PORTE = { pequeno: "Pequeno", medio: "Médio", grande: "Grande" };

export function telaAnimais(raiz) {
  raiz.innerHTML = `
    <section>
      <h2>Animais</h2>
      <form id="form-animal" class="cartao grade">
        <label>Nome <input name="nome" required maxlength="80" /></label>
        <label>Espécie <select name="id_especie" required></select></label>
        <label>Sexo
          <select name="sexo" required>
            <option value="M">Macho</option>
            <option value="F">Fêmea</option>
          </select>
        </label>
        <label>Porte
          <select name="porte" required>
            <option value="pequeno">Pequeno</option>
            <option value="medio">Médio</option>
            <option value="grande">Grande</option>
          </select>
        </label>
        <label>Data de entrada <input name="data_entrada" type="date" required /></label>
        <label>Nascimento (aproximado) <input name="data_nascimento" type="date" /></label>
        <label>Situação
          <select name="status">
            <option value="disponivel">Disponível</option>
            <option value="em_tratamento">Em tratamento</option>
          </select>
        </label>
        <label class="checkbox"><input name="castrado" type="checkbox" /> Castrado</label>
        <label class="largo">Descrição <input name="descricao" maxlength="255" /></label>
        <p id="msg-animal" class="mensagem" hidden></p>
        <div class="acoes"><button type="submit">Cadastrar animal</button></div>
      </form>
      <div class="rolagem">
        <table>
          <thead>
            <tr><th>Nome</th><th>Espécie</th><th>Sexo</th><th>Porte</th><th>Entrada</th><th>Situação</th><th></th></tr>
          </thead>
          <tbody id="lista-animais"></tbody>
        </table>
      </div>
    </section>
  `;
  const form = raiz.querySelector("#form-animal");
  const msg = raiz.querySelector("#msg-animal");
  const corpo = raiz.querySelector("#lista-animais");

  async function carregar() {
    corpo.innerHTML = "<tr><td colspan='7'>Carregando...</td></tr>";
    try {
      const animais = await listarAnimais();
      corpo.innerHTML = "";
      for (const a of animais) {
        const tr = document.createElement("tr");
        celula(tr, a.nome);
        celula(tr, a.especie);
        celula(tr, a.sexo === "M" ? "Macho" : "Fêmea");
        celula(tr, NOMES_PORTE[a.porte]);
        celula(tr, formatarData(a.data_entrada));
        const situacao = celula(tr, NOMES_STATUS[a.status]);
        situacao.className = `status ${a.status}`;
        const acoes = celula(tr, "");
        if (a.status !== "adotado") {
          const excluir = document.createElement("button");
          excluir.textContent = "Excluir";
          excluir.className = "perigo";
          excluir.onclick = async () => {
            if (!confirm(`Excluir ${a.nome}?`)) return;
            try {
              await excluirAnimal(a.id_animal);
              mensagem(msg, "Animal excluído", "sucesso");
              carregar();
            } catch (erro) {
              mensagem(msg, erro.message);
            }
          };
          acoes.append(excluir);
        }
        corpo.append(tr);
      }
    } catch (erro) {
      corpo.innerHTML = "";
      mensagem(msg, erro.message);
    }
  }

  async function iniciar() {
    try {
      const especies = await listarEspecies();
      for (const e of especies) form.id_especie.add(new Option(e.nome, e.id_especie));
      // "sv-SE" formata como AAAA-MM-DD no fuso do computador
      form.data_entrada.value = new Date().toLocaleDateString("sv-SE");
    } catch (erro) {
      mensagem(msg, erro.message);
    }
    carregar();
  }

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    try {
      await cadastrarAnimal({
        id_especie: Number(form.id_especie.value),
        nome: form.nome.value.trim(),
        sexo: form.sexo.value,
        porte: form.porte.value,
        data_entrada: form.data_entrada.value,
        data_nascimento: form.data_nascimento.value || null,
        status: form.status.value,
        castrado: form.castrado.checked,
        descricao: form.descricao.value.trim(),
      });
      mensagem(msg, "Animal cadastrado", "sucesso");
      form.nome.value = "";
      form.data_nascimento.value = "";
      form.descricao.value = "";
      form.castrado.checked = false;
      carregar();
    } catch (erro) {
      mensagem(msg, erro.message);
    }
  });

  iniciar();
}
