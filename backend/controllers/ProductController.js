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
        perPage: limit,
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

const show = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        barcode: true,
        title: true,
        description: true,
        buy_price: true,
        sell_price: true,
        stock: true,
        image: true,
        category_id: true,
        created_at: true,
        updated_at: true,
        category: {
          select: {
            name: true,
            description: true,
            image: true,
            created_at: true,
            updated_at: true,
          },
        },
      },
    });

    if (!product) {
      return res.status(404).send({
        meta: {
          success: false,
          message: `Product with id ${id} not found`,
        },
      });
    }

    res.status(200).send({
      meta: {
        success: true,
        message: `Product ${product.title} with id ${id} successfully retrieved `,
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

const update = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!product) {
      return res.status(404).send({
        meta: {
          success: false,
          message: `Product with id ${id} not found`,
        },
      });
    }

    const newDataProduct = {
      barcode: req.body.barcode,
      title: req.body.title,
      description: req.body.description,
      buy_price: parseInt(req.body.buy_price),
      sell_price: parseInt(req.body.sell_price),
      stock: parseInt(req.body.stock),
      category_id: parseInt(req.body.category_id),
      updated_at: new Date(),
    };

    if (req.file) {
      newDataProduct.image = `uploads/${req.file.filename}`;

      if (product.image) {
        fs.unlinkSync(product.image);
      }
    }

    const updateProduct = await prisma.product.update({
      where: {
        id: Number(id),
      },
      data: newDataProduct,
      include: { category: true },
    });

    res.status(200).send({
      meta: {
        success: true,
        message: "Product sucessfully updated",
      },
      data: updateProduct,
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

const destroy = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!product) {
      return res.status(404).send({
        meta: {
          success: false,
          message: `Product with id ${id} not found`,
        },
      });
    }

    await prisma.product.delete({
      where: {
        id: Number(id),
      },
    });

    if (product.image) {
      const imagePath = product.image;
      const fileName = imagePath.substring(imagePath.lastIndexOf("/") + 1);
      const filePath = `uploads/${fileName}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(200).send({
      meta: {
        success: true,
        message: `Product ${product.title} sucessfully deleted!`,
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

const productByCategoryId = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const products = await prisma.product.findMany({
      where: {
        category_id: Number(id),
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
            description: true,
            image: true,
            created_at: true,
            updated_at: true,
          },
        },
      },
      orderBy: { id: "desc" },
      skip: skip,
      take: limit,
    });

    if (products.length == 0) {
      return res.status(404).send({
        meta: {
          success: false,
          message: `Product with category id ${id} not found`,
        },
      });
    }

    const totalProducts = await prisma.product.count({
      where: {
        category_id: Number(id),
      },
    });

    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).send({
      meta: {
        success: true,
        message: "List products data by category id",
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

const productByBarcode = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const products = await prisma.product.findMany({
      where: {
        barcode: req.body.barcode,
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
            description: true,
            image: true,
            created_at: true,
            updated_at: true,
          },
        },
      },
      orderBy: { id: "desc" },
      skip: skip,
      take: limit,
    });

    if (products.length == 0) {
      return res.status(404).send({
        meta: {
          success: false,
          message: `Product with barcode ${req.body.barcode} not found`,
        },
      });
    }

    const totalProducts = await prisma.product.count({
      where: {
        barcode: req.body.barcode,
      },
    });

    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).send({
      meta: {
        success: true,
        message: "List products data by barcode",
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

module.exports = {
  index,
  create,
  show,
  update,
  destroy,
  productByCategoryId,
  productByBarcode,
};
