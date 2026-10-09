// Imports das Funções Start
import UserValidator from "../validators/userValidator.js"
import UserService from "../services/userService.js";
// Imports das Funções End

class UserController {
  async create(req, res) {
    try {
      const { name, email, password, role } = req.body;

      const validarRegistro = await UserValidator.verificarRegistro(
        name,
        email,
        password,
        role
      );
      if (!validarRegistro.valido) {
        return res.status(400).json({
          campo: validarRegistro.campo,
          mensagem: validarRegistro.mensagem,
        });
      }

      const criarUsuario = await UserService.registrarUsuario(
        name,
        email,
        password,
        role || "cliente"
      );
      if (criarUsuario.error) {
        return res.status(400).json({
          campo: criarUsuario.campo,
          mensagem: criarUsuario.mensagem,
        });
      }

      res
        .status(201)
        .json({ mensagem: "Usuario Criado", usuario: criarUsuario });
    } catch (error) {
      console.error("Erro ao criar usuario", error);
      res.status(500).json({ erro: "Erro interno no servidor" });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const validarLogin = await UserValidator.verificarLogin(email, password);
      if (!validarLogin.valido) {
        return res
          .status(401)
          .json({ campo: validarLogin.campo, mensagem: validarLogin.mensagem });
      }

      const fazerLogin = await UserService.loginUser(email, password);
      if (fazerLogin.error) {
        return res
          .status(401)
          .json({ campo: fazerLogin.campo, mensagem: fazerLogin.mensagem });
      }

      res
        .status(200)
        .json({ usuario: fazerLogin.usuario, token: fazerLogin.token });
    } catch (error) {
      console.error("Erro ao fazer login", error);
      res.status(500).json({ erro: "Erro interno no servidor" });
    }
  }
}

export default new UserController();