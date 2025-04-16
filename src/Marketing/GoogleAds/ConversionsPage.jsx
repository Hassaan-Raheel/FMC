import React, { useEffect } from "react";
import { site_url } from "../../Services/Api";
const MetaVsGooglePage = ({ setPageTitle }) => {
  useEffect(() => {
    setPageTitle("Traffic & Audience");
  }, [setPageTitle]);

  return (
    <div>
      <h2>CONVERSIONS</h2>
      <p>Here you can analyze traffic and audience insights for Google Ads.</p>
    </div>
  );
};

export default MetaVsGooglePage;
