const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma/client");

const login = async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      return res.status(402).json({
        success: false,
        message: "Invalid Credential",
      });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    );

    if (!validPassword) {
      return res.status(402).json({
        success: false,
        message: "Invalid Credential",
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    const { password, ...userWithoutPassword } = user;

    res.status(200).send({
      meta: {
        success: true,
        message: "Login Successfully",
      },
      data: {
        user: userWithoutPassword,
        token: token,
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

module.exports = { login };
