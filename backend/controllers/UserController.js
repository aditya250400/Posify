const express = require("express");
const prisma = require("../prisma/client");

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

module.exports = {
  findUsers,
};
