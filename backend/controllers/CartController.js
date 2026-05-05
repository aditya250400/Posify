const express = require("express");
const prisma = require("../prisma/client");

const index = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.userId,
      },
    });
    const carts = await prisma.cart.findMany({
      select: {
        id: true,
        cashier_id: true,
        product_id: true,
        qty: true,
        price: true,
        created_at: true,
        updated_at: true,
        product: {
          select: {
            id: true,
            title: true,
            buy_price: true,
            sell_price: true,
            image: true,
          },
        },
        cashier: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: {
        cashier_id: parseInt(req.userId),
      },
      orderBy: {
        id: "desc",
      },
    });

    const totalPrice = carts.reduce((sum, cart) => sum + cart.price, 0);

    res.status(200).send({
      meta: {
        success: true,
        message: `Carts successfully retrieved by cashier: ${user.name}`,
      },
      data: carts,
      totalPrice,
    });
  } catch (e) {
    console.log(e);

    res.status(500).send({
      meta: {
        success: false,
        message: "Internal Server Error",
      },
      errors: e,
    });
  }
};

const create = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(req.body.product_id),
      },
    });

    if (!product) {
      return res.status(404).send({
        meta: {
          success: false,
          message: `Product with id : ${req.body.product_id} not found!`,
        },
      });
    }

    const existingCart = await prisma.cart.findFirst({
      where: {
        product_id: parseInt(req.body.product_id),
        cashier_id: req.userId,
      },
    });

    if (existingCart) {
      const updateCart = await prisma.cart.update({
        where: { id: existingCart.id },
        data: {
          qty: existingCart.qty + parseInt(req.body.qty),
          price:
            product.sell_price * (existingCart.qty + parseInt(req.body.qty)),
          updated_at: new Date(),
        },
        include: {
          product: true,
          cashier: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return res.status(200).send({
        meta: {
          success: true,
          message: `Total carts successfully updated`,
        },
        data: updateCart,
      });
    } else {
      const cart = await prisma.cart.create({
        data: {
          cashier_id: req.userId,
          product_id: parseInt(req.body.product_id),
          qty: parseInt(req.body.qty),
          price: product.sell_price * parseInt(req.body.qty),
        },
        include: {
          product: true,
          cashier: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return res.status(200).send({
        meta: {
          success: true,
          message: `Carts successfully created`,
        },
        data: cart,
      });
    }
  } catch (e) {
    console.log(e);

    res.status(500).send({
      meta: {
        success: false,
        message: "Internal Server Error",
      },
      errors: e,
    });
  }
};

module.exports = { index, create };
