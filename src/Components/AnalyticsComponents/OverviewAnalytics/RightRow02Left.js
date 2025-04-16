import React, { useState } from "react";
import "./AnalyticsOverviewCard.css";
import BasicAreaChart from "../../UI-Controls/Charts/AreaChart/BasicAreaChart";
import ColumnChart from "../../UI-Controls/Charts/ColumnChart/GColumnChart";
import ShimmerLoader from "../../UI-Controls/Loader/ShimmerLoader";

const RightRow02Left = ({ SalesData, OrderData, loading }) => {
  // const [chartData, setChartData] = useState({
  //   seriesData: [
  //     45000, 39000, 42000, 47500, 51050, 49000, 62500, 59400, 63000, 60150,
  //     67250, 65240,
  //   ],
  //   labels: [
  //     "2025-01-01",
  //     "2025-02-01",
  //     "2025-03-01",
  //     "2025-04-01",
  //     "2025-05-01",
  //     "2025-06-01",
  //     "2025-07-01",
  //     "2025-08-01",
  //     "2025-09-01",
  //     "2025-10-01",
  //     "2025-11-01",
  //     "2025-12-01",
  //   ],
  // });

  // const [chartData, setChartData] = useState({
  //   seriesData: [
  //     [45000, 39000, 42000, 47500, 51050, 49000, 62500, 59400, 63000, 60150, 67250, 65240], // Series 1
  //     [48000, 41000, 44000, 48000, 52000, 51000, 64000, 60000, 65000, 61500, 68000, 66000], // Series 2
  //   ],
  //   labels: [
  //     "2025-01-01", "2025-02-01", "2025-03-01", "2025-04-01", "2025-05-01", "2025-06-01",
  //     "2025-07-01", "2025-08-01", "2025-09-01", "2025-10-01", "2025-11-01", "2025-12-01"
  //   ],
  // });

  // const [histogramData, setHistogramData] = useState({
  //  seriesData: [4500, 3900, 4200, 4750, 5105, 4900, 6250, 5940, 6300, 6015, 6725, 6540],
  //  categories: ["2025-01-01", "2025-02-01", "2025-03-01", "2025-04-01", "2025-05-01", "2025-06-01", "2025-07-01", "2025-08-01", "2025-09-01", "2025-10-01", "2025-11-01", "2025-12-01"],
  // });

  return (
    <div className="ParentLayout-RightRow02-Left">
      {/* Row-01 Basic Area Chart */}
      <div className="Sales-Analytics-Charts">
        <span className="Chart-Heading">Sales Analytics</span>
        <span className="Chart-SubHeading">Last 12-Months Analytics</span>
        {loading ? (
          <ShimmerLoader width="100%" height="250px" borderRadius="5px" />
        ) : (
          <BasicAreaChart
            // data={{ seriesData: chartData.seriesData, labels: chartData.labels }}
            data={SalesData} // Using the passed "data" prop directly
            chartTitle=""
            chartSubtitle=""
            yAxisPosition="left"
            strokeType="smooth"
            chartWidth="100%"
            xAxisLabelSpacing={10}
            yAxisLabelSpacing={-10}
            legendSpacing={10}
            xAxisTickAmount={12}
          />
        )}
      </div>

      {/* Chart Separator*/}
      <hr className="chart-separator" />

      {/* Row-02 Basic Bar Chart */}
      <div className="Sales-Analytics-Charts">
        <span className="Chart-Heading">Orders Analytics</span>
        <span className="Chart-SubHeading">Last 12-Months Analytics</span>
        {loading ? (
          <ShimmerLoader width="100%" height="250px" borderRadius="5px" />
        ) : (
          <ColumnChart data={OrderData} />
        )}
      </div>
    </div>
  );
};

export default RightRow02Left;
