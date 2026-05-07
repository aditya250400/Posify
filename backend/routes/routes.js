const {
  validateLogin,
  validateUser,
  validateCategory,
  validateProduct,
  validateCustomer,
  validateCart,
  validateTransaction,
  validateSales,
  validateProfit,
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
const customerController = require("../controllers/CustomerController");
const cartController = require("../controllers/CartController");
const transactionController = require("../controllers/TransactionController");
const salesController = require("../controllers/SalesController");
const profitController = require("../controllers/ProfitController");
const dashboardController = require("../controllers/DashboardController");

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
  //   customer Routes
  {
    method: "get",
    path: "/customers",
    middlewares: [verifyToken],
    handler: customerController.index,
  },
  {
    method: "post",
    path: "/customers",
    middlewares: [verifyToken, validateCustomer, handleValidationErrors],
    handler: customerController.create,
  },
  {
    method: "get",
    path: "/customers/:id",
    middlewares: [verifyToken],
    handler: customerController.show,
  },
  {
    method: "put",
    path: "/customers/:id",
    middlewares: [verifyToken, validateCustomer, handleValidationErrors],
    handler: customerController.update,
  },
  {
    method: "delete",
    path: "/customers/:id",
    middlewares: [verifyToken],
    handler: customerController.destroy,
  },
  {
    method: "get",
    path: "/customers-all",
    middlewares: [verifyToken],
    handler: customerController.allCustomers,
  },

  //   Carts Routes
  {
    method: "get",
    path: "/carts",
    middlewares: [verifyToken],
    handler: cartController.index,
  },
  {
    method: "post",
    path: "/carts",
    middlewares: [verifyToken, validateCart, handleValidationErrors],
    handler: cartController.create,
  },
  {
    method: "delete",
    path: "/carts/:id",
    middlewares: [verifyToken],
    handler: cartController.destroy,
  },
  //transaction routes
  {
    method: "post",
    path: "/transactions",
    middlewares: [verifyToken, validateTransaction, handleValidationErrors],
    handler: transactionController.create,
  },
  {
    method: "get",
    path: "/transactions",
    middlewares: [verifyToken],
    handler: transactionController.findTransactionByInvoice,
  },

  //sales controller
  {
    method: "get",
    path: "/sales",
    middlewares: [verifyToken, validateSales, handleValidationErrors],
    handler: salesController.filterSales,
  },
  {
    method: "get",
    path: "/sales/export",
    middlewares: [verifyToken, validateSales, handleValidationErrors],
    handler: salesController.exportSales,
  },
  //profits controller
  {
    method: "get",
    path: "/profits",
    middlewares: [verifyToken, validateProfit, handleValidationErrors],
    handler: profitController.filterProfit,
  },
  {
    method: "get",
    path: "/profits/export",
    middlewares: [verifyToken, validateProfit, handleValidationErrors],
    handler: profitController.exportProfit,
  },
  // Dashboard routes
  {
    method: "get",
    path: "/dashboard",
    middlewares: [verifyToken],
    handler: dashboardController.getDashboardData,
  },
];

module.exports = routes;
