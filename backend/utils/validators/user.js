const { body } = require("express-validator");
const prisma = require("../../prisma/client");

const validateUser = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .custom(async (value, { req }) => {
      if (!value) {
        throw new Error("Email is required");
      }

      const user = await prisma.user.findFirst({
        where: {
          email: value,
          NOT: { id: Number(req.params.id) || undefined },
        },
      });

      if (user) {
        throw new Error("Email already exists");
      }

      return true;
    }),

  body("password")
    .if((value, { req }) => req.method === "POST")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("password")
    .if((value, { req }) => req.method === "PUT")
    .optional(),
];

module.exports = { validateUser };
