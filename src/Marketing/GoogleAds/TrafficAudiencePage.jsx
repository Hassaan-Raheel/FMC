import React, { useEffect } from "react";
import { site_url } from "../../Services/Api";

const TrafficAudiencePage = ({  }) => {
  useEffect(() => {
    setPageTitle("Traffic & Audience");
  }, []);

  return (
    <div>
      <h2>Traffic & Audience</h2>
      <p>Here you can analyze traffic and audience insights for Google Ads.</p>
    </div>
  );
};

export default TrafficAudiencePage;
