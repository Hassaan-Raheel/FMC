import React from "react";
import { Chart } from "react-google-charts";

const ServerLogChart = ({ data, selectedChart }) => {
    if (!data || !data.seriesData || !data.categories) return null;

    const chartData = [["Time", "Orders"], ...data.categories.map((label, index) => [label, data.seriesData[index]])];

    const seriesData = chartData.slice(1).map(item => item[1]);
    const maxValue = Math.ceil(Math.max(...seriesData) / 10) * 10;
    const step = Math.ceil(maxValue / 4);
    const ticks = Array.from({ length: 5 }, (_, i) => i * step);
    
    const columnChartOptions = {
        title: "",
        legend: { position: "none" },
        colors: ["#6f75eb"],
        backgroundColor: "transparent",
        bar: { groupWidth: "30%" },
        hAxis: {
            title: "",
            textStyle: { fontSize: 12, color: "#555", bold: true },
        },
        vAxis: {
            minValue: 0,
            maxValue: maxValue,
            ticks: ticks,
            title: "",
            textStyle: { fontSize: 10, color: "#555", bold: true },
        },
        chartArea: { left: 40, top: 20, right: 20, bottom: 40 },
        series: {
            0: {
                dataOpacity: 1,
            },
        },

        column: {
            0: {
                style: { borderRadius: "10px 10px 0 0" },
            },
        },
    };

    const areaChartOptions = {
        title: "",
        legend: { position: "none" },
        backgroundColor: "transparent",
        colors: ["#6f75eb"],
        lineWidth: 1,
        curveType: "function",

        hAxis: {
            title: "",
            textStyle: { fontSize: 12, color: "#555", bold: true },
        },
        vAxis: {
            minValue: 0,
            maxValue: maxValue,
            ticks: ticks,
            textStyle: { fontSize: 10, color: "#555", bold: true },
        },
        chartArea: { left: 40, top: 20, right: 20, bottom: 40 },

        areaOpacity: 0.2,
    };

    return (
        <div style={{ width: "100%", height: "177px", overflow: "visible" }}>
            
            {selectedChart === 'line-chart' ? (
                <Chart chartType="AreaChart" width="100%" height="100%" data={chartData} options={areaChartOptions} />
            ) : (
                <Chart chartType="ColumnChart" width="100%" height="100%" data={chartData} options={columnChartOptions} />
            )}

        </div>
    );
};

export default ServerLogChart;