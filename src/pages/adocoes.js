import { listarAdocoes, listarAdotantes, listarAnimais, registrarAdocao } from "../api.js";
import { celula, formatarData, mensagem } from "../ui.js";

export function telaAdocoes(raiz) {
  raiz.innerHTML = `
    <section>
      <h2>Adoções</h2>
      <form id="form-adocao" class="cartao grade">
        <label>Animal disponível <select name="id_animal" required></select></label>
        <label>Adotante <select name="id_adotante" required></select></label>
        <label>Data da adoção <input name="data_adocao" type="date" required /></label>
        <label>Observação <input name="observacao" maxlength="255" /></label>
        <p id="msg-adocao" class="mensagem" hidden></p>
        <div class="acoes"><button type="submit">Registrar adoção</button></div>
      </form>
      <div class="rolagem">
        <table>
          <thead>
            <tr><th>Data</th><th>Animal</th><th>Adotante</th><th>Cidade</th><th>Observação</th></tr>
          </thead>
          <tbody id="lista-adocoes"></tbody>
        </table>
      </div>
    </section>
  `;
  const form = raiz.querySelector("#form-adocao");
  const msg = raiz.querySelector("#msg-adocao");
  const corpo = raiz.querySelector("#lista-adocoes");
  const botao = form.querySelector("button[type=submit]");

  async function carregarAnimais() {
    const animais = await listarAnimais("disponivel");
    form.id_animal.innerHTML = "";
    for (const a of animais) {
      form.id_animal.add(new Option(`${a.nome} (${a.especie})`, a.id_animal));
    }
    botao.disabled = animais.length === 0;
    if (animais.length === 0) mensagem(msg, "Nenhum animal disponível para adoção", "info");
  }

  async function carregarLista() {
    const adocoes = await listarAdocoes();
    corpo.innerHTML = "";
    for (const a of adocoes) {
      const tr = document.createElement("tr");
      celula(tr, formatarData(a.data_adocao));
      celula(tr, `${a.animal} (${a.especie})`);
      celula(tr, a.adotante);
      celula(tr, a.cidade);
      celula(tr, a.observacao);
      corpo.append(tr);
    }
  }

  async function iniciar() {
    try {
      const adotantes = await listarAdotantes();
      for (const a of adotantes) form.id_adotante.add(new Option(a.nome, a.id_adotante));
      form.data_adocao.value = new Date().toLocaleDateString("sv-SE");
      await carregarAnimais();
      await carregarLista();
    } catch (erro) {
      mensagem(msg, erro.message);
    }
  }

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    try {
      await registrarAdocao({
        id_animal: Number(form.id_animal.value),
        id_adotante: Number(form.id_adotante.value),
        data_adocao: form.data_adocao.value,
        observacao: form.observacao.value.trim(),
      });
      mensagem(msg, "Adoção registrada", "sucesso");
      form.observacao.value = "";
      await carregarAnimais();
      await carregarLista();
    } catch (erro) {
      mensagem(msg, erro.message);
    }
  });

  iniciar();
}
