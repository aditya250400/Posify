const {
  validateLogin,
  validateUser,
  validateCategory,
  validateProduct,
} = require("../utils/validators");
const {
  handleValidationErrors,
  verifyToken,
  upload,
} = require("../middlewares");
const loginController = require("../controllers/LoginController");
const userController = require("../controllers/UserController");
const categoryController = require("../controllers/CategoryController");
const productController = require("../controllers/ProductController");

const routes = [
  // auth
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
    handler: userController.index,
  },
  {
    method: "post",
    path: "/users",
    middlewares: [verifyToken, validateUser, handleValidationErrors],
    handler: userController.create,
  },
  {
    method: "get",
    path: "/users/:id",
    middlewares: [verifyToken],
    handler: userController.show,
  },
  {
    method: "put",
    path: "/users/:id",
    middlewares: [verifyToken, validateUser, handleValidationErrors],
    handler: userController.update,
  },
  {
    method: "delete",
    path: "/users/:id",
    middlewares: [verifyToken],
    handler: userController.destroy,
  },

  //   categories Routes
  {
    method: "get",
    path: "/categories",
    middlewares: [verifyToken],
    handler: categoryController.index,
  },
  {
    method: "post",
    path: "/categories",
    middlewares: [
      verifyToken,
      upload.single("image"),
      validateCategory,
      handleValidationErrors,
    ],
    handler: categoryController.create,
  },
  {
    method: "get",
    path: "/categories/:id",
    middlewares: [verifyToken],
    handler: categoryController.show,
  },
  {
    method: "put",
    path: "/categories/:id",
    middlewares: [
      verifyToken,
      upload.single("image"),
      validateCategory,
      handleValidationErrors,
    ],
    handler: categoryController.update,
  },
  {
    method: "delete",
    path: "/categories/:id",
    middlewares: [verifyToken],
    handler: categoryController.destroy,
  },
  {
    method: "get",
    path: "/categories-all",
    middlewares: [verifyToken],
    handler: categoryController.allCategories,
  },
  //   products Routes
  {
    method: "get",
    path: "/products",
    middlewares: [verifyToken],
    handler: productController.index,
  },
  {
    method: "post",
    path: "/products",
    middlewares: [
      verifyToken,
      upload.single("image"),
      validateProduct,
      handleValidationErrors,
    ],
    handler: productController.create,
  },
  {
    method: "get",
    path: "/products/:id",
    middlewares: [verifyToken],
    handler: productController.show,
  },
  {
    method: "put",
    path: "/products/:id",
    middlewares: [
      verifyToken,
      upload.single("image"),
      validateProduct,
      handleValidationErrors,
    ],
    handler: productController.update,
  },
  {
    method: "delete",
    path: "/products/:id",
    middlewares: [verifyToken],
    handler: productController.destroy,
  },
  {
    method: "get",
    path: "/products-by-category/:id",
    middlewares: [verifyToken],
    handler: productController.productByCategoryId,
  },
  {
    method: "post",
    path: "/products-by-barcode",
    middlewares: [verifyToken],
    handler: productController.productByBarcode,
  },
];

module.exports = routes;
