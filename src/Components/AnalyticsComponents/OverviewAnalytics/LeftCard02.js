import React from 'react';
import './AnalyticsOverviewCard.css';
import GoogleDonutChart from '../../UI-Controls/Charts/DonutChart/DonutGChart';

const BestCategories = ({ data, loading }) => {
  
  return (
    <div className="Categories-Main-Container">
      <GoogleDonutChart data={data} title="Daily Activities Breakdown" loading={loading} />
    </div>
  );
};

export default BestCategories;
