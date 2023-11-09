const User = require("../models/User");
const PasswordToken = require("../models/PasswordToken");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const secret = "segredo";

class UserController {
  async index(req, res) {
    let users = await User.findAll();
    res.json(users);
  }

  async create(req, res) {
    let { name, email, password } = req.body;
    if (name == undefined) {
      res.status(400).send("Nome inválido.");
      return;
    }
    if (email == undefined) {
      res.status(400).send("Email inválido.");
      return;
    }
    if (password == undefined) {
      res.status(400).send("Senha inválida.");
      return;
    }

    let userExistente = await User.findEmail(email);
    if (!userExistente[0]) {
      await User.new(name, email, password);
      res.sendStatus(201);
    } else {
      res.status(200).send("Email informado já está em uso.");
    }
  }

  async findById(req, res) {
    let id = req.params.id;
    let user = await User.findById(id);
    user ? res.status(200).json(user) : res.sendStatus(404);
  }

  async update(req, res) {
    let { id, name, email, role } = req.body;
    let result = await User.update(id, name, email, role);
    if (result) {
      if (result.status) {
        res.send("Ok");
      } else {
        res.status(406);
        res.json(result);
      }
    } else {
      res.status(406);
      res.send("Erro no servidor.");
    }
  }

  async remove(req, res) {
    let id = req.params.id;

    let result = await User.delete(id);

    if (result.status) {
      res.status(200);
      res.send("Suceso.");
    } else {
      res.status(406);
      res.json(result.err);
    }
  }

  async recoverPassword(req, res) {
    let email = req.body.email;

    let result = await PasswordToken.create(email);
    if (result.status) {
      res.status(200);
      res.send(result.token + "");
    } else {
      res.status(406);
      res.send(result.err);
    }
  }

  async changePassword(req, res) {
    let token = req.body.token;
    let password = req.body.password;

    let tokenValid = await PasswordToken.validade(token);

    if (tokenValid.status) {
      await User.changePassword(
        password,
        tokenValid.token.user_id,
        tokenValid.token.token
      );
      res.status(200);
      res.send("Sucesso ao editar usuario");
    } else {
      res.status(406);
      res.send("token inválido.");
    }
  }

  async login(req, res) {
    let { email, password } = req.body;

    let usuario = await User.findByEmail(email);
    if (usuario) {
      let valid = await bcrypt.compare(password, usuario.password);
      if (valid) {
        let token = jwt.sign({email: usuario.email, role: usuario.role}, secret);
        res.status(200);
        res.json({token: token})
      }
    } else {
      res.status(406);
      res.json({ status: false });
    }
  }
}

module.exports = new UserController();
