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

const findUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(404).send({
        meta: {
          success: false,
          message: `User with id ${id} not found`,
        },
      });
    }

    res.status(200).send({
      meta: {
        success: true,
        message: `List data user: ${user.name} with id ${user.id}`,
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

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    let newUserData = {
      name: req.body.name,
      email: req.body.email,
      updated_at: new Date(),
    };

    if (req.body.password !== "") {
      if (req.body.password != req.body.confirmPassword) {
        return res.status(422).json({
          meta: {
            success: false,
            message: "Password and Confirmation Password is different!",
          },
        });
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      newUserData.password = hashedPassword;
    }

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: newUserData,
      select: {
        id: true,
        name: true,
        email: true,
        created_at: true,
        updated_at: true,
      },
    });

    res.status(200).send({
      meta: {
        success: true,
        message: "User successfully updated",
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
  findUserById,
  updateUser,
};
