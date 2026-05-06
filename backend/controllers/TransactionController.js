const express = require("express");
const prisma = require("../prisma/client");
const { generateRandomInvoice } = require("../utils/generateRandomInvoice");

const create = async (req, res) => {
  try {
    const invoice = generateRandomInvoice();
    const cashierId = parseInt(req.userId);
    const customerId = parseInt(req.body.customer_id) || null;
    const cash = parseInt(req.body.cash);
    const change = parseInt(req.body.change);
    const discount = parseInt(req.body.discount);
    const grandTotal = parseInt(req.body.grand_total);

    if (
      isNaN(customerId) ||
      isNaN(cash) ||
      isNaN(change) ||
      isNaN(discount) ||
      isNaN(grandTotal)
    ) {
      return res.status(400).send({
        meta: {
          success: false,
          message: "Input data is not valid. Please check your request",
        },
      });
    }

    const transaction = await prisma.transaction.create({
      data: {
        cashier_id: cashierId,
        customer_id: customerId,
        invoice,
        cash,
        change,
        discount,
        grand_total: grandTotal,
      },
    });

    const carts = await prisma.cart.findMany({
      where: { cashier_id: cashierId },
      include: { product: true },
    });

    for (const cart of carts) {
      const price = parseFloat(cart.price);

      await prisma.transactionDetail.create({
        data: {
          transaction_id: transaction.id,
          product_id: cart.product_id,
          qty: cart.qty,
          price: price,
        },
      });

      const totalBuyPrice = cart.product.buy_price * cart.qty;
      const totalSellPrice = cart.product.sell_price * cart.qty;
      const profits = totalSellPrice - totalBuyPrice;

      await prisma.profit.create({
        data: {
          transaction_id: transaction.id,
          total: profits,
        },
      });

      await prisma.product.update({
        where: { id: cart.product_id },
        data: {
          stock: {
            decrement: cart.qty,
          },
        },
      });
    }

    await prisma.cart.deleteMany({
      where: { cashier_id: cashierId },
    });

    res.status(201).send({
      meta: {
        success: true,
        message: "Transaction successfully created",
      },
      data: transaction,
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

module.exports = { create };
