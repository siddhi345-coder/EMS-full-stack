const jwt = require("jsonwebtoken");
const { secret, expiresIn } = require("../config/jwt");

module.exports = (payload) => {
  return jwt.sign(payload, secret, { expiresIn });
};