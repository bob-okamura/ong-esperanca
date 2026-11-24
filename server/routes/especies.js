import { Router } from "express";
import db from "../db.js";

const router = Router();

// Catálogo de espécies: vem pronto do seed.sql e alimenta o formulário de animais
router.get("/", async (req, res) => {
  const [especies] = await db.execute("SELECT id_especie, nome FROM especie ORDER BY nome");
  res.json(especies);
});

export default router;
