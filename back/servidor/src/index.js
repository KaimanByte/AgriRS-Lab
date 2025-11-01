import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rotaPublicacao from "./roteador/publicacaoRota.js"; 
import vagasRouter from "./roteador/vagasRota.js";
import noticiaRota from './roteador/noticiaRota.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/publicacao", rotaPublicacao); 
app.use("/oportunidades", vagasRouter);
app.use('/noticias', noticiaRota);
app.use('/noticia', noticiaRota); // garante compatibilidade singular/plural

app.use((req, res) => res.status(404).json({ erro: "Rota desconhecida" }));

app.listen(process.env.PORTA, () => {
  console.log(`✅ Servidor rodando na porta ${process.env.PORTA}`);
});
