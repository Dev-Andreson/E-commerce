// Import Das Blibliotecas Start
import dotenv from "dotenv";
dotenv.config();
// Import Das Blibliotecas End

//Import das funções Start
import app from "./app.js";
import { conectarPostgre } from "./config/postgres.js";
import { conectarRedis } from "./config/redis.js";
import { conectarMongo } from "./config/mongodb.js";
//Import das funções End

//Conexão dos bancos de dados Start
async function iniciarBancos() {
  await conectarPostgre();
  await conectarMongo();
  await conectarRedis();
}

//Conexão dos bancos de dados End

const port = process.env.PORT;

async function iniciarServidor() {
  try {
    await iniciarBancos();

    app
      .listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
      })
      .on("error", (err) => {
        console.error("Erro ao iniciar servidor:", err);
        process.exit(1);
      });
  } catch (error) {
    console.log("Erro ao iniciar o servidor", error);
    process.exit(1);
  }
}

iniciarServidor();
