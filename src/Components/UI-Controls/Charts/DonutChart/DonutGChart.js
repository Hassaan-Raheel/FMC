import React, { useMemo } from "react";
import { Chart } from "react-google-charts";
import ShimmerLoader from "../../Loader/ShimmerLoader";

const colors = ["#6f75eb", "#353cbb", "#FF9900", "#109618", "#990099", "#3B3EAC"];

const getColor = (index) => colors[index % colors.length];

const GoogleDonutChart = ({ data, width = "100%", height = "230px", loading }) => {
  const options = useMemo(() => ({
    pieHole: 0.65,
    is3D: false,
    backgroundColor: "transparent",
    pieSliceBorderColor: "#fff",
    pieSliceText: "none",
    sliceVisibilityThreshold: 0,
    chartArea: { left: 7, top: 0, bottom: -8, width: "51%", height: "70%" },
    legend: { position: "none" },
    colors: colors, 
  }), []);

  const hasValidData = Array.isArray(data) && data.length > 1;

  return (
    <div style={styles.container}>
      <div style={styles.legendContainer}>
        {loading || !hasValidData ? (
          Array(2).fill().map((_, index) => (
            <ShimmerLoader key={index} width="120px" height="16px" borderRadius="4px" />
          ))
        ) : (
          data.slice(1).map(([label], index) => (
            <div key={index} style={styles.legendItem}>
              <span style={{ ...styles.legendColor, backgroundColor: getColor(index) }}></span>
              <span style={styles.legendText}>{label}</span>
            </div>
          ))
        )}
      </div>

      <div style={styles.chartContainer}>
        {loading || !hasValidData ? (
          <div style={{width: "100%", marginLeft: "40px"}}><ShimmerLoader width="150px" height="150px" borderRadius="50%" /></div>
        ) : (
          <Chart
            chartType="PieChart"
            width={width}
            height={height}
            data={data}
            options={options}
          />
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "10px",
    padding: "5px",
  },
  legendContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "5px",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  legendColor: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
  },
  legendText: {
    color: "var(--text-color-1)",
    fontSize: "var(--font-size-small)",
    fontWeight: "var(--font-weight-medium)",
    marginTop: 1,
  },
  chartContainer: {
    alignSelf: "left",
  },
};

export default GoogleDonutChart;