import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rotaPublicacao from "./roteador/publicacaoRota.js"; // <== Caminho exato!

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rotas principais
app.use("/publicacao", rotaPublicacao); // <== Precisa ser antes da rota de erro!

// Rota padrão
app.use((req, res) => res.status(404).json({ erro: "Rota desconhecida" }));

app.listen(process.env.PORTA, () => {
  console.log(`✅ Servidor rodando na porta ${process.env.PORTA}`);
});
