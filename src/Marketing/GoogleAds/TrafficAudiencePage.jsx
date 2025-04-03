import React, { useEffect } from "react";
import { site_url } from "../../../env";

const TrafficAudiencePage = ({ setPageTitle }) => {
  useEffect(() => {
    setPageTitle("Traffic & Audience");
  }, [setPageTitle]);

  return (
    <div>
      <h2>Traffic & Audience</h2>
      <p>Here you can analyze traffic and audience insights for Google Ads.</p>
    </div>
  );
};

export default TrafficAudiencePage;
