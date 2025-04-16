import React from "react";
import { Card } from "antd";
import { Column } from "@ant-design/plots";
import dayjs from "dayjs";

const AntDHistogramChart = ({ data }) => {
  if (!data || !data.seriesData || !data.categories) return null;

  const filteredData = data.categories
    .map((label, index) => ({
      date: dayjs(label).format("MMM-YY"),
      value: data.seriesData[index],
    }))
    .filter((item) =>
      ["Jan", "Mar", "May", "Jul", "Sep", "Nov"].includes(item.date.split("-")[0])
    );

  const config = {
    data: filteredData,
    xField: "date",
    yField: "value",
    height: 300,
    appendPadding: [20, 20, 20, 20],
    autoFit: true,
    maxColumnWidth: 30,
    minColumnWidth: 5,
    columnStyle: {
      fill: "#FF5733",
      stroke: "#333",
      lineWidth: 1,
    },
    xAxis: {
      label: {
        style: {
          fontSize: 14,
          fill: "#555",
          fontWeight: "bold",
        },
      },
    },
    yAxis: {
      title: {
        text: "No. of Orders",
        style: {
          fontSize: 16,
          fill: "#333",
          fontWeight: "bold",
        },
      },
      label: {
        style: {
          fontSize: 14,
          fill: "#555",
          fontWeight: "bold",
        },
      },
    },
    tooltip: {
      showMarkers: false,
      formatter: (datum) => ({
        name: "Orders",
        value: datum.value.toLocaleString(),
      }),
    },
    meta: {
      value: {
        formatter: (val) => val.toLocaleString(),
      },
    },
  };

  return (
    <Card bordered={false} style={{ width: "100%", overflowX: "auto", padding: 0 }}>
      <div style={{ maxWidth: "100%", overflow: "hidden" }}>
        <Column {...config} />
      </div>
    </Card>
  );
};

export default AntDHistogramChart;