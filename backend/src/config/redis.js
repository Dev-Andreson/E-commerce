// src/config/redis.js
import { createClient } from "redis";

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL não está definida no .env");
}

const redisDB = createClient({ url: process.env.REDIS_URL });

redisDB.on("connect", () => console.log("Conectando ao Redis..."));
redisDB.on("ready", () => console.log("Redis conectado"));
redisDB.on("error", (err) => console.error("Erro no Redis:", err.message));

export async function conectarRedis() {
  if (redisDB.isOpen) return redisDB;
  await redisDB.connect();
  return redisDB;
}

export default redisDB;