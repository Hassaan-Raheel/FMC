import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Page.css";
import "./Analytics.css";
import { Url } from "../../Services/Api";
import DataTable from "react-data-table-component";
import AnalyticsProductCard from "../../Components/AnalyticsComponents/OverviewAnalytics/AnalyticsProductCard";
import ShimmerLoader from "../../Components/UI-Controls/Loader/ShimmerLoader";
import { FaHandHoldingUsd, FaCubes, FaClipboardList } from "react-icons/fa";
import ProductVisualize from "../../Components/AnalyticsComponents/OverviewAnalytics/ProductVisualization";
import Pagination from "../../Components/UI-Controls/Pagination/PaginationRashid";
import { DatePicker } from "antd";

const OrderAnalytics = () => {
  const { RangePicker } = DatePicker;
  const rowsPerPage = 7;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [productSales, setProductSales] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState("totalOrder");
  const [metricName, setMetricName] = useState("Total Orders");
  const [componentName, setComponentName] = useState("Orders Analytics");
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalNetSales, setTotalNetSales] = useState(0);
  const [totalItemsSold, setTotalItemsSold] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [dateRange, setDateRange] = useState(null);

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
      fetchProductData(startDate, endDate);
    }
  };

  const fetchProductData = async (startDate, endDate) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${Url}/api/v1/analytics/product-analytics`,
        {
          params: { startDate, endDate },
        }
      );

      if (!response.data) throw new Error("Invalid API response format");

      const result = response.data;
      setData(result);

      const productsArray = Object.values(result?.productSales || {}).filter(
        (item) => item && typeof item === "object"
      );

      const totalOrders = productsArray.reduce(
        (sum, product) => sum + (product.orders || 0),
        0
      );
      const totalNetSales = productsArray.reduce(
        (sum, product) => sum + (product.netSale || 0),
        0
      );
      const totalItemsSold = productsArray.reduce(
        (sum, product) => sum + (product.quantity || 0),
        0
      );
      const totalProducts = productsArray.length;

      setProductSales(productsArray);
      setTotalOrders(totalOrders);
      setTotalNetSales(totalNetSales);
      setTotalItemsSold(totalItemsSold);
      setTotalProducts(totalProducts);

      /* --- Date Wise Handling --- */

      if (!Array.isArray(result.sale_chart))
        throw new Error("Invalid or missing sale_chart data");

      const sortedSaleChart = [...result.sale_chart].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      const aggregatedSaleData = sortedSaleChart.reduce((acc, entry) => {
        const dateKey = entry.date;
        acc[dateKey] = (acc[dateKey] || 0) + Number(entry[selectedMetric] || 0);
        return acc;
      }, {});

      const sortedDates = Object.keys(aggregatedSaleData).sort(
        (a, b) => new Date(a) - new Date(b)
      );

      setChartData({
        seriesData: sortedDates.map((date) => aggregatedSaleData[date]),
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
      fetchProductData();
    }
  }, [selectedMetric]);

  /* --- Click Handlers for Cards --- */
  const handleMetricChange = (metric, name) => {
    setSelectedMetric(metric);
    setComponentName("Orders Analytics");
    setMetricName(name);
  };

  /* --- Function for representing numbers & currency in standard way --- */
  const formatNumber = (num) => {
    if (!num) return "N/A";
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
      title: "Total Order",
      duration: "Last 7 Days",
      value: loading ? (
        <ShimmerLoader width="100px" height="22.5px" borderRadius="20px" />
      ) : (
        formatNumber(data?.totalOrders || 0)
      ),
      growth: 20.05,
      icon: <FaClipboardList />,
      onClick: () => handleMetricChange("totalOrder", "Total Orders"),
    },
    {
      title: "Total Items Sold",
      duration: "Last 7 Days",
      value: loading ? (
        <ShimmerLoader width="100px" height="22.5px" borderRadius="20px" />
      ) : (
        formatNumber(data?.totalItemsSold || 0)
      ),
      growth: 15.78,
      icon: <FaCubes />,
      onClick: () => handleMetricChange("itemSold", "Total Items Sold"),
    },
    {
      title: "Net Sales",
      duration: "Last 7 Days",
      value: loading ? (
        <ShimmerLoader width="100px" height="22.5px" borderRadius="20px" />
      ) : (
        formatCurrency(data?.netSale || 0)
      ),
      growth: 25.92,
      icon: <FaHandHoldingUsd />,
      onClick: () => handleMetricChange("netSale", "Net Sales"),
    },
  ];

  /* --- Data Table Handling --- */

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

  const ProductsDataColumns = [
    {
      name: "Name",
      selector: (row) => row.name,
      width: "175px",
      cell: (row) =>
        loading ? (
          <ShimmerLoader width="90px" height="22.5px" borderRadius="20px" />
        ) : (
          <div
            style={{
              whiteSpace: "normal",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              maxHeight: "44px",
            }}
          >
            {row.name || "N/A"}
          </div>
        ),
    },
    {
      name: "SKU",
      selector: (row) =>
        loading ? (
          <ShimmerLoader width="90px" height="22.5px" borderRadius="20px" />
        ) : (
          row.sku || "N/A"
        ),
      width: "125px",
    },
    {
      name: "Items",
      selector: (row) =>
        loading ? (
          <ShimmerLoader width="90px" height="22.5px" borderRadius="20px" />
        ) : (
          row.quantity || "N/A"
        ),
      width: "125px",
    },
    {
      name: "Net Sales",
      selector: (row) => row.netSale,
      width: "125px",
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
      name: "Variations",
      selector: (row) =>
        loading ? (
          <ShimmerLoader width="90px" height="22.5px" borderRadius="20px" />
        ) : (
          row.variationsSold || "N/A"
        ),
      width: "125px",
    },
    {
      name: "Stock",
      selector: (row) =>
        loading ? (
          <ShimmerLoader width="90px" height="22.5px" borderRadius="20px" />
        ) : (
          row.stock || "N/A"
        ),
      width: "125px",
    },
  ];

  const totalPages = Math.ceil(
    (Array.isArray(productSales) ? productSales.length : 0) / rowsPerPage
  );

  const paginatedData = Array.isArray(productSales)
    ? productSales.slice(
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
          <div className="RevenueAnalytics-Title">Orders</div>
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

      {/*--- Orders Analytics Card Section ---*/}
      <div className="ProductsAnalytics-Row01">
        {/* --- Orders Header Cards Section --- */}
        {Array.isArray(ProductsAnalyticsCardData) &&
        ProductsAnalyticsCardData.length > 0 ? (
          ProductsAnalyticsCardData.map((item, index) => (
            <div
              key={index}
              className="Products-Row01-Card"
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

      {/* --- Orders API Data Table Section --- */}
      <div className="ProductsAnalytics-Row01">
        <div className="Orders-Table-Data">
          <div>
            <DataTable
              columns={ProductsDataColumns}
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
        <div className="ProductAnalytics-LastRow">
          <div className="LastRow-ProductCount">
            <div className="LastRow-Value">
              {loading ? (
                <ShimmerLoader
                  width="80px"
                  height="22.5px"
                  borderRadius="10px"
                />
              ) : (
                formatNumber(totalProducts)
              )}
            </div>
            <span>Products</span>
          </div>
          <div className="LastRow-ItemSold">
            <div className="LastRow-Value">
              {loading ? (
                <ShimmerLoader
                  width="80px"
                  height="22.5px"
                  borderRadius="10px"
                />
              ) : (
                formatNumber(totalItemsSold)
              )}
            </div>
            <span>Items Sold</span>
          </div>
          <div className="LastRow-NetSales">
            <div className="LastRow-Value">
              {loading ? (
                <ShimmerLoader
                  width="100px"
                  height="22.5px"
                  borderRadius="10px"
                />
              ) : (
                formatCurrency(totalNetSales)
              )}
            </div>
            <span>Net Sales</span>
          </div>
          <div className="LastRow-TotalOrder">
            <div className="LastRow-Value">
              {loading ? (
                <ShimmerLoader
                  width="80px"
                  height="22.5px"
                  borderRadius="10px"
                />
              ) : (
                formatNumber(totalOrders)
              )}
            </div>
            <span>Orders</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderAnalytics;