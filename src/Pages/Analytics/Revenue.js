import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Page.css";
import "./Analytics.css";
import { Url } from "../../Services/Api";
import DataTable from "react-data-table-component";
import AnalyticsProductCard from "../../Components/AnalyticsComponents/OverviewAnalytics/AnalyticsProductCard";
import ShimmerLoader from "../../Components/UI-Controls/Loader/ShimmerLoader";
import {
  FaChartLine,
  FaHandHoldingUsd,
  FaReceipt,
  FaTruck,
  FaUndoAlt,
  FaTicketAlt,
} from "react-icons/fa";
import ProductVisualize from "../../Components/AnalyticsComponents/OverviewAnalytics/ProductVisualization";
import Pagination from "../../Components/UI-Controls/Pagination/PaginationRashid";
import { DatePicker } from "antd";

const RevenueAnalytics = () => {
  const { RangePicker } = DatePicker;
  const rowsPerPage = 7;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [salesRevenue, setSalesRevenue] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState("grossSale");
  const [metricName, setMetricName] = useState("Gross Sale");
  const [componentName, setComponentName] = useState("Sales Revenue Analytics");
  const [dateRange, setDateRange] = useState(null);
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    totalItemsSold: 0,
    totalNetSales: 0,
    totalGrossSales: 0,
    totalTaxes: 0,
    totalShipping: 0,
    totalReturns: 0,
    totalCoupons: 0,
  });
  const [chartData, setChartData] = useState({
    seriesData: [],
    categories: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  const handleDateRange = (dates) => {
    setDateRange(dates);
    if (dates && dates.length === 2) {
      const startDate = dates[0].format("YYYY-MM-DD");
      const endDate = dates[1].format("YYYY-MM-DD");
      fetchRevenueData(startDate, endDate);
    }
  };

  const fetchRevenueData = async (startDate, endDate) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${Url}/api/v1/analytics/revenue-analytics`,
        {
          params: { startDate, endDate },
        }
      );

      if (!response.data) throw new Error("Invalid API response format");

      const result = response.data;

      if (!Array.isArray(result.sale_chart)) {
        throw new Error("Invalid or missing sale_chart data");
      }

      const sortedSaleChart = [...result.sale_chart].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      setData(result);

      const revenueArray = sortedSaleChart.filter(
        (item) => item && typeof item === "object"
      );

      const metrics = revenueArray.reduce(
        (acc, revenue) => ({
          totalOrders: acc.totalOrders + (revenue.totalOrder || 0),
          totalItemsSold: acc.totalItemsSold + (revenue.itemSold || 0),
          totalNetSales: acc.totalNetSales + (revenue.netSale || 0),
          totalGrossSales: acc.totalGrossSales + (revenue.grossSale || 0),
          totalReturns: acc.totalReturns + (revenue.returns || 0),
          totalTaxes: acc.totalTaxes + (revenue.taxes || 0),
          totalShipping: acc.totalShipping + (revenue.shipping || 0),
          totalCoupons: acc.totalCoupons + (revenue.coupons || 0),
        }),
        {
          totalOrders: 0,
          totalItemsSold: 0,
          totalNetSales: 0,
          totalGrossSales: 0,
          totalReturns: 0,
          totalTaxes: 0,
          totalShipping: 0,
          totalCoupons: 0,
        }
      );

      setMetrics(metrics);
      setSalesRevenue(revenueArray);

      /* --- For Date Wise Handling of Chart Data --- */

      const aggregatedRevenueData = revenueArray.reduce((acc, entry) => {
        const dateKey = entry.date; // Keep it date-wise (YYYY-MM-DD)

        acc[dateKey] = (acc[dateKey] || 0) + Number(entry[selectedMetric] || 0);
        return acc;
      }, {});

      const sortedDates = Object.keys(aggregatedRevenueData).sort(
        (a, b) => new Date(a) - new Date(b)
      );

      setChartData({
        seriesData: sortedDates.map((date) => aggregatedRevenueData[date]),
        labels: sortedDates.map((date) =>
          new Date(date).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
          })
        ),
      });
    } catch (error) {
      setError(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMetric) {
      fetchRevenueData();
    }
  }, [selectedMetric]);

  /* --- Click Handlers for Cards --- */
  const handleMetricChange = (metric, name) => {
    setSelectedMetric(metric);
    setMetricName(name);
    setComponentName("Sales Revenue Analytics");
  };

  /* --- Function for representing numbers & currency in standard way --- */
  const formatNumber = (num) => {
    if (!num) return "0";
    const formattedNum = parseFloat(num).toFixed(2);
    return new Intl.NumberFormat("en-US").format(formattedNum);
  };

  const formatCurrency = (amount) => {
    if (!amount) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  /* --- Overview Header Cards Handling --- */
  const ProductsAnalyticsCardData = [
    {
      title: "Gross Sale",
      duration: "Last 7 Days",
      value: loading ? (
        <ShimmerLoader width="100px" height="22.5px" borderRadius="20px" />
      ) : (
        formatCurrency(data?.grossSale || 0)
      ),
      growth: 20.05,
      icon: <FaChartLine />,
      onClick: () => handleMetricChange("grossSale", "Gross Sale"),
    },
    {
      title: "Net Sales",
      duration: "Last 7 Days",
      value: loading ? (
        <ShimmerLoader width="100px" height="22.5px" borderRadius="20px" />
      ) : (
        formatCurrency(data?.netSale || 0)
      ),
      growth: 15.78,
      icon: <FaHandHoldingUsd />,
      onClick: () => handleMetricChange("netSale", "Net Sale"),
    },
    {
      title: "Taxes",
      duration: "Last 7 Days",
      value: loading ? (
        <ShimmerLoader width="100px" height="22.5px" borderRadius="20px" />
      ) : (
        formatCurrency(data?.taxes || 0)
      ),
      growth: 25.92,
      icon: <FaReceipt />,
      onClick: () => handleMetricChange("taxes", "Taxes"),
    },
    {
      title: "Shipping",
      duration: "Last 7 Days",
      value: loading ? (
        <ShimmerLoader width="100px" height="22.5px" borderRadius="20px" />
      ) : (
        formatCurrency(data?.shipping || 0)
      ),
      growth: 20.05,
      icon: <FaTruck />,
      onClick: () => handleMetricChange("shipping", "Shipping"),
    },
    {
      title: "Returns",
      duration: "Last 7 Days",
      value: loading ? (
        <ShimmerLoader width="100px" height="22.5px" borderRadius="20px" />
      ) : (
        formatNumber(data?.returns || 0)
      ),
      growth: 15.78,
      icon: <FaUndoAlt />,
      onClick: () => handleMetricChange("returns", "Returns"),
    },
    {
      title: "Coupons",
      duration: "Last 7 Days",
      value: loading ? (
        <ShimmerLoader width="100px" height="22.5px" borderRadius="20px" />
      ) : (
        formatNumber(data?.coupons || 0)
      ),
      growth: 25.92,
      icon: <FaTicketAlt />,
      onClick: () => handleMetricChange("coupons", "Coupons"),
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        height: "52px",
        background: "transparent",
        opacity: "1",
        textAlign: "center",
        justifyContent: "center",
        border: "none",
        color: "var(--text-color-1)",
        fontFamily: "var(--font-family)",
        fontWeight: "var(--font-weight-medium)",
        fontSize: "var(--font-size-medium)",
      },
    },
    cells: {
      style: {
        height: "66px",
        justifyContent: "center",
        textAlign: "center",
        background: "transparent",
        borderTop: "var(--standered-border)",
        borderRight: "none",
        color: "var(--text-color-1)",
        fontFamily: "var(--font-family)",
        fontWeight: "var(--font-weight-regular)",
        fontSize: "var(--font-size-small)",
      },
    },
  };

  const RevenueDataColumns = [
    {
      name: "Date",
      selector: (row) => row.date,
      width: "150px",
      cell: (row) =>
        loading ? (
          <ShimmerLoader width="110px" height="22.5px" borderRadius="20px" />
        ) : row.date ? (
          new Date(row.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        ) : (
          "N/A"
        ),
    },
    {
      name: "Orders",
      selector: (row) =>
        loading ? (
          <ShimmerLoader width="65px" height="22.5px" borderRadius="20px" />
        ) : (
          row.totalOrder || "N/A"
        ),
      width: "100px",
    },
    {
      name: "Gross Sales",
      selector: (row) => row.grossSale,
      cell: (row) =>
        loading ? (
          <ShimmerLoader width="90px" height="22.5px" borderRadius="20px" />
        ) : row.grossSale !== undefined && row.grossSale !== null ? (
          `$${formatNumber(row.grossSale)}`
        ) : (
          "N/A"
        ),
      width: "115px",
    },
    {
      name: "Returns",
      selector: (row) => row.returns,
      cell: (row) =>
        loading ? (
          <ShimmerLoader width="65px" height="22.5px" borderRadius="20px" />
        ) : row.returns !== undefined && row.returns !== null ? (
          `${formatNumber(row.returns)}`
        ) : (
          "N/A"
        ),
      width: "100px",
    },
    {
      name: "Coupons",
      selector: (row) => row.coupons,
      cell: (row) =>
        loading ? (
          <ShimmerLoader width="65px" height="22.5px" borderRadius="20px" />
        ) : row.coupons !== undefined && row.coupons !== null ? (
          `${formatNumber(row.coupons)}`
        ) : (
          "N/A"
        ),
      width: "100px",
    },
    {
      name: "Net Sales",
      selector: (row) => row.netSale,
      width: "110px",
      cell: (row) =>
        loading ? (
          <ShimmerLoader width="90px" height="22.5px" borderRadius="20px" />
        ) : row.netSale !== undefined && row.netSale !== null ? (
          `$${formatNumber(row.netSale)}`
        ) : (
          "N/A"
        ),
    },
    {
      name: "Taxes",
      selector: (row) => row.taxes,
      width: "90px",
      cell: (row) =>
        loading ? (
          <ShimmerLoader width="90px" height="22.5px" borderRadius="20px" />
        ) : row.taxes !== undefined && row.taxes !== null ? (
          `$${formatNumber(row.taxes)}`
        ) : (
          "N/A"
        ),
    },
    {
      name: "Shipping",
      selector: (row) => row.shipping,
      width: "100px",
      cell: (row) =>
        loading ? (
          <ShimmerLoader width="90px" height="22.5px" borderRadius="20px" />
        ) : row.shipping !== undefined && row.shipping !== null ? (
          `$${formatNumber(row.shipping)}`
        ) : (
          "N/A"
        ),
    },
  ];

  const totalPages = Math.ceil(
    (Array.isArray(salesRevenue) ? salesRevenue.length : 0) / rowsPerPage
  );

  const paginatedData = Array.isArray(salesRevenue)
    ? salesRevenue.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
      )
    : [];

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const placeholderRows = Array(7).fill({ uid: "", name: "", image: "" });

  const displayedData = loading ? placeholderRows : paginatedData;

  const disabledDate = (current) => {
    return current && current > new Date();
  };

  return (
    <div className="ProductsAnalytics-Layout">
      {/* --- Title & Filteration Row --- */}
      <div className="ProductsAnalytics-Row01">
        <div className="RevenueAnalytics-1stRow">
          <div className="RevenueAnalytics-Title">Revenue</div>
          <div className="RevenueAnalytics-Filter">
            <RangePicker
              format="YYYY-MM-DD"
              onChange={handleDateRange}
              value={dateRange}
              style={{ width: "100%" }}
              disabledDate={disabledDate}
            />
          </div>
        </div>
      </div>

      {/*--- Revene Analytics Card Section ---*/}
      <div className="RevenueAnalytics-Row01">
        {/* --- Products Header Cards Section --- */}
        {Array.isArray(ProductsAnalyticsCardData) &&
        ProductsAnalyticsCardData.length > 0 ? (
          ProductsAnalyticsCardData.map((item, index) => (
            <div
              key={index}
              className="Revenue-Row01-Card"
              onClick={item.onClick}
            >
              <AnalyticsProductCard
                title={item.title}
                duration={item.duration}
                value={item.value}
                growth={item.growth}
                icon={item.icon}
              />
            </div>
          ))
        ) : (
          <p>Loading data...</p>
        )}
      </div>

      {/*--- Visualization Chart  Section ---*/}
      <div className="ProductsAnalytics-Row01">
        <ProductVisualize
          SalesData={{
            labels: chartData?.labels || [],
            seriesData: Array.isArray(chartData?.seriesData)
              ? chartData.seriesData
              : [],
          }}
          componentName={componentName}
          metricName={metricName}
          loading={loading}
        />
      </div>

      {/* --- Revenue API Data Table Section --- */}
      <div className="ProductsAnalytics-Row01">
        <div className="Orders-Table-Data">
          <div>
            <DataTable
              columns={RevenueDataColumns}
              data={displayedData}
              customStyles={customStyles}
            />
            <Pagination
              activePageIndex={currentPage}
              totalPages={totalPages}
              onPrevPage={handlePrevPage}
              onNextPage={handleNextPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      {/* --- Data Table Calculation Row --- */}
      <div className="ProductsAnalytics-Row01">
        <div className="RevenueAnalytics-LastRow">
          <div className="LastRow-Revenue-SaleChart">
            <div className="LastRow-RevenueValue">
              {loading ? (
                <ShimmerLoader
                  width="30px"
                  height="22.5px"
                />
              ) : (
                formatNumber(metrics.totalItemsSold)
              )}
            </div>
            <span>Items Sold</span>
          </div>
          <div className="LastRow-Revenue-SaleChart">
            <div className="LastRow-RevenueValue">
              {loading ? (
                <ShimmerLoader
                  width="50px"
                  height="22.5px"
                />
              ) : (
                formatNumber(metrics.totalOrders)
              )}
            </div>
            <span>Orders</span>
          </div>
          <div className="LastRow-Revenue-SaleChart-Sales">
            <div className="LastRow-RevenueValue">
              {loading ? (
                <ShimmerLoader
                  width="50px"
                  height="22.5px"
                />
              ) : (
                formatCurrency(metrics.totalGrossSales)
              )}
            </div>
            <span>Gross Sales</span>
          </div>
          <div className="LastRow-Revenue-SaleChart-Sales">
            <div className="LastRow-RevenueValue">
              {loading ? (
                <ShimmerLoader
                  width="50px"
                  height="22.5px"
                />
              ) : (
                formatCurrency(metrics.totalNetSales)
              )}
            </div>
            <span>Net Sales</span>
          </div>
          <div className="LastRow-Revenue-SaleChart">
            <div className="LastRow-RevenueValue">
              {loading ? (
                <ShimmerLoader
                  width="50px"
                  height="22.5px"
                />
              ) : (
                formatNumber(metrics.totalTaxes)
              )}
            </div>
            <span>Taxes</span>
          </div>
          <div className="LastRow-Revenue-SaleChart">
            <div className="LastRow-RevenueValue">
              {loading ? (
                <ShimmerLoader
                  width="50px"
                  height="22.5px"
                />
              ) : (
                formatNumber(metrics.totalShipping)
              )}
            </div>
            <span>Shipping</span>
          </div>
          <div className="LastRow-Revenue-SaleChart">
            <div className="LastRow-RevenueValue">
              {loading ? (
                <ShimmerLoader
                  width="50px"
                  height="22.5px"
                />
              ) : (
                formatNumber(metrics.totalReturns)
              )}
            </div>
            <span>Returns</span>
          </div>
          <div className="LastRow-Revenue-SaleChart">
            <div className="LastRow-RevenueValue">
              {loading ? (
                <ShimmerLoader
                  width="50px"
                  height="22.5px"
                />
              ) : (
                formatNumber(metrics.totalCoupons)
              )}
            </div>
            <span>Coupons</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalytics;