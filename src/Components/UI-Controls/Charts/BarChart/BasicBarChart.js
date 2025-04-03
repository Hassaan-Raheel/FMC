import React from "react";
import Chart from "react-apexcharts";

const BasicBarChart = ({ data = { seriesData: [], categories: [] } }) => {

  const seriesData = Array.isArray(data.seriesData) ? data?.seriesData : [0];
  const categories = Array.isArray(data.categories) ? data.categories : ["No Data"];

  const options = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        borderRadiusApplication: "end",
        horizontal: false,
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories,
    },
  };

  return (
    <Chart
      options={options}
      series={[{ name: "Sales", data: seriesData }]}
      type="bar"
      height={350}
    />
  );
};

export default BasicBarChart;