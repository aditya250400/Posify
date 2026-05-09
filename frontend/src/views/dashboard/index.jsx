import LayoutAdmin from "../../layouts/admin";
import { useState, useEffect } from "react";
import Api from "../../services/api";
import moneyFormat from "../../utils/moneyFormat";
import ApexCharts from "apexcharts";
import { useLoading } from "../../states/loading";
import generateRandomColors from "../../utils/generateRandomColors";

export default function Dashboard() {
  // loading states
  const { loading, setLoading } = useLoading();
  // state sales
  const [countSalesToday, setCountSalesToday] = useState(0);
  const [sumSalesToday, setSumSalesToday] = useState(0);
  const [sumSalesWeek, setSumSalesWeek] = useState(0);
  const [salesDate, setSalesDate] = useState([]);
  const [salesTotal, setSalesTotal] = useState([]);

  //state profits
  const [sumProfitsToday, setSumProfitsToday] = useState(0);
  const [sumProfitsWeek, setSumProfitsWeek] = useState(0);
  const [profitsDate, setProfitsDate] = useState([]);
  const [profitsTotal, setProfitsTotal] = useState([]);

  //state productsBestSelling
  const [productsBestSelling, setProductsBestSelling] = useState([]);

  // state product limit stock
  const [productsLimitStock, setProductsLimitStock] = useState([]);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await Api.get("/dashboard");

      //   set data sales
      setCountSalesToday(response.data.data.count_sales_today);
      setSumSalesToday(response.data.data.sum_sales_today);
      setSumSalesWeek(response.data.data.sum_sales_week);
      setSalesDate(response.data.data.sales.sales_date);
      setSalesTotal(response.data.data.sales.sales_total);

      //   set data sales
      setSumProfitsToday(response.data.data.sum_profits_today);
      setSumProfitsWeek(response.data.data.sum_profits_week);
      setProfitsDate(response.data.data.profits.profits_date);
      setProfitsTotal(response.data.data.profits.profits_total);

      //assign response data to state "productsBestSelling"
      setProductsBestSelling(response.data.data.best_selling_products);

      //for state product limit stock
      setProductsLimitStock(response.data.data.products_limit_stock);
    } catch (e) {
      alert("There was an error, check console");
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  //   to initialize a chart
  const initializeChart = (elementId, chartOptions) => {
    const chart = new ApexCharts(
      document.getElementById(elementId),
      chartOptions,
    );
    chart.render();

    return chart;
  };

  //   chart options
  const commonChartOptions = {
    fontFamily: "inherit",
    animations: { enabled: false },
    dataLabels: { enabled: false },
    grid: { strokeDashArray: 4 },
    tooltip: { theme: "dark" },
    xaxis: {
      labels: { padding: 0 },
      tooltip: { enabled: false },
      axisBorder: { show: false },
      type: "datetime",
    },
    yaxis: { labels: { padding: 4 } },
    colors: ["#206bc4"],
    legend: { show: false },
  };

  //   useEffect fetchData
  useEffect(() => {
    fetchData();

    return () => {
      setCountSalesToday(0);
      setSumSalesToday(0);
      setSumSalesWeek(0);
      setSalesDate([]);
      setSalesTotal([]);
    };
  }, []);

  // Effect to initialize charts when data changes
  useEffect(() => {
    const salesChart = initializeChart("chart-sales", {
      ...commonChartOptions,
      chart: { type: "area", height: 40.0, sparkline: { enabled: true } },
      fill: { opacity: 0.16, type: "solid" },
      stroke: { width: 2, lineCap: "round", curve: "smooth" },
      series: [
        {
          name: "Sales",
          data: salesTotal,
        },
      ],
      labels: salesDate,
    });

    const profitsChart = initializeChart("chart-profits", {
      ...commonChartOptions,
      chart: { type: "bar", height: 40.0, sparkline: { enabled: true } },
      plotOptions: { bar: { columnWidth: "50%" } },
      series: [
        {
          name: "Profits",
          data: profitsTotal,
        },
      ],
      labels: profitsDate,
    });

    const series = productsBestSelling.map((product) => product.total);
    const labels = productsBestSelling.map((product) => product.title);

    const bestProductsChart = initializeChart("chart-best-products", {
      chart: {
        type: "pie",
        height: 350, // Adjust height as needed
      },
      series: series,
      labels: labels,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
      colors: generateRandomColors(productsBestSelling.length), // Customize colors as needed
      legend: {
        position: "bottom",
      },
      tooltip: {
        y: {
          formatter: (val) => `${val}`,
        },
      },
    });

    return () => {
      salesChart.destroy();
      profitsChart.destroy();
      bestProductsChart.destroy();
    };
  }, [salesDate, salesTotal, profitsDate, profitsTotal, productsBestSelling]);

  return (
    <LayoutAdmin>
      <div className="page-header ">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <div className="page-title">Dashboard</div>
              <h2 className="page-pretitle">Page</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          <div className="row row-deck row-cards">
            <div className="col-sm-6 col-lg-3">
              <div className="card rounded card-link card-link-pop">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="subheader">Sales Today</div>
                  </div>
                  <div className="h1 mb-2">{countSalesToday}</div>
                  <hr className="mb-2 mt-1" />
                  <div className="h1 mb-0 me-2">
                    {moneyFormat(sumSalesToday)}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="card rounded card-link card-link-pop">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="subheader">Profits Today</div>
                  </div>
                  <div className="h1 mb-0 me-2 mt-4">
                    {moneyFormat(sumProfitsToday)}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="card rounded card-link card-link-pop">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="subheader">SALES</div>
                    <div className="ms-auto lh-1">
                      <span className="text-end active" href="#">
                        Last 7 days
                      </span>
                    </div>
                  </div>
                  <div className="d-flex align-items-baseline">
                    <div className="h1 mb-0 me-2">
                      {moneyFormat(sumSalesWeek)}
                    </div>
                  </div>
                </div>
                <div id="chart-sales" className="chart-sm"></div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="card rounded card-link card-link-pop">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="subheader">PROFITS</div>
                    <div className="ms-auto ">
                      <span className="text-end active" href="#">
                        Last 7 days
                      </span>
                    </div>
                  </div>
                  <div className="d-flex align-items-baseline">
                    <div className="h1 mb-0 me-2">
                      {moneyFormat(sumProfitsWeek)}
                    </div>
                  </div>
                </div>
                <div id="chart-profits" className="chart-sm"></div>
              </div>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-md-8 mb-5">
              <div className="card rounded">
                <div className="card header p-3">
                  <h3 className="mb-0">PRODUCTS BEST SELLING</h3>
                </div>
                <div className="card-body">
                  <div id="chart-best-products"></div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card rounded">
                <div className="'card-header p-3">
                  <h3 className="mb-0">PRODUCTS LIMIT STOCK</h3>
                </div>
                <div className="card-body scrollable-card-body">
                  <div className="row">
                    {productsLimitStock.length > 0
                      ? productsLimitStock.map((product) => (
                          <div className="col-12 mb-2" key={product.id}>
                            <div className="card rounded">
                              <div className="card-body d-flex align-items-center">
                                <img
                                  src={`${import.meta.env.VITE_APP_IMAGEBASEURL}/${product.image}`}
                                  alt={product.title}
                                  width={50}
                                  height={50}
                                  className="me-3"
                                />
                                <div className="flex-fill">
                                  <h4 className="mb-0">{product.title}</h4>
                                  <hr className="mb-1 mt-1" />
                                  <p className="text-danger mb-0">
                                    Stock: {product.stock}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      : "Tidak ada data"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
}
