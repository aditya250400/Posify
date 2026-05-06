const express = require("express");
const prisma = require("../prisma/client");
const excelJS = require("exceljs");
const { moneyFormat } = require("../utils/moneyFormat");

const filterProfit = async (req, res) => {
  try {
    const startDate = new Date(req.query.start_date);
    const endDate = new Date(req.query.end_date);
    endDate.setHours(23, 59, 59, 999);

    const profits = await prisma.profit.findMany({
      where: {
        created_at: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        transaction: {
          select: {
            id: true,
            invoice: true,
            grand_total: true,
            created_at: true,
          },
        },
      },
    });

    const total = await prisma.profit.aggregate({
      _sum: {
        total: true,
      },
      where: {
        created_at: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    res.status(200).json({
      meta: {
        success: true,
        message: `Profit report from ${req.query.start_date} to ${req.query.end_date} Successfully retrieved`,
      },
      data: {
        profits: profits,
        total: total._sum.total || 0,
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

const exportProfit = async (req, res) => {
  try {
    const startDate = new Date(req.query.start_date);
    const endDate = new Date(req.query.end_date);
    endDate.setHours(23, 59, 59, 999);

    const profits = await prisma.profit.findMany({
      where: {
        created_at: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        transaction: {
          select: {
            id: true,
            invoice: true,
            grand_total: true,
            created_at: true,
          },
        },
      },
    });

    const total = await prisma.profit.aggregate({
      _sum: {
        total: true,
      },
      where: {
        created_at: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Profits");

    worksheet.columns = [
      { header: "DATE", key: "created_at", width: 30 },
      { header: "INVOICE", key: "invoice", width: 30 },
      { header: "TOTAL", key: "total", width: 40 },
    ];

    worksheet.columns.forEach((col) => {
      col.style = {
        font: { bold: true },
        alignment: { horizontal: "center" },
        border: {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        },
      };
    });

    profits.forEach((profit) => {
      worksheet.addRow({
        created_at: profit.created_at,
        invoice: profit.transaction.invoice,
        total: moneyFormat(profit.total),
      });
    });

    // total row
    const totalRow = worksheet.addRow({
      created_at: "",
      invoice: "TOTAL",
      total: `Rp ${moneyFormat(total._sum.total)}`,
    });

    totalRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "right" };
      if (colNumber === 5) {
        cell.alignment = { horizontal: "center" };
      }
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    const fileName = `profits-${req.query.start_date}_to_${req.query.end_date}.xlsx`;

    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    workbook.xlsx.write(res);
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

module.exports = { filterProfit, exportProfit };
