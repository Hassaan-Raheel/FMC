import React from 'react';
import ReactApexChart from 'react-apexcharts';
import PropTypes from 'prop-types';

const ApexChart24 = ({ series, options }) => {
  const enhancedOptions = {
    ...options,
    tooltip: {
      ...options.tooltip,
      y: {
        formatter: function (val, { seriesIndex, dataPointIndex, w }) {
          const seriesName = w.globals.seriesNames[seriesIndex];
          return `${val} ${seriesName}`;
        },
      },
    },
  };

  return (
    <div>
      <div id="chart">
        <ReactApexChart options={enhancedOptions} series={series} type="bar" height={190} width={255} />
      </div>
    </div>
  );
};

ApexChart24.propTypes = {
  series: PropTypes.array.isRequired,
  options: PropTypes.object.isRequired,
};

export default ApexChart24;