// src/validators/postgre/userValidator.js
class UserValidator {
  verificarNome(nome) {
    const NOME_MIN = 3;
    const NOME_MAX = 100;

    if (typeof nome !== "string" || nome.trim() === "") {
      return { valido: false, campo: "name", mensagem: "O nome é obrigatório." };
    }

    const nomeLimpo = nome.trim();

    if (nomeLimpo.length < NOME_MIN) {
      return {
        valido: false,
        campo: "name",
        mensagem: `O nome deve ter pelo menos ${NOME_MIN} caracteres.`,
      };
    }

    if (nomeLimpo.length > NOME_MAX) {
      return {
        valido: false,
        campo: "name",
        mensagem: `O nome deve ter no máximo ${NOME_MAX} caracteres.`,
      };
    }

    return { valido: true };
  }

  verificarEmail(email) {
    const EMAIL_MAX = 254;
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (typeof email !== "string" || email.trim() === "") {
      return { valido: false, campo: "email", mensagem: "O e-mail é obrigatório." };
    }

    const emailLimpo = email.trim();

    if (emailLimpo.length > EMAIL_MAX) {
      return {
        valido: false,
        campo: "email",
        mensagem: `O e-mail deve ter no máximo ${EMAIL_MAX} caracteres.`,
      };
    }

    if (!EMAIL_REGEX.test(emailLimpo)) {
      return { valido: false, campo: "email", mensagem: "Informe um e-mail válido." };
    }

    return { valido: true };
  }

  verificarSenha(password) {
    const SENHA_MIN = 8;
    const SENHA_MAX = 100;

    if (typeof password !== "string" || password.trim() === "") {
      return { valido: false, campo: "password", mensagem: "A senha é obrigatória." };
    }

    if (password.length < SENHA_MIN) {
      return {
        valido: false,
        campo: "password",
        mensagem: `A senha deve ter pelo menos ${SENHA_MIN} caracteres.`,
      };
    }

    if (password.length > SENHA_MAX) {
      return {
        valido: false,
        campo: "password",
        mensagem: `A senha deve ter no máximo ${SENHA_MAX} caracteres.`,
      };
    }

    if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      return {
        valido: false,
        campo: "password",
        mensagem: "A senha deve conter pelo menos uma letra e um número.",
      };
    }

    return { valido: true };
  }

  verificarRole(role) {
    const ROLES = ["admin", "cliente"];

    if (role === undefined || role === null || role === "") {
      return { valido: true };
    }

    if (typeof role !== "string" || !ROLES.includes(role)) {
      return {
        valido: false,
        campo: "role",
        mensagem: `Tipo de conta inválido. Use: ${ROLES.join(" ou ")}.`,
      };
    }

    return { valido: true };
  }

  verificarRegistro(name, email, password, role) {
    const vNome = this.verificarNome(name);
    if (!vNome.valido) return vNome;

    const vEmail = this.verificarEmail(email);
    if (!vEmail.valido) return vEmail;

    const vSenha = this.verificarSenha(password);
    if (!vSenha.valido) return vSenha;

    const vRole = this.verificarRole(role);
    if (!vRole.valido) return vRole;

    return { valido: true };
  }

  verificarLogin(email, password) {
    const vEmail = this.verificarEmail(email);
    if (!vEmail.valido) return vEmail;

    if (typeof password !== "string" || password.trim() === "") {
      return { valido: false, campo: "password", mensagem: "A senha é obrigatória." };
    }

    return { valido: true };
  }
}

export default new UserValidator();