import React from "react";
import Chart from "react-apexcharts";

const MiniChart = ({ data, color, width = 80 }) => {
  const options = {
    chart: {
      type: "line",
      sparkline: { enabled: true },
    },
    stroke: {
      width: 2,
      curve: "smooth",
    },
    colors: [color],
    tooltip: { enabled: false },
    xaxis: { labels: { show: false } },
    yaxis: { labels: { show: false } },
  };

  const series = [{ data: data.length ? data.slice(-7) : [0, 0, 0, 0, 0, 0, 0] }];

  return <Chart options={options} series={series} type="line" width={width} height={50} />;
};

export default MiniChart;