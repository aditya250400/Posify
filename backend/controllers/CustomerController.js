const express = require("express");
const prisma = require("../prisma/client");
const { validationResult } = require("express-validator");

const index = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const customers = await prisma.customer.findMany({
      where: {
        name: { contains: search },
      },
      select: {
        id: true,
        name: true,
        no_telp: true,
        address: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: { id: "desc" },
      skip: skip,
      take: limit,
    });

    const totalCustomers = await prisma.customer.count({
      where: {
        name: {
          contains: search,
        },
      },
    });

    const totalPages = Math.ceil(totalCustomers / limit);

    res.status(200).send({
      meta: {
        success: true,
        message: "List customers data",
      },
      data: customers,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalCustomers: totalCustomers,
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
    const { name, no_telp, address } = req.body;

    const customer = await prisma.customer.create({
      data: {
        name,
        no_telp,
        address,
      },
    });

    res.status(201).send({
      meta: {
        success: true,
        message: "Customer successfully created",
      },
      data: customer,
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
  try {
    const { id } = req.params;

    const customer = await prisma.customer.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        name: true,
        no_telp: true,
        address: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!customer) {
      return res.status(404).send({
        meta: {
          success: false,
          message: `Customer with id ${id} not found`,
        },
      });
    }

    res.status(200).send({
      meta: {
        success: true,
        message: `Customer ${customer.name} with id ${id} successfully retrieved `,
      },
      data: customer,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
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

    const customer = await prisma.customer.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!customer) {
      return res.status(404).send({
        meta: {
          success: false,
          message: `Customer with id ${id} not found`,
        },
      });
    }

    const newDataCustomer = {
      name: req.body.name,
      no_telp: req.body.no_telp,
      address: req.body.address,
      updated_at: new Date(),
    };

    const updateCustomer = await prisma.customer.update({
      where: {
        id: Number(id),
      },
      data: newDataCustomer,
    });

    res.status(200).send({
      meta: {
        success: true,
        message: "customer sucessfully updated",
      },
      data: updateCustomer,
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

    const customer = await prisma.customer.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!customer) {
      return res.status(404).send({
        meta: {
          success: false,
          message: `Customer with id ${id} not found`,
        },
      });
    }

    await prisma.customer.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).send({
      meta: {
        success: true,
        message: `Customer ${customer.name} sucessfully deleted!`,
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

const allCustomers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: {
        id: "desc",
      },
    });

    const formattedCustomers = customers.map((customer) => ({
      value: customer.id,
      label: customer.name,
    }));

    res.status(200).send({
      meta: {
        success: true,
        message: "List All customers",
      },
      data: formattedCustomers,
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
  allCustomers,
};
