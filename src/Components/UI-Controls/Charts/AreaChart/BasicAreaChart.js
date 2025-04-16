import React from "react";
import Chart from "react-apexcharts";

const BasicAreaChart = ({
  data,
  chartTitle = "",
  chartSubtitle = "",
  yAxisPosition = "right",
  strokeType = "straight",
  chartWidth = "100%",
  chartHeight = 250,
  xAxisLabelSpacing = 0,
  yAxisLabelSpacing = 0,
  legendSpacing = 10,
  xAxisMin = undefined,
  xAxisMax = undefined,
  xAxisTickAmount = 12,
}) => {

  const series = data?.seriesData || [];

  const formatDate = (val) => {
    return val;
  };

  const formatYAxis = (value) => {
    if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(1) + "M";
    } else if (value >= 1_000) {
      return (value / 1_000).toFixed(1) + "K";
    } else {
      return value;
    }
  };

  const options = {
    chart: {
      type: "area",
      height: chartHeight,
      width: chartWidth,
      zoom: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: strokeType, width: 1 },
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
      tickAmount: 3,
      labels: { offsetX: yAxisLabelSpacing, formatter: formatYAxis },
    },
    legend: {
      horizontalAlign: "right",
      itemMargin: { horizontal: legendSpacing },
    },
    colors: ["#6f75eb", "#353cbb"],

    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.3,
        type: "vertical",
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0.1,
        stops: [0, 50, 100],
        colorStops: [

          { offset: 0, color: "#6f75eb", opacity: 0.6 },
          { offset: 50, color: "#9095f3", opacity: 0.3 },
          { offset: 100, color: "#b0b4f9", opacity: 0.1 },

          { offset: 0, color: "#353cbb", opacity: 0.6 },
          { offset: 50, color: "#4a50d4", opacity: 0.3 },
          { offset: 100, color: "#6468e5", opacity: 0.1 },
        ],
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

export default BasicAreaChart;