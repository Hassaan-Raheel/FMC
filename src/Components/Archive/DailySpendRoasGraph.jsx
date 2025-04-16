import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const DailySpendRoasGraph = ({ data }) => {
  // Safeguard: Ensure data is an array
  const validData = Array.isArray(data) ? data : [];

  // Group data by date
  const groupedData = validData.reduce((acc, item) => {
    const date = item["Day"]; // Extract the date
    const cost = parseFloat(item.Cost) || 0;
    const roas = parseFloat(item["Conv. value / cost"] * 100) || 0; // Convert to percentage

    if (!acc[date]) {
      acc[date] = { date, cost, roas, count: 1 };
    } else {
      acc[date].cost += cost;
      acc[date].roas += roas;
      acc[date].count += 1;
    }

    return acc;
  }, {});

  // Convert grouped object into array, calculate average ROAS, and format numbers
  const chartData = Object.values(groupedData)
    .map(({ date, cost, roas, count }) => ({
      date,
      cost: parseFloat(cost.toFixed(2)), // Fix cost to 2 decimal places
      roas: parseFloat((roas / count).toFixed(2)), // Fix ROAS to 2 decimal places
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort dates in ascending order

  // Handle empty data
  if (validData.length === 0) {
    return <div>No data available.</div>;
  }

  return (
    <div>
      <h3>COST VS ROAS</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="cost" stroke="#8884d8" name="Cost ($)" />
          <Line type="monotone" dataKey="roas" stroke="#82ca9d" name="ROAS (%)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailySpendRoasGraph;