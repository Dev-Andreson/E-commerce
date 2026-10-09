import mongoose from "mongoose";

const produtoSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, "O nome do produto é obrigatório"],
      trim: true,
      unique: true,
    },
    descricao: {
      type: String,
      required: [true, "A descrição do produto é obrigatória"],
    },
    preco: {
      type: Number,
      required: [true, "O preço do produto é obrigatório"],
      min: [0, "O preço não pode ser menor que zero"],
    },
    categoria: {
      type: String,
      required: [true, "A categoria é obrigatória"],
      enum: ["Eletrónicos", "Roupas", "Alimentos", "Casa", "Outros"],
    },
    estoque: {
      type: Number,
      required: [true, "A quantidade em estoque é obrigatória"],
      default: 0,
      min: 0,
    },
    atributos: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
    ativo: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

const Produto = mongoose.model("Produto", produtoSchema);

export default Produto;
