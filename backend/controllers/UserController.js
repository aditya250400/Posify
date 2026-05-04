const express = require("express");
const prisma = require("../prisma/client");
const bcrypt = require("bcryptjs");

const findUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const users = await prisma.user.findMany({
      where: {
        name: { contains: search },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: { id: "desc" },
    });

    const totalUsers = await prisma.user.count({
      where: { name: { contains: "search" } },
    });

    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).send({
      meta: {
        success: true,
        message: "List users data",
      },
      data: users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
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
const createUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (password != confirmPassword) {
      return res.status(422).json({
        meta: {
          success: false,
          message: "Password and Confirmation Password is different!",
        },
      });
    }

    const user = await prisma.user.create({
      data: { name, email, password: await bcrypt.hash(password, 10) },
      select: {
        id: true,
        name: true,
        email: true,
        created_at: true,
        updated_at: true,
      },
    });

    res.status(201).send({
      meta: {
        success: true,
        message: "User successfully created!",
      },
      data: user,
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
  findUsers,
  createUser,
};
