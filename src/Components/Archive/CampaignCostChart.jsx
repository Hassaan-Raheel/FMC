import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const campaignTypes = ["Search", "Performance Max", "Shopping", "Display"];

const CampaignCostChart = ({ data }) => {
  // Group campaigns by date and sum costs for each type
  const groupedData = data.reduce((acc, campaign) => {
    const date = campaign.Day;
    if (!acc[date]) {
      acc[date] = { date };
      campaignTypes.forEach((type) => {
        acc[date][type] = 0;
      });
    }
    acc[date][campaign["Campaign type"]] += parseFloat(campaign.Cost || 0);
    return acc;
  }, {});

  // Convert object to array and sort by date in ascending order
  const chartData = Object.values(groupedData).sort((a, b) => new Date(a.date) - new Date(b.date));

  // Define colors for each campaign type
  const colors = ["#4A90E2", "#E94E77", "#50C878", "#FFCC00"];

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4 text-center">Spent By Campaign Type</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
          {/* Define gradients and a drop shadow filter */}
          <defs>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="3" dy="3" stdDeviation="3" floodColor="#888888" />
            </filter>
            {colors.map((color, index) => (
              <linearGradient key={index} id={`colorGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                <stop offset="100%" stopColor={color} stopOpacity={0.6} />
              </linearGradient>
            ))}
          </defs>

          <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} stroke="#333" />
          <YAxis stroke="#333" />
          <Tooltip />
          <Legend wrapperStyle={{ bottom: 0 }} />
          
          {campaignTypes.map((type, index) => (
            <Bar
              key={index}
              dataKey={type}
              stackId="a"
              fill={`url(#colorGradient${index})`}
              filter="url(#shadow)"
              barSize={50}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CampaignCostChart;
