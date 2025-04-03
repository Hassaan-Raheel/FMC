import React, { useEffect, useState } from "react";
import "./Funnelcomponent.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const FunnelComponent = ({ funnelData }) => {
  const [hoveredData, setHoveredData] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 40, y: 40 });

  const handleMouseEnter = (event, entry) => {
    setHoveredData(entry);
    setHoverPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => setHoveredData(null);

  return (
    <div className="margin" style={{ display: "flex", width: "100%", height: 500, justifyContent: "center" }}>
      <div style={{ height: "600px", width: "100%", position: "relative" }}>
      <ellipse cx="160" cy="167" rx="69" ry="12" fill="rgb(4, 45, 86)" />
      <ellipse cx="160" cy="105" rx="90" ry="6" fill="rgb(4, 45, 86)" />
        <svg width="100%" height="100%" viewBox="0 0 380 360">
          {funnelData.map((entry, index) => {
            const topWidth = 220 - index * 40;
            const bottomWidth = 180 - index * 40;
            const height = 58;
            const yOffset = index * (height + 15) + 40;

            return (
              <g
                key={index}
                onMouseEnter={(event) => handleMouseEnter(event, entry)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Funnel Section */}
                <path
                  d={`
                    M ${160 - topWidth / 2},${yOffset} 
                    Q 160,${yOffset - 10} ${160 + topWidth / 2},${yOffset} 
                    L ${160 + bottomWidth / 2},${yOffset + height} 
                    Q 160,${yOffset + height + 10} ${160 - bottomWidth / 2},${yOffset + height} 
                    Z
                  `}
                  fill={entry.color}
                />
              </g>
            );
          })}

          {funnelData.map((entry, index) => {
            const height = 60;
            const yOffset = index * (height + 15) + 50;

            return (
              <text
                key={`text-${index}`}
                x="160"
                y={yOffset + height / 2}
                textAnchor="middle"
                fill="#fff"
                fontSize="14"
                dominantBaseline="middle"
              >
                {entry.name}
              </text>
            );
          })}
          <ellipse cx="160" cy="188" rx="69" ry="6" fill="rgb(4, 45, 86)" />
           <ellipse cx="160" cy="113" rx="90" ry="6" fill="rgb(4, 45, 86)" />
          <ellipse cx="160" cy="40" rx="110" ry="12" fill="rgb(96, 4, 4) " />
    
    
        </svg>

        {/* Hover Card */}
        {hoveredData?.metrics?.length > 0 && (
  <div
    className="charts absolute bg-white shadow-lg p-3 rounded-lg"
    style={{
      top: `${hoverPosition.y}px`,
      left: `${hoverPosition.x}px`,
      transform: "translate(-135%, -252%)",
      width:"300px",
      height: "auto",
      borderRadius: "10px",
      border: "1px solid #ddd",
      backgroundColor: "white",
      padding: "10px",
      marginTop: "120px",
      marginLeft: "150px",
      display: "flex",
      justifyContent: "center",
      boxshadow: "0 1px 4px #00000029", /* Subtle shadow */
      webkitbackdropfilter: "var(--standered-backdrop)", /* Safari support for backdrop-filter */
      backdropfilter: "var(--standered-backdrop)", /* Standard backdrop-filter */
      background: "rgba(244, 244, 244, 0.87)", /* Your custom transparent background */
      borderradius: "var(--standered-radius)", 
      color:"Black",
    }}
  >
    <h3 className="text-center text-sm font-bold">
      {hoveredData.name} Metrics
    </h3>

    <div className='graphs'style={{ width: "100%", height: 150, marginTop: 10 }}>
  <ResponsiveContainer width="100%" height="100%">
  <BarChart data={hoveredData.metrics} layout="vertical">
    {/* Y-Axis for Labels */}
    <YAxis dataKey="label" type="category" width={10} />
    <XAxis type="number" />

    {/* Tooltip with dynamic labels */}
    <Tooltip
      formatter={(value, name) => [`${value}`, name]}
    />

    {/* Legend to show metric names */}
    <Legend />

    {/* Dynamically create bars for all numeric values */}
    {Object.keys(hoveredData.metrics[0])
      .map((key, index) => (
        <Bar key={key} dataKey={key} name={key} fill={["#E53935", "#1E88E5", "#1976D2"][index % 3]} />
      ))}
  </BarChart>
</ResponsiveContainer>
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default FunnelComponent;
