import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels);

// Color Gradients
const RED_SHADES = ["rgb(222,89,70)", "rgb(225,104,87)","rgb(237, 168, 159)"];
const BLUE_SHADES = ["rgb(41,118,158)", "rgb(47,129,167)", "rgb(97, 145, 167)"];
const YELLOW_SHADES = ["#FFEB99", "#FFD966"];

// Function to generate chart data
const generateChartData = (data, label, colors) => ({
  labels: Object.keys(data),
  datasets: [
    {
      label,
      data: Object.values(data),
      backgroundColor: colors.slice(0, Object.keys(data).length),
    },
  ],
});

const getTop3Campaigns = (chart) => {
  const dataset = chart.data.datasets[0].data;
  const labels = chart.data.labels.map((label, index) => ({
    label,
    value: dataset[index],
  }));

  // Sort by value in descending order and pick the top 3
  return labels
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)
    .map((item) => item.label);
};

const pieChartOptions = {
  responsive: true,
  cutout: "35%", // Creates the central gap (Doughnut effect)
  rotation: -90,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        generateLabels: (chart) => {
          const top3Labels = getTop3Campaigns(chart);

          return chart.data.labels
            .map((label, index) => ({
              text: top3Labels.includes(label) ? label.split(" ")[0] : "", // Show only the first word for top 3
              fillStyle: chart.data.datasets[0].backgroundColor[index],
              fontColor: top3Labels.includes(label) ? "black" : "gray",
              fontStyle: top3Labels.includes(label) ? "bold" : "normal",
              hidden: !top3Labels.includes(label), // Hide non-top 3 campaigns
            }))
            .filter((item) => item.text !== ""); // Remove hidden labels from legend
        },
      },
    },
    tooltip: {
      callbacks: {
        label: (tooltipItem) => {
          const dataset = tooltipItem.dataset.data;
          const value = dataset[tooltipItem.dataIndex];
          const total = dataset.reduce((sum, val) => sum + val, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${value} (${percentage}%)`;
        },
      },
    },
    datalabels: {
      color: "white",
      font: { weight: "bold", size: 14 },
      formatter: (value, context) => {
        const dataset = context.dataset.data;
        const total = dataset.reduce((sum, val) => sum + val, 0);
        const percentage = ((value / total) * 100).toFixed(1);

        // Only show percentages for the top 3 campaigns
        const top3Labels = getTop3Campaigns(context.chart);
        const campaignLabel = context.chart.data.labels[context.dataIndex];

        return top3Labels.includes(campaignLabel) ? `${percentage}%` : "";
      },
    },
  },
};


const CCampaignPieChart2 = ({ campaignData }) => {
  const aggregateData = (field, valueField) =>
    campaignData.reduce((acc, campaign) => {
      const key = campaign[field] || "Unknown";
      const value = parseFloat(campaign[valueField]) || 0;
      acc[key] = (acc[key] || 0) + value;
      return acc;
    }, {});

  const costByCampaignType = aggregateData("Campaign type", "Cost");
  const costByCampaignName = aggregateData("Campaign", "Cost");
  const convByCampaignType = aggregateData("Campaign type", "Conversions");
  const convByCampaignName = aggregateData("Campaign", "Conversions");
  const audienceByCampaignType = aggregateData("Campaign type", "Audience");
  const audienceByCampaignName = aggregateData("Campaign", "Audience");

  return (
    <div className="panel-container">
    {/* Section 1: Amount Spent */}
    <div className="panel">
      <h3 className="tab1 text-lg mb-0 mt-0">Amount Spent</h3>
      <div className="gridpie">
        <div className="chart-container">
          <h3>Amount Spent by Campaign Type</h3>
          <Pie data={generateChartData(costByCampaignType, "Cost ($)", RED_SHADES)} options={pieChartOptions} />
        </div>
        <div className="chart-container">
          <h3>Amount Spent by Campaign Name</h3>
          <Pie data={generateChartData(costByCampaignName, "Cost ($)", BLUE_SHADES)} options={pieChartOptions} />
        </div>
      </div>
    </div>
  
    {/* Section 2: Conversions */}
    <div className="panel">
      <h3 className="tab1 text-lg mb-0 mt-0">Conversions</h3>
      <div className="gridpie">
        <div className="chart-container">
          <h3>Conversions by Campaign Type</h3>
          <Pie data={generateChartData(convByCampaignType, "Conversions", RED_SHADES)} options={pieChartOptions} />
        </div>
        <div className="chart-container">
          <h3>Conversions by Campaign Name</h3>
          <Pie data={generateChartData(convByCampaignName, "Conversions", BLUE_SHADES)} options={pieChartOptions} />
        </div>
      </div>
    </div>
  
  </div>
  );
};

export default CCampaignPieChart2;
