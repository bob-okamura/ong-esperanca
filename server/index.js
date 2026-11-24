import "dotenv/config";
import express from "express";
import db from "./db.js";
import auth, { autenticar } from "./auth.js";
import adotantes from "./routes/adotantes.js";
import animais from "./routes/animais.js";
import especies from "./routes/especies.js";
import adocoes from "./routes/adocoes.js";

if (!process.env.JWT_SECRET) {
  console.error("Defina JWT_SECRET no arquivo .env");
  process.exit(1);
}

const app = express();
app.use(express.json());

// Rotas públicas
app.get("/api/health", async (req, res) => {
  const timestamp = new Date().toISOString();
  try {
    await db.execute("SELECT 1");
    res.json({ status: "ok", banco: "ok", timestamp });
  } catch {
    res.status(500).json({ status: "ok", banco: "erro", timestamp });
  }
});
app.use("/api/auth", auth);

// Daqui para baixo, toda rota exige token (os dados de adotantes são pessoais: LGPD)
app.use("/api", autenticar);
app.use("/api/adotantes", adotantes);
app.use("/api/animais", animais);
app.use("/api/especies", especies);
app.use("/api/adocoes", adocoes);

// Rota /api desconhecida
app.use("/api", (req, res) => {
  res.status(404).json({ erro: "Rota não encontrada" });
});

// Tratador de erros: JSON inválido vira 400; o resto vira 500
app.use((err, req, res, _next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ erro: "JSON inválido no corpo da requisição" });
  }
  console.error(err);
  res.status(500).json({ erro: "Erro interno do servidor" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
