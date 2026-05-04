const express = require("express");
const prisma = require("../prisma/client");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const fs = require("fs");

const index = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const categories = await prisma.category.findMany({
      where: {
        name: { contains: search },
      },
      select: {
        id: true,
        name: true,
        image: true,
        description: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: { id: "desc" },
      skip: skip,
      take: limit,
    });

    const totalCategories = await prisma.category.count({
      where: {
        name: {
          contains: search,
        },
      },
    });

    const totalPages = Math.ceil(totalCategories / limit);

    res.status(200).send({
      meta: {
        success: true,
        message: "List categories data",
      },
      data: categories,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalCategories: totalCategories,
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
    const { name, description } = req.body;

    const category = await prisma.category.create({
      data: {
        name,
        description,
        image: `uploads/${req.file.filename}`,
      },
    });

    res.status(201).send({
      meta: {
        success: true,
        message: "Category successfully created",
      },
      data: category,
    });

    console.log(req.file.path);
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
    const category = await prisma.category.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        name: true,
        image: true,
        description: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!category) {
      return res.status(404).send({
        meta: {
          success: false,
          message: `Category with id ${id} not found`,
        },
      });
    }

    res.status(200).send({
      meta: {
        success: true,
        message: `Category ${category.name} with id ${id} successfully retrieved `,
      },
      data: category,
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

    const category = await prisma.category.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!category) {
      res.status(404).send({
        meta: {
          success: false,
          message: `Category with id ${id} not found`,
        },
      });
    }

    const newDataCategory = {
      name: req.body.name,
      description: req.body.description,
      updated_at: new Date(),
    };

    if (req.file) {
      newDataCategory.image = `uploads/${req.file.filename}`;

      if (category.image) {
        fs.unlinkSync(category.image);
      }
    }

    await prisma.category.update({
      where: {
        id: Number(id),
      },
      data: newDataCategory,
    });

    res.status(200).send({
      meta: {
        success: true,
        message: "Category sucessfully updated",
      },
      data: category,
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

module.exports = { index, create, show, update };
