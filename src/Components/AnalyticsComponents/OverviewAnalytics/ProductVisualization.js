// import React, { useState } from "react";
// import "./AnalyticsOverviewCard.css";
// import SingleLineChart from "../../UI-Controls/Charts/AreaChart/SingleLineChart";
// import ColumnChart from "../../UI-Controls/Charts/ColumnChart/GColumnChart";
// import ShimmerLoader from "../../UI-Controls/Loader/ShimmerLoader";

// const ProductVisualize = ({ SalesData, OrderData, loading, metricName }) => {

//   return (
//     <div className="ProductVisualization-Main-Page">
//       <div className="Products-Analytics-Charts">
//         <span className="Chart-Heading">Sales Analytics</span>
//         <span className="Chart-SubHeading">{metricName}</span>
//         {loading ? (
//           <ShimmerLoader width="100%" height="250px" borderRadius="5px" />
//         ) : (
//           <SingleLineChart
//             data={SalesData}
//             metricName={metricName}
//             chartTitle=""
//             chartSubtitle=""
//             yAxisPosition="left"
//             strokeType="smooth"
//             chartWidth="100%"
//             xAxisLabelSpacing={10}
//             yAxisLabelSpacing={-10}
//             legendSpacing={10}
//             xAxisTickAmount={12}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductVisualize;

import React, { useState } from "react";
import { LineChartOutlined, BarChartOutlined } from "@ant-design/icons";
import "./AnalyticsOverviewCard.css";
import SingleLineChart from "../../UI-Controls/Charts/AreaChart/SingleLineChart";
import ColumnChart from "../../UI-Controls/Charts/ColumnChart/ProductColumnChart";
import ShimmerLoader from "../../UI-Controls/Loader/ShimmerLoader";
import { Tooltip } from "antd";

const ProductVisualize = ({ SalesData, loading, metricName, componentName }) => {
  const [chartType, setChartType] = useState("line"); // Default to line chart

  return (
    <div className="ProductVisualization-Main-Page">
      <div className="Products-Analytics-Charts">
        <div className="AnalyticsChart-Heading-Row">
          <div className="AnalyticsChart-Heading-Column">
            <span className="Chart-Heading">{componentName}</span>
            <span className="Chart-SubHeading">{metricName}</span>
          </div>

          {/* Chart Type Icons */}
          <div className="chart-icons">
          <Tooltip title="Line Chart">
            <LineChartOutlined
              className={`chart-icon ${chartType === "line" ? "active" : ""}`}
              onClick={() => setChartType("line")}
            />
            </Tooltip>
            <Tooltip title="Bar Chart">
            <BarChartOutlined
              className={`chart-icon ${chartType === "column" ? "active" : ""}`}
              onClick={() => setChartType("column")}
            />
            </Tooltip>
          </div>
        </div>

        {loading ? (
          <ShimmerLoader width="100%" height="250px" borderRadius="5px" />
        ) : chartType === "line" ? (
          <SingleLineChart
            data={SalesData}
            metricName={metricName}
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
        ) : (
          <ColumnChart data={SalesData} metricName={metricName} />
        )}
      </div>
    </div>
  );
};

export default ProductVisualize;
