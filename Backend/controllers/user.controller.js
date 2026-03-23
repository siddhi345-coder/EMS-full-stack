const User = require("../models/user.model");

exports.getAllUsers = (req, res, next) => {
  try {
    res.json(User.getAllUsers());
  } catch (err) {
    next(err);
  }
};