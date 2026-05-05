const express = require("express");
const prisma = require("../prisma/client");
const { validationResult } = require("express-validator");
const fs = require("fs");

const index = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const products = await prisma.product.findMany({
      where: {
        title: { contains: search },
      },
      select: {
        id: true,
        barcode: true,
        title: true,
        image: true,
        description: true,
        buy_price: true,
        sell_price: true,
        stock: true,
        created_at: true,
        updated_at: true,
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { id: "desc" },
      skip: skip,
      take: limit,
    });

    const totalProducts = await prisma.product.count({
      where: {
        title: {
          contains: search,
        },
      },
    });

    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).send({
      meta: {
        success: true,
        message: "List products data",
      },
      data: products,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalProducts: totalProducts,
      },
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
    const {
      barcode,
      title,
      description,
      buy_price,
      sell_price,
      stock,
      category_id,
    } = req.body;

    const product = await prisma.product.create({
      data: {
        title,
        description,
        barcode,
        buy_price: Number(buy_price),
        sell_price: Number(sell_price),
        stock: Number(stock),
        category_id: Number(category_id),
        image: `uploads/${req.file.filename}`,
      },
      include: { category: true },
    });

    res.status(201).send({
      meta: {
        success: true,
        message: "Product successfully created",
      },
      data: product,
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

module.exports = { index, create };
