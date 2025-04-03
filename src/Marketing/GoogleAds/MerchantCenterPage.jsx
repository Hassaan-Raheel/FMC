import React, { useEffect } from "react";
import { site_url } from "../../../env";

const MerchantCenterPage = ({ setPageTitle }) => {
  useEffect(() => {
    setPageTitle("Traffic & Audience");
  }, [setPageTitle]);

  return (
    <div>
      <h2>MERCHANT CENTER PAGE</h2>
      <p>Here you can analyze traffic and audience insights for Google Ads.</p>
    </div>
  );
};

export default MerchantCenterPage;
