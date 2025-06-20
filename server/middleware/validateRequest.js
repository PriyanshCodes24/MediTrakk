const { validationResult } = require("express-validator");

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => ({
      field: err.param,
      message: err.msg,
    }));
    return res.status(422).json({
      message: "Validation failed",
      errors: extractedErrors,
    });
  }
  next();
};

module.exports = validateRequest;
