import LayoutAdmin from "../../layouts/admin";
import { useState, useEffect } from "react";
import Api from "../../services/api";
import moneyFormat from "../../utils/moneyFormat";
import ApexCharts from "apexcharts";
import { useLoading } from "../../states/loading";

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

    return () => {
      salesChart.destroy();
      profitsChart.destroy();
    };
  }, [salesDate, salesTotal, profitsDate, profitsTotal]);

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
                    <div className="ms-auto ">
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
        </div>
      </div>
    </LayoutAdmin>
  );
}
