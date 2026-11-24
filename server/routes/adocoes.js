import { Router } from "express";
import db from "../db.js";
import { validarAdocao } from "../validacao.js";

const router = Router();

router.get("/", async (req, res) => {
  const [adocoes] = await db.execute(
    `SELECT ad.id_adocao, ad.data_adocao, ad.observacao,
            an.nome AS animal, e.nome AS especie, t.nome AS adotante, t.cidade
       FROM adocao ad
       JOIN animal an ON an.id_animal = ad.id_animal
       JOIN especie e ON e.id_especie = an.id_especie
       JOIN adotante t ON t.id_adotante = ad.id_adotante
      ORDER BY ad.data_adocao DESC, ad.id_adocao DESC`,
  );
  res.json(adocoes);
});

// Registra a adoção e marca o animal como adotado, numa única transação
router.post("/", async (req, res) => {
  const erro = validarAdocao(req.body);
  if (erro) return res.status(400).json({ erro });
  const { id_adotante, id_animal, data_adocao } = req.body;
  const observacao = req.body.observacao?.trim() || null;

  const conexao = await db.getConnection();
  try {
    await conexao.beginTransaction();
    // FOR UPDATE trava a linha do animal até o fim da transação
    const [animais] = await conexao.execute(
      "SELECT status FROM animal WHERE id_animal = ? FOR UPDATE",
      [id_animal],
    );
    if (animais.length === 0) {
      await conexao.rollback();
      return res.status(400).json({ erro: "Animal inexistente" });
    }
    if (animais[0].status !== "disponivel") {
      await conexao.rollback();
      return res.status(409).json({ erro: "Animal não está disponível para adoção" });
    }
    const [resultado] = await conexao.execute(
      "INSERT INTO adocao (id_adotante, id_animal, data_adocao, observacao) VALUES (?, ?, ?, ?)",
      [id_adotante, id_animal, data_adocao, observacao],
    );
    await conexao.execute("UPDATE animal SET status = 'adotado' WHERE id_animal = ?", [id_animal]);
    await conexao.commit();
    res.status(201).json({ id_adocao: resultado.insertId });
  } catch (e) {
    await conexao.rollback();
    if (e.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ erro: "Adotante inexistente" });
    }
    if (e.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ erro: "Este animal já foi adotado" });
    }
    throw e;
  } finally {
    conexao.release();
  }
});

export default router;
