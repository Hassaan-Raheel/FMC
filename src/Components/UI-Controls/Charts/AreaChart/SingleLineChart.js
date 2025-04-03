import React from "react";
import Chart from "react-apexcharts";

const SingleLineChart = ({
  data,
  metricName = "Total Orders",
  chartTitle = "",
  chartSubtitle = "",
  yAxisPosition = "right",
  strokeType = "straight",
  chartWidth = "100%",
  chartHeight = 250,
  xAxisTickAmount = 12,
}) => {
  const series = data?.seriesData ? [{ name: metricName, data: data.seriesData }] : [];

  const formatDate = (val) => val;

  const formatYAxis = (value) => {
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
    if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
    return value;
  };

  const options = {
    chart: {
      type: "area",
      height: chartHeight,
      width: chartWidth,
      zoom: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: strokeType, width: 2 },
    title: { text: chartTitle, align: "left" },
    subtitle: { text: chartSubtitle, align: "left" },
    labels: data?.labels || [],
    xaxis: {
      type: "category",
      categories: data?.labels || [],
      tickAmount: xAxisTickAmount,
      labels: {
        formatter: formatDate,
        rotate: -45,
        show: true,
      },
    },
    yaxis: {
      opposite: yAxisPosition === "right",
      tickAmount: 1,
      labels: { formatter: formatYAxis },
    },
    legend: {
      show: series.length > 0,
      horizontalAlign: "right",
    },
    colors: ["#6f75eb"],

    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.4,
        type: "vertical",
        inverseColors: false,
        opacityFrom: 0.9,
        opacityTo: 0.6,
        stops: [0, 50, 100],
      },
    },    
  };

  return (
    <div>
      <Chart
        options={options}
        series={series}
        type="area"
        height={chartHeight}
        width={chartWidth}
      />
    </div>
  );
};

export default SingleLineChart;