import React from "react";
import { Chart } from "react-google-charts";

const ColumnChart = ({ data, metricName }) => {
  if (!data || !data.seriesData || !data.labels) return null;

  const chartData = [[ "Month", metricName ],
    ...data.labels.map((label, index) => [label, data.seriesData[index]])
  ];

  const chartOptions = {
    title: "",
    legend: { position: "none" },
    colors: ["#6f75eb"],
    backgroundColor: "transparent",
    bar: { groupWidth: "40%" },
    hAxis: {
      title: "",
      textStyle: { fontSize: 9, color: "#555", bold: true },
    },
    vAxis: {
      textStyle: { fontSize: 9, color: "#555", bold: true },
      format: "short",
    },
    chartArea: { left: 40, top: 20, right: 20, bottom: 40 },
  };

  return (
    <div style={{ width: "100%", height: "250px", overflow: "visible" }}>
      <Chart chartType="ColumnChart" width="100%" height="100%" data={chartData} options={chartOptions} />
    </div>
  );
};

export default ColumnChart;