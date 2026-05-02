const { body } = require("express-validator");

const validateTransaction = [
  body("cash").notEmpty().withMessage("Cash is required"),
  body("grand_total").notEmpty().withMessage("Grand Total is required"),
];

module.exports = { validateTransaction };
