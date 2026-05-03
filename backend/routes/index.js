const express = require("express");
const router = express.Router();
const { validateLogin } = require("../utils/validators");
const { handleValidationErrors } = require("../middlewares");
const loginController = require("../controllers/LoginController");

const routes = [
  {
    method: "post",
    path: "/login",
    middlewares: [validateLogin, handleValidationErrors],
    handler: loginController.login,
  },
];

const createRouters = (routes) => {
  routes.forEach(({ method, path, middlewares, handler }) => {
    router[method](path, ...middlewares, handler);
  });
};

createRouters(routes);

module.exports = router;
