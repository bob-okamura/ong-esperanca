// Validações dos dados que chegam no corpo das requisições.
// Cada função devolve a mensagem de erro, ou null quando está tudo certo.
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FORMATO_DATA = /^\d{4}-\d{2}-\d{2}$/;
const SEXOS = ["M", "F"];
const PORTES = ["pequeno", "medio", "grande"];
const STATUS = ["disponivel", "em_tratamento", "adotado"];

function textoObrigatorio(valor) {
  return typeof valor === "string" && valor.trim() !== "";
}

export function validarAdotante(dados) {
  if (!textoObrigatorio(dados.nome)) return "Nome é obrigatório";
  if (dados.nome.length > 150) return "Nome pode ter no máximo 150 caracteres";
  if (dados.email && !FORMATO_EMAIL.test(dados.email)) return "E-mail inválido";
  if (!textoObrigatorio(dados.telefone)) return "Telefone é obrigatório";
  if (dados.telefone.length > 20) return "Telefone pode ter no máximo 20 caracteres";
  if (!textoObrigatorio(dados.cidade)) return "Cidade é obrigatória";
  if (dados.cidade.length > 80) return "Cidade pode ter no máximo 80 caracteres";
  return null;
}

export function validarAnimal(dados) {
  if (!Number.isInteger(dados.id_especie)) return "Espécie é obrigatória";
  if (!textoObrigatorio(dados.nome)) return "Nome é obrigatório";
  if (dados.nome.length > 80) return "Nome pode ter no máximo 80 caracteres";
  if (!SEXOS.includes(dados.sexo)) return "Sexo deve ser M ou F";
  if (!PORTES.includes(dados.porte)) return "Porte deve ser pequeno, medio ou grande";
  if (!FORMATO_DATA.test(dados.data_entrada || "")) {
    return "Data de entrada inválida (use AAAA-MM-DD)";
  }
  if (dados.data_nascimento) {
    if (!FORMATO_DATA.test(dados.data_nascimento)) {
      return "Data de nascimento inválida (use AAAA-MM-DD)";
    }
    if (dados.data_nascimento > dados.data_entrada) {
      return "A data de nascimento não pode ser depois da data de entrada";
    }
  }
  if (dados.status && !STATUS.includes(dados.status)) return "Status inválido";
  if (dados.descricao && dados.descricao.length > 255) {
    return "Descrição pode ter no máximo 255 caracteres";
  }
  return null;
}

export function validarAdocao(dados) {
  if (!Number.isInteger(dados.id_adotante)) return "Adotante é obrigatório";
  if (!Number.isInteger(dados.id_animal)) return "Animal é obrigatório";
  if (!FORMATO_DATA.test(dados.data_adocao || "")) return "Data inválida (use AAAA-MM-DD)";
  if (dados.observacao && dados.observacao.length > 255) {
    return "Observação pode ter no máximo 255 caracteres";
  }
  return null;
}

export function validarLogin(dados) {
  if (!dados.email || !dados.senha) return "Informe e-mail e senha";
  return null;
}
