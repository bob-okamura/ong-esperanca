import { Router } from "express";
import db from "../db.js";
import { validarAdotante } from "../validacao.js";

const router = Router();
const CAMPOS = "id_adotante, nome, email, telefone, cidade";

function lerCorpo(body) {
  return {
    nome: body.nome.trim(),
    email: body.email?.trim() || null,
    telefone: body.telefone.trim(),
    cidade: body.cidade.trim(),
  };
}

router.get("/", async (req, res) => {
  const [adotantes] = await db.execute(`SELECT ${CAMPOS} FROM adotante ORDER BY nome`);
  res.json(adotantes);
});

router.get("/:id", async (req, res) => {
  const [linhas] = await db.execute(`SELECT ${CAMPOS} FROM adotante WHERE id_adotante = ?`, [
    req.params.id,
  ]);
  if (linhas.length === 0) return res.status(404).json({ erro: "Adotante não encontrado" });
  res.json(linhas[0]);
});

router.post("/", async (req, res) => {
  const erro = validarAdotante(req.body);
  if (erro) return res.status(400).json({ erro });
  const a = lerCorpo(req.body);
  try {
    const [resultado] = await db.execute(
      "INSERT INTO adotante (nome, email, telefone, cidade) VALUES (?, ?, ?, ?)",
      [a.nome, a.email, a.telefone, a.cidade],
    );
    res.status(201).json({ id_adotante: resultado.insertId, ...a });
  } catch (e) {
    if (e.code === "ER_DUP_ENTRY") return res.status(409).json({ erro: "E-mail já cadastrado" });
    throw e;
  }
});

router.put("/:id", async (req, res) => {
  const erro = validarAdotante(req.body);
  if (erro) return res.status(400).json({ erro });
  const a = lerCorpo(req.body);
  try {
    const [resultado] = await db.execute(
      "UPDATE adotante SET nome = ?, email = ?, telefone = ?, cidade = ? WHERE id_adotante = ?",
      [a.nome, a.email, a.telefone, a.cidade, req.params.id],
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Adotante não encontrado" });
    }
    res.json({ id_adotante: Number(req.params.id), ...a });
  } catch (e) {
    if (e.code === "ER_DUP_ENTRY") return res.status(409).json({ erro: "E-mail já cadastrado" });
    throw e;
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const [resultado] = await db.execute("DELETE FROM adotante WHERE id_adotante = ?", [
      req.params.id,
    ]);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Adotante não encontrado" });
    }
    res.status(204).end();
  } catch (e) {
    if (e.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({ erro: "Adotante possui adoções e não pode ser excluído" });
    }
    throw e;
  }
});

export default router;
