import "./style.css";
import { lerNomeUsuario, lerToken, sair, verificarSaude } from "./api.js";
import { telaAdocoes } from "./pages/adocoes.js";
import { telaAdotantes } from "./pages/adotantes.js";
import { telaAnimais } from "./pages/animais.js";
import { telaLogin } from "./pages/login.js";

const app = document.querySelector("#app");
const telas = { animais: telaAnimais, adotantes: telaAdotantes, adocoes: telaAdocoes };

function mostrarApp() {
  app.innerHTML = `
    <header class="topo">
      <strong>ONG Esperança</strong>
      <nav>
        <button data-tela="animais">Animais</button>
        <button data-tela="adotantes">Adotantes</button>
        <button data-tela="adocoes">Adoções</button>
      </nav>
      <span class="usuario"></span>
      <button id="sair" class="secundario">Sair</button>
    </header>
    <div id="conteudo"></div>
  `;
  app.querySelector(".usuario").textContent = lerNomeUsuario();
  const conteudo = app.querySelector("#conteudo");
  const botoes = app.querySelectorAll("nav button");

  function abrir(nome) {
    for (const b of botoes) {
      if (b.dataset.tela === nome) b.setAttribute("aria-current", "page");
      else b.removeAttribute("aria-current");
    }
    telas[nome](conteudo);
  }

  for (const botao of botoes) {
    botao.onclick = () => abrir(botao.dataset.tela);
  }
  app.querySelector("#sair").onclick = () => {
    sair();
    iniciar();
  };
  abrir("animais");
}

function iniciar() {
  if (lerToken()) mostrarApp();
  else telaLogin(app, mostrarApp);
}

// Rodapé: indicador de saúde da API e do banco (rota pública /api/health)
async function mostrarSaude() {
  const rodape = document.querySelector("#saude");
  try {
    const dados = await verificarSaude();
    const dataHora = new Date(dados.timestamp).toLocaleString("pt-BR");
    rodape.textContent = `Status da API: ${dados.status} · Banco: ${dados.banco} (${dataHora})`;
  } catch {
    rodape.textContent = "Status da API: indisponível";
  }
}

mostrarSaude();
iniciar();
