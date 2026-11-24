// Todas as chamadas à API passam por aqui
const CHAVE_TOKEN = "esperanca_token";
const CHAVE_NOME = "esperanca_usuario";

export function lerToken() {
  return localStorage.getItem(CHAVE_TOKEN);
}

export function lerNomeUsuario() {
  return localStorage.getItem(CHAVE_NOME);
}

export function sair() {
  localStorage.removeItem(CHAVE_TOKEN);
  localStorage.removeItem(CHAVE_NOME);
}

async function requisicao(metodo, url, corpo) {
  const opcoes = { method: metodo, headers: {} };
  if (corpo) {
    opcoes.headers["Content-Type"] = "application/json";
    opcoes.body = JSON.stringify(corpo);
  }
  const token = lerToken();
  if (token) opcoes.headers.Authorization = `Bearer ${token}`;

  const resposta = await fetch(url, opcoes);
  // Token vencido ou inválido: volta para a tela de login
  if (resposta.status === 401 && token) {
    sair();
    location.reload();
    throw new Error("Sessão expirada. Entre novamente.");
  }
  if (resposta.status === 204) return null;
  const dados = await resposta.json();
  if (!resposta.ok) throw new Error(dados.erro || `Erro ${resposta.status}`);
  return dados;
}

export async function entrar(email, senha) {
  const dados = await requisicao("POST", "/api/auth/login", { email, senha });
  localStorage.setItem(CHAVE_TOKEN, dados.token);
  localStorage.setItem(CHAVE_NOME, dados.usuario.nome);
  return dados.usuario;
}

export const verificarSaude = () => fetch("/api/health").then((r) => r.json());

export const listarAdotantes = () => requisicao("GET", "/api/adotantes");
export const cadastrarAdotante = (a) => requisicao("POST", "/api/adotantes", a);
export const editarAdotante = (id, a) => requisicao("PUT", `/api/adotantes/${id}`, a);
export const excluirAdotante = (id) => requisicao("DELETE", `/api/adotantes/${id}`);

export const listarEspecies = () => requisicao("GET", "/api/especies");
export const listarAnimais = (status) =>
  requisicao("GET", status ? `/api/animais?status=${status}` : "/api/animais");
export const cadastrarAnimal = (animal) => requisicao("POST", "/api/animais", animal);
export const excluirAnimal = (id) => requisicao("DELETE", `/api/animais/${id}`);

export const listarAdocoes = () => requisicao("GET", "/api/adocoes");
export const registrarAdocao = (adocao) => requisicao("POST", "/api/adocoes", adocao);
