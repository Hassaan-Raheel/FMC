import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Page.css";
import "./Analytics.css";
import { Url } from "../../Services/Api";
import AnalyticsOverviewCard from "../../Components/AnalyticsComponents/OverviewAnalytics/AnalyticsOverviewCard";
import TopProducts from "../../Components/AnalyticsComponents/OverviewAnalytics/TopProducts";
import OrderProgress from "../../Components/AnalyticsComponents/OverviewAnalytics/OrderProgress";
import LeftCard01 from "../../Components/AnalyticsComponents/OverviewAnalytics/LeftCard01";
import BestCategories from "../../Components/AnalyticsComponents/OverviewAnalytics/LeftCard02";
import RightRow02Left from "../../Components/AnalyticsComponents/OverviewAnalytics/RightRow02Left";
import ShimmerLoader from "../../Components/UI-Controls/Loader/ShimmerLoader";
import { FaDollarSign, FaShoppingCart, FaChartLine } from "react-icons/fa";
import { DatePicker } from "antd";

const OverviewAnalytics = () => {
  const { RangePicker } = DatePicker;
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(null);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState({
    totalProductsOrdered: 0,
    totalOrders: 0,
    totalSale: 0,
    netSale: 0,
  });
  const [salesChartData, setSalesChartData] = useState({
    seriesData: [
      [], // Series 1 (netSale)
      [], // Series 2 (grossSale)
    ],
    labels: [],
  });
  const [orderChartData, setOrderChartData] = useState({
    seriesData: [],
    categories: [],
  });

  const handleDateRange = (dates) => {
    setDateRange(dates);
    if (dates && dates.length === 2) {
      const startDate = dates[0].format("YYYY-MM-DD");
      const endDate = dates[1].format("YYYY-MM-DD");
      fetchAnalyticsData(startDate, endDate);
    }
  };

  /* --- Api Calling Handling --- */
  const fetchAnalyticsData = async (startDate, endDate) => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await axios.get(`${Url}/api/v1/analytics/overview`, {
        params: { startDate, endDate },
      });
  
      if (!response.data) throw new Error("Invalid API response format");
  
      const data = response.data;
      setData(data);
  
      /* --- Sale_Chart Data (Date-wise Handling) --- */
      if (!Array.isArray(data.sale_chart))
        throw new Error("Invalid or missing sale_chart data");
  
      const sortedSaleChart = [...data.sale_chart].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
  
      const aggregatedSalesData = sortedSaleChart.reduce((acc, entry) => {
        const dateKey = entry.date;
        if (!acc[dateKey]) {
          acc[dateKey] = { netSale: 0, grossSale: 0 };
        }
        acc[dateKey].netSale += Number(entry.netSale || 0);
        acc[dateKey].grossSale += Number(entry.grossSale || 0);
        return acc;
      }, {});
  
      const sortedDatesSales = Object.keys(aggregatedSalesData).sort(
        (a, b) => new Date(a) - new Date(b)
      );
  
      const salesChartData = {
        labels: sortedDatesSales.map((date) =>
          new Date(date).toLocaleDateString("en-US", { day: "2-digit", month: "short" })
        ),
        seriesData: [
          {
            name: "Net Sales",
            data: sortedDatesSales.map((date) => aggregatedSalesData[date].netSale),
          },
          {
            name: "Gross Sales",
            data: sortedDatesSales.map((date) => aggregatedSalesData[date].grossSale),
          },
        ],
      };
      setSalesChartData(salesChartData);

       /* --- Order_Chart Data --- */
      const ordersChartData = data.order_chart;

      const aggregatedOrderData = ordersChartData.reduce((acc, entry) => {
        const date = new Date(entry.date);
        const monthKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;

        if (!acc[monthKey]) {
          acc[monthKey] = 0;
        }
        acc[monthKey] += Number(entry.count || 0);

        return acc;
      }, {});

      const sortedMonthsOrders = Object.keys(aggregatedOrderData).sort(
        (a, b) => new Date(a) - new Date(b)
      );

      const orderData = {
        seriesData: sortedMonthsOrders.map(
          (month) => aggregatedOrderData[month]
        ),
        categories: sortedMonthsOrders.map((month) => {
          const [year, monthIndex] = month.split("-");
          return new Date(year, monthIndex - 1).toISOString().split("T")[0];
        }),
      };

      setOrderChartData(orderData);
  
      setTimeout(() => {
        setAnalyticsData({
          totalSale: data?.totalSale ?? 0,
          totalProductsOrdered: data?.totalProductsOrdered ?? 0,
          totalOrders: data?.totalOrders ?? 0,
          netSale: data?.netSale ?? 0,
        });
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      setError(error?.response?.data?.message || error.message);
      setLoading(false);
    }
  };  
  
  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  /* --- Overview Header Cards Handling --- */
  const AnalyticsCardData = [
    {
      title: "Total Order",
      duration: "Last 7 Days",
      value: loading ? (
        <ShimmerLoader width="100px" height="22.5px" borderRadius="20px" />
      ) : (
        formatNumber(analyticsData.totalOrders)
      ),
      growth: 20.05,
      icon: <FaShoppingCart />,
    },
    {
      title: "Total Products",
      duration: "This Month",
      value: loading ? (
        <ShimmerLoader width="100px" height="22.5px" borderRadius="20px" />
      ) : (
        formatNumber(analyticsData.totalProductsOrdered)
      ),
      growth: 5.07,
      icon: <FaChartLine />,
    },
    {
      title: "Total Sales",
      duration: "Last Week",
      value: loading ? (
        <ShimmerLoader width="100px" height="22.5px" borderRadius="20px" />
      ) : (
        `$${formatNumber(analyticsData.totalSale.toFixed(2))}`
      ),
      growth: 1.02,
      icon: <FaDollarSign />,
    },
    {
      title: "Net Sale",
      duration: "Last 30 Days",
      value: loading ? (
        <ShimmerLoader width="100px" height="22.5px" borderRadius="20px" />
      ) : (
        `$${formatNumber(analyticsData.netSale.toFixed(2))}`
      ),
      growth: 8.11,
      icon: <FaDollarSign />,
    },
  ];

  /* --- Top Rated Products Handling --- */
  const ProductCardData =
    data?.topSelling && Array.isArray(data.topSelling)
      ? [...data.topSelling].reverse().map((product, index) => {
          const images =
            Array.isArray(product?.productImages) &&
            product.productImages.length > 0
              ? [product.productImages[0]?.image_url ?? ""]
              : [];

          console.log(`Product ${index + 1}:`, {
            productName: product?.productName,
            productSKU: product?.productSKU,
            quantity: product?.quantity,
            images,
          });

          return {
            title: product?.productName ?? "Unknown Product",
            sku: product?.productSKU ?? "Unknown",
            value: formatNumber(product?.quantity ?? 0),
            images,
          };
        })
      : [];

  /* --- Order Progress Handling --- */
  const orderProgressStatus = [
    {
      name: "Professional Assembly",
      percentage: data?.professionalAssembledOrders
        ? parseFloat(data.professionalAssembledOrders).toFixed(2)
        : "0.00",
    },
    {
      name: "Cart Protection",
      percentage: data?.protectedCartOrders
        ? parseFloat(data.protectedCartOrders).toFixed(2)
        : "0.00",
    },
    {
      name: "Products Protection",
      percentage: data?.protectedProductsOrders
        ? parseFloat(data.protectedProductsOrders).toFixed(2)
        : "0.00",
    },
  ];

  const topSellingCategories = data?.topSellingCategories || [];

  const categoryCounts = topSellingCategories.reduce((acc, category) => {
    acc[category.name] = (acc[category.name] || 0) + 1;
    return acc;
  }, {});

  const donutChartData = [
    ["Category", "Frequency"],
    ...Object.entries(categoryCounts),
  ];

  console.log(donutChartData);

  const disabledDate = (current) => {
    return current && current > new Date();
  };

  return (
    <div className="OverviewPageLayout">
      {/* --- Title & Filteration Row --- */}
      <div className="OverviewPage-Row01">
        <div className="RevenueAnalytics-1stRow">
          <div className="RevenueAnalytics-Title">Overview</div>
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

      <div className="OverviewPage-Row02">
        <div className="OverviewLeftSide">
          {/* --- Review Analytics Section --- */}
          <div className="Overview-LeftCard-01">
            <LeftCard01 netSales={75} grossSales={80} />
          </div>

          {/* --- Best Selling Categories Section --- */}
          <div className="Overview-LeftCard-02">
            <div className="Overview-Heading-Section">
              <span className="OverviewCard-Heading">
                Best Selling Categories
              </span>
              <span className="OverviewCard-SubHeading">
                Last 01 Month Analytics
              </span>
            </div>
            <div className="Overview-Best-Category">
            <BestCategories data={donutChartData || []} loading={loading} />
            </div>
          </div>
        </div>

        <div className="OverviewRightSide">
          {/* --- Overview Header Cards Section --- */}
          <div className="Overview-RightRow-01">
            {Array.isArray(AnalyticsCardData) &&
            AnalyticsCardData.length > 0 ? (
              AnalyticsCardData.map((item, index) => (
                <div key={index} className="Overview-RightRow01-Card">
                  <AnalyticsOverviewCard
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

          <div className="Overview-RightRow-02">
            {/* --- Sale & Order Analytics Section --- */}
            <div className="Overview-RightRow-02-Left">
              <RightRow02Left
                SalesData={{
                  labels: salesChartData.labels,
                  seriesData: salesChartData.seriesData,
                }}
                OrderData={orderChartData}
                loading={loading}
              />
            </div>

            <div className="Overview-RightRow-02-Right">
              {/* --- Progress Status Section --- */}
              <div className="Overview-RightRow02-Right-01">
                <div className="Overview-Heading-Section">
                  <span className="OverviewCard-Heading">Adds On</span>
                  <span className="OverviewCard-SubHeading">
                    Warranty & Proffesional Assembly
                  </span>
                </div>
                <OrderProgress data={orderProgressStatus} loading={loading} />
              </div>

              {/* --- Top Rated Product Section --- */}
              <div className="Overview-RightRow02-Right-02">
                <div className="Overview-Heading-Section">
                  <span className="OverviewCard-Heading">
                    Top Rated Products
                  </span>
                  <span className="OverviewCard-SubHeading">
                    Last 01-Month Analytics
                  </span>
                </div>

                <div className="TopProductCards-Handling">
                  {loading ? (
                    [...Array(3)].map((_, index) => (
                      <div key={index} className="Rated-Product-Card">
                        <TopProducts loading={true} />
                      </div>
                    ))
                  ) : ProductCardData.length > 0 ? (
                    ProductCardData.map((item, index) => (
                      <div key={index} className="Rated-Product-Card">
                        <TopProducts
                          title={item.title}
                          sku={item.sku}
                          quantity={item.value}
                          images={item.images}
                          loading={false}
                        />
                      </div>
                    ))
                  ) : (
                    <p>No products available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewAnalytics;