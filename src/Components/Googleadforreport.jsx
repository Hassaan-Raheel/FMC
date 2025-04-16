import React, { useEffect, useState } from "react";
import axios from "axios";
import { Collapse } from "antd";
import '../Marketing/MetaAds/Metaads.css'; 
import FunnelComponent from "./Funnelcomponent";
import DailySpendRoasGraph from "./DailySpendRoasGraph";
import CCampaignPieChart2 from "./CCampaignPieChart2";
import CampaignPieCharts from "./CampaignPieCharts";
import { site_url } from "../Services/Api";
const { Panel } = Collapse;
const formatNumber = (num) => {
  // Convert to number if it's a string
  const number = typeof num === 'string' ? parseFloat(num.replace(/,/g, '')) : num;
  
  // Handle NaN, null, or undefined cases
  if (typeof number !== 'number' || isNaN(number)) {
    return '0';
  }

  if (number >= 10000) {
    return `${(number / 1000).toFixed(1)}K`; // Convert to K format with 1 decimal
  }
  return `${number.toFixed(2)}`; // Keep normal format if less than 1000
};
const Googleadforreport = () => {
  // Initialize filteredData2 as empty array
  const [googleAdsData, setGoogleAdsData] = useState([]);
  const [campaignData, setCampaignData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filteredData2, setFilteredData2] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    campaignId: "",
    startDate: "",
    endDate: "",
    status: "",
    dateRange: "",
  });

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const [googleAdsRes, campaignDataRes] = await Promise.all([
          fetch(`${site_url}/google-ads`).then(res => {
            if (!res.ok) throw new Error('Failed to fetch google ads');
            return res.json();
          }),
          fetch(`${site_url}/campaign-data`).then(res => {
            if (!res.ok) throw new Error('Failed to fetch campaign data');
            return res.json();
          }),
        ]);

        // Ensure the responses are arrays
        const safeGoogleAdsRes = Array.isArray(googleAdsRes) ? googleAdsRes : [];
        const safeCampaignDataRes = Array.isArray(campaignDataRes) ? campaignDataRes : [];

        setGoogleAdsData(safeGoogleAdsRes);
        setFilteredData(safeGoogleAdsRes);
        setCampaignData(safeCampaignDataRes);
        setFilteredCampaigns(safeCampaignDataRes);
        setFilteredData2(safeCampaignDataRes); // Initialize filteredData2
      } catch (error) {
        console.error("Error fetching Campaign Data:", error);
        // Set empty arrays on error
        setGoogleAdsData([]);
        setFilteredData([]);
        setCampaignData([]);
        setFilteredCampaigns([]);
        setFilteredData2([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignData();
  }, []);



  // Handle Filter Change
  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  // Apply Filters
  useEffect(() => {
    let filtered = googleAdsData;
    if (filters.campaignId) {
      filtered = filtered.filter((campaign) => campaign.Campaign.includes(filters.campaignId));
    }

    if (filters.status) {
      filtered = filtered.filter((campaign) => campaign["Campaign state"].toLowerCase() === filters.status);
    }

    if (filters.dateRange) {
      const today = new Date();
      let startDate = new Date();

      if (filters.dateRange === "today") {
        startDate = today;
      } else if (filters.dateRange === "last7") {
        startDate.setDate(today.getDate() - 7);
      } else if (filters.dateRange === "last30") {
        startDate.setDate(today.getDate() - 30);
      }

      filtered = filtered.filter((campaign) => {
        const campaignDate = new Date(campaign["Start Date"]);
        return campaignDate >= startDate && campaignDate <= today;
      });
    }

    if (filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);

      filtered = filtered.filter((campaign) => {
        const campaignDate = new Date(campaign["Start Date"]);
        return campaignDate >= start && campaignDate <= end;
      });
    }

    setFilteredData(filtered);
  }, [filters, googleAdsData]);


  useEffect(() => {
    let filtered = campaignData;
  
    if (filters.campaignId) {
      filtered = filtered.filter((campaign) => campaign["Campaign"] === filters.campaignId);
    }
  
    if (filters.status) {
      filtered = filtered.filter((campaign) => 
        campaign["Campaign status"]?.toLowerCase() === filters.status.toLowerCase()
      );
    }
  
    if (filters.startDate || filters.endDate) {
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;
  
      filtered = filtered.filter((campaign) => {
        const campaignDate = new Date(campaign["Day"]);
        return (!startDate || campaignDate >= startDate) && (!endDate || campaignDate <= endDate);
      });
    }
  
    setFilteredData2(filtered);
  }, [filters, campaignData]);

  



  // Calculate Totals
  const totals = filteredData?.reduce(
    (acc, campaign) => {
      acc.totalClicks += parseInt((campaign.Clicks || "0").replace(/,/g, ""));
      acc.totalImpressions += parseInt((campaign["Impr."] || "0").replace(/,/g, ""));
      acc.totalCost += parseFloat(campaign.Cost || 0);
      acc.totalConval += parseFloat(campaign["Conv. value"] || 0);
      acc.totalCTR += parseFloat(campaign.CTR.replace("%", "") || 0);
      acc.totalRoas += parseFloat(campaign["Conv. value / cost"] || 0);
      acc.totalconvrate += parseFloat(campaign["Conv. rate"].replace("%", "") || 0);
      
      return acc;
    },
    {
      totalClicks: 0,
      totalImpressions: 0,
      totalCost: 0,
      totalCTR: 0,
      totalConval:0,
      totalRoas:0,
      totalconvrate:0,
    }
  );
 
  
  const total2 = (filteredData2 || []).reduce(
    (acc, campaign) => {
      const imptop = campaign["Impr. (Top) %"]
        ? parseFloat(campaign["Impr. (Top) %"].replace(/,/g, "")) || 0
        : 0;
  
      const impshare = campaign["Search impr. share"]
        ? parseFloat(campaign["Search impr. share"]) || 0
        : 0;
  
      acc.totalimptop += imptop;
      acc.totalimpshare += impshare;
  
      return acc;
    },
    {
      totalimptop: 0,
      totalimpshare: 0,
    }
  );
  
  // Applying the format
  const formattedTotalImpTop = formatNumber(total2.totalimptop);
  const formattedTotalImpShare = formatNumber(total2.totalimpshare);
  
  console.log(formattedTotalImpTop); // Example output: "$17.8K"
  console.log(formattedTotalImpShare);

  // Calculate Average CPC and CTR
  const avgCPC = totals.totalCost / (totals.totalClicks || 1);
  const avgCTR = totals.totalCTR / (filteredData.length || 1);
  const Roas = totals.totalRoas * 100;
  const avgcost = totals.totalCost / 30;



  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }



  
  const totalImpressions = filteredData.reduce(
    (sum, c) => sum + parseInt((c["Impr."] || "0").replace(/,/g, "")),
    0
  );
  const totalClicks = filteredData.reduce(
    (sum, c) => sum + parseInt((c["Clicks"] || "0").replace(/,/g, "")),
    0
  );
  const totalImprtop = filteredData2.reduce(
    (sum, c) => sum + parseInt((c["Impr. (Top) %"] || "0").replace(/,/g, "")),
    0
  );
  const totalCost = filteredData.reduce((sum, c) => sum + parseFloat(c["Cost"] || 0), 0);
  const totalConversions = filteredData.reduce((sum, c) => sum + (parseInt(c["Conv. value"]) || 0), 0);
  
  // Calculate Metrics
  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) + "%" : "0%";
  const avgCpc = totalClicks > 0 ? `$${(totalCost / totalClicks).toFixed(2)}` : "$0.00";
  const conversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) + "%" : "0%";
  const costPerConversion = totalConversions > 0 ? `$${(totalCost / totalConversions).toFixed(2)}` : "$0.00";
  
  const funnelData = [
    {
      name: "Visibility",
      value: totalImpressions,
      color: "#E53935",
      metrics: [
        { Impressions: totalImpressions, Cost: parseFloat(totalCost)},
      ],
    },
    {
      name: "Engagement",
      value: totalClicks,
      color: "#1E88E5",
      metrics: [
        {  Clicks: totalClicks, Cost: parseFloat(totals.totalCost) },
      ],
    },
    {
      name: "Conversion",
      value: totalConversions,
      color: "#1976D2",
      metrics: [
        { Conversions: totalConversions, ConvRate: parseFloat(totals.totalconvrate), CostPerConv: parseFloat(costPerConversion.replace("$", "")) },
      ],
    },
  ];

  return (
    <div className="p-4">

      {/* Total Summary */}
      <div className="total">
      <div className="total-details p-4 border border-gray-300 rounded-md shadow-sm">
        <h3 className="text-lg ">Total Google Ad Performance</h3>
        <div className="grid2 mb-2">
        <p>Amount Spend<strong>${formatNumber(totals.totalCost.toFixed(2))}</strong> </p>
        <p>Impressions<strong>{formatNumber(totals.totalImpressions)}</strong> </p>
          <p>Clicks <strong>{totals.totalClicks}</strong></p>
          <p>CPC<strong>${avgCPC.toFixed(2)}</strong> </p>
          <p>CTR<strong>{avgCTR.toFixed(2)}%</strong> </p>
        </div>
      </div>
      </div>

      <div className="gridm">
      <div className="Revenue border border-gray-300 rounded-md shadow-sm">
        <h3 className="text-lg ">REVENUE</h3>
        <div className="hoverline1 grid5 mb-2">
          <div className="grid10">
        <p>Total Conv. Value<br/><strong>${totals.totalConval.toFixed(2)}</strong> </p>
        </div>
        
        <div className="grid10">
        <p>ROAS<br/><strong>{totals.totalRoas.toFixed(2)}%</strong> </p>
        </div>
        </div>
        
      </div>
      <div className="Amount border border-gray-300 rounded-md shadow-sm">
        <h3 className="text-lg ">AMOUNT SPENT</h3>
        <div className=" hoverline2 grid5 mb-2">
          <div className="grid10">
        <p>COST<br/><strong>${formatNumber(totals.totalCost.toFixed(2))}</strong> </p>
       
        </div>
       

        <div className="grid10">
        <p>Avg Cost/Day<br/><strong>{avgcost.toFixed(2)}</strong> </p>
        </div>
        </div>
      </div>
     
      <div className=" border border-gray-300 rounded-md shadow-sm">

        <div className="space">


        <div className="grid6 color1 mb-2">
        <p>Impressions<br/><strong>{formatNumber(totalImpressions)}</strong> </p>
        <p>Search Imp. Share<br/><strong>{total2.totalimpshare.toFixed(2)}</strong> </p>
          <p>Impression (Top) <br/><strong>{total2.totalimptop.toFixed(2)}</strong></p>
    
      </div>
      
        <div className="grid6  color2 mb-2">
        <p>Clicks<br/><strong>{totals.totalClicks}</strong> </p>
        <p>CTR<br/><strong>{totals.totalCTR.toFixed(2)}%</strong> </p>
          <p>Avg CPC <br/><strong>{avgCPC.toFixed(2)}$</strong></p>
    
      </div>
       <div className=" border  border-gray-300 rounded-md shadow-sm">

        <div className="grid6 color3 mb-2">
        <p>Conversion<br/><strong>{totals.totalConval.toFixed(2)}</strong> </p>
        <p>Conv. rate<br/><strong>{totals.totalconvrate}</strong> </p>
          <p>Cost/Conv <br/><strong>{totals.totalRoas}</strong></p>
        </div>
      </div>
   
      </div>
        
      </div>
      <div className=" border border-gray-300 rounded-md shadow-sm">
      <FunnelComponent funnelData={funnelData} />
        </div>
      </div>

      
      <div className="grid1">
      <div className="grid1">
      <div className=" border border-gray-300 rounded-md shadow-sm">
      <DailySpendRoasGraph data={campaignData} />
      
      </div>
      </div>
      </div>
    
      <div>
      <CampaignPieCharts campaignData={filteredData2} />
      </div>
   
      {/* Table */}
      <div className="ads-list">
  <div className="table-container overflow-auto">
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          {/* Set specific widths for each column */}
          <th className="border px-4 py-2 w-[150px] whitespace-nowrap overflow-hidden truncate">Campaign</th>
          <th className="border px-4 py-2 w-[120px]">Campaign Type</th>
          <th className="border px-4 py-2 w-[80px]">Clicks</th>
          <th className="border px-4 py-2 w-[100px]">Impressions</th>
          <th className="border px-4 py-2 w-[80px]">Cost</th>
          <th className="border px-4 py-2 w-[80px]">CTR</th>
          <th className="border px-4 py-2 w-[80px]">Avg CPC</th>
          <th className="border px-4 py-2 w-[100px]">Conversions</th>
          <th className="border px-4 py-2 w-[120px]">Cost Per Conversions</th>
        </tr>
      </thead>
      <tbody>
        {googleAdsData.map((campaign) => (
          <tr key={campaign.Campaign} className="border border-gray-300 hover:bg-gray-100">
            {/* Apply the same widths to the corresponding <td> elements */}
            <td className="border px-4 py-2 w-[150px] whitespace-nowrap overflow-hidden truncate">{campaign.Campaign}</td>
            <td className="border px-4 py-2 w-[120px]">{campaign["Campaign type"]}</td>
            <td className="border px-4 py-2 w-[80px]">{campaign.Clicks}</td>
            <td className="border px-4 py-2 w-[100px]">{campaign["Impr."]}</td>
            <td className="border px-4 py-2 w-[80px]">${campaign.Cost}</td>
            <td className="border px-4 py-2 w-[80px]">{campaign.CTR}</td>
            <td className="border px-4 py-2 w-[80px]">{campaign["Avg. CPC"]}</td>
            <td className="border px-4 py-2 w-[100px]">{campaign.Conversions}</td>
            <td className="border px-4 py-2 w-[120px]">{campaign["Cost / conv."]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

      <div>
      {/* Filters */}
</div>
      
    </div>
  );
};

export default Googleadforreport;
