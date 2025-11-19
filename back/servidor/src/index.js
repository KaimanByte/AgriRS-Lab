import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import rotaPublicacao from "./roteador/publicacaoRota.js";
import vagasRouter from "./roteador/vagasRota.js";
import noticiaRota from './roteador/noticiaRota.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use("/publicacao", rotaPublicacao);
app.use("/oportunidades", vagasRouter);
app.use('/noticias', noticiaRota);
app.use('/noticia', noticiaRota); // garante compatibilidade singular/plural
app.use('/uploads', express.static(path.join(process.cwd(), '..', 'uploads')));

app.use((req, res) => res.status(404).json({ erro: "Rota desconhecida" }));

app.listen(process.env.PORTA, () => {
  console.log(`✅ Servidor rodando na porta ${process.env.PORTA}`);
});
