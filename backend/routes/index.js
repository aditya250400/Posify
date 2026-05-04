const express = require("express");
const router = express.Router();
const { validateLogin, validateUser } = require("../utils/validators");
const { handleValidationErrors, verifyToken } = require("../middlewares");
const loginController = require("../controllers/LoginController");
const userController = require("../controllers/UserController");

const routes = [
  {
    method: "post",
    path: "/login",
    middlewares: [validateLogin, handleValidationErrors],
    handler: loginController.login,
  },

  // User Routes
  {
    method: "get",
    path: "/users",
    middlewares: [verifyToken],
    handler: userController.findUsers,
  },
  {
    method: "post",
    path: "/users",
    middlewares: [verifyToken, validateUser, handleValidationErrors],
    handler: userController.createUser,
  },
  {
    method: "get",
    path: "/users/:id",
    middlewares: [verifyToken],
    handler: userController.findUserById,
  },
];

const createRouters = (routes) => {
  routes.forEach(({ method, path, middlewares, handler }) => {
    router[method](path, ...middlewares, handler);
  });
};

createRouters(routes);

module.exports = router;
