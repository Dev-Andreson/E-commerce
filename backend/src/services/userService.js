// src/services/postgre/userService.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserRepository from "../repositories/userRepository.js";

class UserService {
  async registrarUsuario(name, email, password, role = "cliente") {
    const verificarEmail = await UserRepository.buscarPorEmail(email);
    if (verificarEmail) {
      return { error: "Erro", campo: "Email", mensagem: "Email já cadastrado" };
    }

    const senhaHash = await bcrypt.hash(password, 10);

    const usuario = await UserRepository.criarUsuario(
      name,
      email,
      senhaHash,
      role
    );
    return usuario;
  }

  async loginUser(email, password) {
    const usuario = await UserRepository.buscarPorEmail(email);
    if (!usuario) {
      return { error: "Erro", campo: "Email", mensagem: "Usuario não encontrado" };
    }

    const senha = await bcrypt.compare(password, usuario.password);
    if (!senha) {
      return { error: "Erro", campo: "Senha", mensagem: "Senha inválida" };
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      const err = new Error("JWT_SECRET não configurado");
      err.status = 500;
      throw err;
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, role: usuario.role },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    return { usuario, token };
  }
}

export default new UserService();