const validator = require("express-validator");

module.exports = (req, res, next) => {
  const errors = validator.validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({message: errors.array()[0].msg});
  next();
};