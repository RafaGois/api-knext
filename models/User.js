const knex = require("../database/connection");
const bcrypt = require("bcrypt");
const PasswordToken = require("./PasswordToken");

class User {
  async findAll() {
    try {
      let result = await knex
        .select(["id", "name", "email", "role"])
        .table("users");
      return result;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  async new(name, email, password) {
    try {
      let encryptedPassword = await bcrypt.hash(password, 5);
      await knex
        .insert({ name, email, password: encryptedPassword, role: 0 })
        .table("users");
    } catch (err) {
      console.log(err);
    }
  }
  async findEmail(email) {
    try {
      let result = await knex.select("*").from("users").where({ email: email });
      return result;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async findById(id) {
    try {
      let result = await knex
        .select(["id", "name", "email", "role"])
        .where({ id: id })
        .table("users");
      return result[0];
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async findByEmail(email) {
    try {
      let result = await knex
        .select(["id", "name", "password", "email", "role"])
        .where({ email: email })
        .table("users");
      return result[0];
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async update(id, name, email, role) {
    try {
      let usuarioCriado = await this.findById(id);
      if (usuarioCriado) {
        let editUser = {};

        if (email) {
          if (email != usuarioCriado.email) {
            let result = await this.findEmail(email);
            if (result) {
              editUser.email = email;
            } else {
              return { status: false, err: "usuário informado não existe." };
            }
          }
        }

        if (name) {
          editUser.name = name;
        }

        if (role) {
          editUser.role = role;
        }

        try {
          await knex.update(editUser).where({ id: id }).table("users");
          return { status: true };
        } catch (err) {
          console.log(err);
        }
      } else {
        return { status: false, err: "usuário informado não existe." };
      }
    } catch (err) {
      console.log(err);
    }
  }

  async delete(id) {
    try {
      let usuario = await this.findById(id);
      if (usuario) {
        await knex.delete().where({ id: id }).table("users");
        return { status: true };
      } else {
        return {
          status: false,
          err: "O usuario não existe, portanto não pode ser deletado.",
        };
      }
    } catch (err) {
      return { status: false, err: err };
    }
  }

  async changePassword(newPassword, id, token) {
    let encryptedPassword = await bcrypt.hash(newPassword, 5);
    await knex.update({password: encryptedPassword}).where({id:id}).table("users");
    await PasswordToken.setUsed(token);
  }
}

module.exports = new User();
