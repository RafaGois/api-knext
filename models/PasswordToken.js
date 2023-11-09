const bcrypt = require("bcrypt");
const User = require("../models/User");
const knex = require("../database/connection");

class PasswordToken {
  async create(email) {
    try {
      let user = await User.findByEmail(email);
      if (user) {
        let token = Date.now();
        await knex
          .insert({
            user_id: user.id,
            used: 0,
            token: token,
          })
          .table("passwordtokens");
        return { status: true, token: token };
      } else {
        return { status: false, err: "Usuário não encontrado." };
      }
    } catch (err) {
      return { status: false, err: err };
    }
  }

  async validade(token) {
    try {
      let result = await knex
        .select()
        .where({ token: token })
        .table("passwordtokens");

      console.log(result);
      if (result) {
        let tk = result[0];
        if (tk.used) {
          return { status: false };
        } else {
          return { status: true, token: tk };
        }
      } else {
        return { status: false };
      }
    } catch (err) {
      console.log(err);
    }
  }

  async setUsed(token) {
    await knex
      .update({ used: 1 })
      .where({ token: token })
      .table("passwordtokens");
  }
}

module.exports = new PasswordToken();
