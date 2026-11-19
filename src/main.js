import "./style.css";

const app = document.querySelector("#app");

app.innerHTML = `
  <h1>ONG Esperança</h1>
  <p id="status">Verificando API...</p>
`;

const statusEl = document.querySelector("#status");

fetch("/api/health")
  .then((res) => res.json())
  .then((data) => {
    const dataHora = new Date(data.timestamp).toLocaleString("pt-BR");
    statusEl.textContent = `Status da API: ${data.status} (${dataHora})`;
  })
  .catch(() => {
    statusEl.textContent = "Status da API: indisponível";
  });
