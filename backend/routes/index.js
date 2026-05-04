const express = require("express");
const router = express.Router();
const routes = require("./routes");

const createRouters = (routes) => {
  routes.forEach(({ method, path, middlewares, handler }) => {
    router[method](path, ...middlewares, handler);
  });
};

createRouters(routes);

module.exports = router;
