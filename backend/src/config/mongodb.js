// src/config/mongodb.js
import mongoose from "mongoose";

const url = process.env.MONGO_URL;

if (!url) {
  throw new Error("MONGO_URL não está definida no .env");
}

export async function conectarMongo() {
  try {
    await mongoose.connect(url);
    console.log("MongoDB conectado");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error.message);
    throw error;
  }
  return mongoose;
}

export default { mongoose };