let jwt = require("jsonwebtoken");

let secret = "segredo";

module.exports = function (req, res, next) {
  const authToken = req.headers["authorization"];

  if (authToken) {
    const bearer = authToken.split(" ");
    let token = bearer[1];

    try {
      let decoded = jwt.verify(token, secret);
      next();
    } catch (error) {
      res.status(403);
      res.send("Você não esta autenticado.");
      return;
    }
  } else {
    res.status(403);
    res.send("Você não está autenticado.");
    return;
  }
};
