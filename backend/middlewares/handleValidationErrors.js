const { validationResult } = require("express-validator");
const fs = require("fs");
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }

    return res.status(422).json({
      meta: {
        success: false,
        message: "Validation errors occured",
      },
      errors: errors.array(),
    });
  }

  next();
};

module.exports = handleValidationErrors;
