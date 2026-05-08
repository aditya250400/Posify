const express = require("express");
const prisma = require("../prisma/client");
const { subDays, format } = require("date-fns");

const getDashboardData = async (req, res) => {
  try {
    const today = new Date();
    const week = subDays(today, 7);

    // get data sales in last 7 days
    const chartSalesWeek = await prisma.transaction.groupBy({
      by: ["created_at"],
      _sum: { grand_total: true },
      where: {
        created_at: {
          gte: week,
        },
      },
    });

    // initiate array for save date and total Sale
    let sales_date = [];
    let sales_total = [];

    // for calculate total sale in last 7 days
    let sumSalesWeek = 0;

    // processing sale data

    if (chartSalesWeek.length > 0) {
      chartSalesWeek.forEach((result) => {
        sales_date.push(format(new Date(result.created_at), "yyy-MM-dd"));

        const total = parseInt(result._sum.grand_total || 0);
        sales_total.push(total);

        sumSalesWeek += total;
      });
    } else {
      sales_date.push("");
      sales_total.push(0);
    }

    // get profits in last 7 daysc
    const chartProfitsWeek = await prisma.profit.groupBy({
      by: ["created_at"],
      _sum: {
        total: true,
      },
      where: {
        created_at: { gte: week },
      },
    });

    // initiate array for saveing date and total profit
    let profits_date = [];
    let profits_total = [];
    let sumProfitsWeek = 0;

    if (chartProfitsWeek.length > 0) {
      chartProfitsWeek.forEach((result) => {
        profits_date.push(format(new Date(result.created_at), "yyyy-MM-dd"));
        const total = parseInt(result._sum.total || 0);
        profits_total.push(total);
        sumProfitsWeek += total;
      });
    } else {
      profits_date.push("");
      profits_total.push(0);
    }

    // calculate total transactions today
    const countSalesToday = await prisma.transaction.count({
      where: {
        created_at: {
          gte: new Date(`${today.toISOString().split("T")[0]}T00:00:00.000Z`), // Mulai dari jam 00:00 hari ini
          lte: new Date(`${today.toISOString().split("T")[0]}T23:59:59.999Z`), // Sampai jam 23:59 hari ini
        },
      },
    });
    //calculate sales today
    const sumSalesToday = await prisma.transaction.aggregate({
      _sum: {
        grand_total: true, // Menjumlahkan total grand_total
      },
      where: {
        created_at: {
          gte: new Date(`${today.toISOString().split("T")[0]}T00:00:00.000Z`),
          lte: new Date(`${today.toISOString().split("T")[0]}T23:59:59.999Z`),
        },
      },
    });

    // calculate total profits today
    const sumProfitsToday = await prisma.profit.aggregate({
      _sum: { total: true },
      where: {
        created_at: {
          gte: new Date(`${today.toISOString().split("T")[0]}T00:00:00.000Z`),
          lte: new Date(`${today.toISOString().split("T")[0]}T23:59:59.999Z`),
        },
      },
    });

    // get product's stock less than equal 10
    const productsLimitStock = await prisma.product.findMany({
      where: {
        stock: { lte: 10 },
      },
      include: { category: true },
    });

    // get the best 5 products
    const chartBestProducts = await prisma.transactionDetail.groupBy({
      by: ["product_id"],
      _sum: { qty: true },
      orderBy: { _sum: { qty: "desc" } },
      take: 5,
    });

    // get the best id products
    const productIds = chartBestProducts.map((item) => item.product_id);

    // get product by id above
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
      select: { id: true, title: true },
    });

    const bestSellingProducts = chartBestProducts.map((item) => {
      const product = products.find((p) => p.id === item.product_id);
      return {
        title: product?.title || "Unknown Product",
        total: item._sum.qty || 0,
      };
    });

    res.status(200).json({
      meta: {
        success: true,
        message: "Dashboard data successfully retrieved",
      },
      data: {
        count_sales_today: countSalesToday,
        sum_sales_today: sumSalesToday._sum.grand_total || 0,
        sum_sales_week: sumSalesWeek || 0,
        sum_profits_today: sumProfitsToday._sum.total || 0,
        sum_profits_week: sumProfitsWeek || 0,
        sales: {
          sales_date,
          sales_total,
        },
        profits: {
          profits_date,
          profits_total,
        },
        products_limit_stock: productsLimitStock,
        best_selling_products: bestSellingProducts,
      },
    });
  } catch (e) {
    console.log(e);

    res.status(500).send({
      meta: {
        success: false,
        message: "Internal Server Error",
      },
      errors: e.message,
    });
  }
};

module.exports = { getDashboardData };
