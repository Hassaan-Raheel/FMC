import React from "react";
import Chart from "react-apexcharts";

const DonutChart = ({ series, labels, title, width = 280 }) => {
  const options = {
    chart: {
      type: "donut",
      width: width,
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
      },
    },
    labels: labels,
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: "gradient",
    },
    legend: {
      formatter: function (val, opts) {
        return val + " - " + opts.w.globals.series[opts.seriesIndex];
      },
      position: "bottom",
    },
    title: {
      text: title || "Donut Chart",
    },
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
  };

  return <Chart options={options} series={series} type="donut" width={width} />;
};

export default DonutChart;