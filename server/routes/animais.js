import { Router } from "express";
import db from "../db.js";
import { validarAnimal } from "../validacao.js";

const router = Router();

// GET /api/animais          → todos
// GET /api/animais?status=disponivel → só os disponíveis (usado no formulário de adoção)
router.get("/", async (req, res) => {
  const filtro = req.query.status ? "WHERE a.status = ?" : "";
  const parametros = req.query.status ? [req.query.status] : [];
  const [animais] = await db.execute(
    `SELECT a.id_animal, a.id_especie, e.nome AS especie, a.nome, a.sexo, a.porte,
            a.data_nascimento, a.data_entrada, a.castrado, a.status, a.descricao
       FROM animal a JOIN especie e ON e.id_especie = a.id_especie
       ${filtro}
      ORDER BY a.nome`,
    parametros,
  );
  res.json(animais.map((a) => ({ ...a, castrado: Boolean(a.castrado) })));
});

router.post("/", async (req, res) => {
  const erro = validarAnimal(req.body);
  if (erro) return res.status(400).json({ erro });
  const a = {
    id_especie: req.body.id_especie,
    nome: req.body.nome.trim(),
    sexo: req.body.sexo,
    porte: req.body.porte,
    data_nascimento: req.body.data_nascimento || null,
    data_entrada: req.body.data_entrada,
    castrado: Boolean(req.body.castrado),
    status: req.body.status || "disponivel",
    descricao: req.body.descricao?.trim() || null,
  };
  if (a.status === "adotado") {
    return res
      .status(400)
      .json({ erro: "Use o registro de adoção para marcar um animal como adotado" });
  }
  try {
    const [resultado] = await db.execute(
      `INSERT INTO animal (id_especie, nome, sexo, porte, data_nascimento, data_entrada,
                           castrado, status, descricao)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        a.id_especie,
        a.nome,
        a.sexo,
        a.porte,
        a.data_nascimento,
        a.data_entrada,
        a.castrado,
        a.status,
        a.descricao,
      ],
    );
    res.status(201).json({ id_animal: resultado.insertId, ...a });
  } catch (e) {
    if (e.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ erro: "Espécie inexistente" });
    }
    throw e;
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const [resultado] = await db.execute("DELETE FROM animal WHERE id_animal = ?", [req.params.id]);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Animal não encontrado" });
    }
    res.status(204).end();
  } catch (e) {
    if (e.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({ erro: "Animal já foi adotado e não pode ser excluído" });
    }
    throw e;
  }
});

export default router;
