import React, { useEffect, useState } from "react";
import axios from "axios";
import { Collapse } from "antd";
import "../MetaAds/Metaads.css";
import FunnelComponent from "../../Components/Funnelcomponent";
import DailySpendRoasGraph from "../../Components/DailySpendRoasGraph";
import CampaignPieCharts from "../../Components/CampaignPieCharts";
import CampaignCostChart from "../../Components/CampaignCostChart";
import CampaignDetailsPieCharts from "../../Components/DetailCampaignPieChart";
import { site_url } from "../../../env";

const { Panel } = Collapse;
const formatNumber = (num) => {
  if (num >= 10000) {
    return `${(num / 1000).toFixed(1)}K`; // Convert to K format with 1 decimal
  }
  return `${num.toFixed(2)}`; // Keep normal format if less than 1000
};
const CampaignDetailsPage = ({ setPageTitle }) => {
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
    setPageTitle("Campaigns Details");

    const fetchCampaignData = async () => {
      try {
        const [googleAdsRes, campaignDataRes] = await Promise.all([
          fetch(`${site_url}/google-ads`).then((res) => res.json()),
          fetch(`${site_url}/campaign-data`).then((res) => res.json()),
        ]);

        console.log("Google Ads Data:", googleAdsRes);
        console.log("Campaign Data:", campaignDataRes);

        setGoogleAdsData(googleAdsRes);
        setFilteredData(googleAdsRes);

        setCampaignData(campaignDataRes);
        setFilteredCampaigns(campaignDataRes);
      } catch (error) {
        console.error("Error fetching Campaign Data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignData();
  }, [setPageTitle]);




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

  


const campaignTypes = ["Search", "Performance Max", "Shopping", "Display"];
  // Calculate Totals
  const totals = filteredData.reduce(
    (acc, campaign) => {
      acc.totalClicks += parseInt((campaign.Clicks || "0").replace(/,/g, ""));
      acc.totalImpressions += parseInt((campaign["Impr."] || "0").replace(/,/g, ""));
      acc.totalCost += parseFloat(campaign.Cost || 0);
      acc.totalConval += parseFloat(campaign["Conv. value"] || 0);
      acc.totalCTR += parseFloat(campaign.CTR.replace("%", "") || 0);
      acc.totalRoas += parseFloat(campaign["Conv. value / cost"] || 0);
      acc.totalconvrate += parseFloat(campaign["Conv. rate"].replace("%", "") || 0);
      // Count total campaigns
      acc.totalCampaigns++;
  
      // Check if campaign is active
      if (campaign["Campaign state"] === "Enabled") {
        acc.totalActiveCampaigns++;
  
        // Count campaign types
        acc.campaignTypeCounts[campaign["Campaign type"]] =
          (acc.campaignTypeCounts[campaign["Campaign type"]] || 0) + 1;
      }
  
      return acc;
    },
    {
      totalClicks: 0,
      totalImpressions: 0,
      totalCost: 0,
      totalCTR: 0,
      totalConval: 0,
      totalRoas: 0,
      totalconvrate: 0,
      totalCampaigns: 0,
      totalActiveCampaigns: 0,
      campaignTypeCounts: {},
      
       // Stores counts of different campaign types
    }
    
    
    
  );
  campaignTypes.forEach(type => {
    if (!(type in totals.campaignTypeCounts)) {
      totals.campaignTypeCounts[type] = 0;
    }
  });
  
  const total2 = filteredData2.reduce(
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
  console.log("Total Campaigns:", totals.totalCampaigns);
console.log("Total Active Campaigns:", totals.totalActiveCampaigns);
console.log("Campaigns by Type:", totals.campaignTypeCounts);
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

  const campaignCostData = campaignTypes.map((type) => {
    const totalCost = filteredData
      .filter((campaign) => campaign["Campaign type"] === type)
      .reduce((sum, campaign) => sum + parseFloat(campaign.Cost || 0), 0);
  
    return { type, cost: totalCost };
  });
  


  return (
    
    <div className="p-4">


      {/* Filters */}
      <div className="mb-4 MYFILTERS">
        <Collapse>
          <Panel header="All Filters" key="1">
            <div className="filter-container">
              <div className="filter-item Camp-id">
                <label>Campaign ID:</label>
                <select
                  value={filters.campaignId}
                  onChange={(e) => handleFilterChange("campaignId", e.target.value)}
                  className="p-2 border rounded-md"
                >
                  <option value="">All campaigns</option>
                  {Array.from(new Set(campaignData.map((ad) => ad.Campaign))).map((campaignId) => (
                    <option key={campaignId} value={campaignId}>
                      {campaignId}
                    </option>
                  ))}
                </select>
              </div>
{/* 
              <div className="filter-item S-date">
                <label>Start Date:</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange("startDate", e.target.value)}
                  className="p-2 border rounded-md"
                />
              </div>

              <div className="filter-item E-date">
                <label>End Date:</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange("endDate", e.target.value)}
                  className="p-2 border rounded-md"
                />
              </div> */}

              <div className="filter-item">
                <label>Status:</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="p-2 border rounded-md"
                >
                  <option value="">Select Status</option>
                  <option value="enabled">Enabled</option>
                  <option value="paused">Paused</option>
                </select>
              </div>

              {/* <div className="filter-item">
                <label>Duration</label>
                <select
                  onChange={(e) => handleFilterChange("dateRange", e.target.value)}
                  className="p-2 border rounded-md"
                >
                  <option value="">Select Duration</option>
                  <option value="today">Today</option>
                  <option value="last7">Last 7 Days</option>
                  <option value="last30">Last 30 Days</option>
                </select>
              </div> */}
            </div>
          </Panel>
        </Collapse>
      </div>

      {/* Total Summary */}
      <div className="total">
      <div className="total-details p-4 border border-gray-300 rounded-md shadow-sm">
        <h3 className="text-lg ">Campaign Details</h3>
        <div className="gridcamp mb-2">
        <p>Active Campaigns<strong>{totals.totalActiveCampaigns}</strong> </p>
        <p>Search Campaigns<strong>{totals.campaignTypeCounts["Search"] || 0}</strong> </p>
          <p>P-Max Campaigns <strong>{totals.campaignTypeCounts["Performance Max"]}</strong></p>
          <p>Shopping Campaigns<strong>{totals.campaignTypeCounts["Shopping"]}</strong> </p>
          <p>Dsiplay Campaigns<strong>{totals.campaignTypeCounts["Display"]}</strong> </p>
        </div>
       
      </div>
      </div>

      <div className="grid1">

     <CampaignCostChart data={filteredData2} />
 </div>
  
      
  
 <div className="">
     
      <CampaignDetailsPieCharts campaignData={filteredData2} />
      </div>
   
      {/* Table */}
      <div className="ads-list">
        <div className="table-container overflow-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Campaign</th>
            <th className="border px-4 py-2">Campaign Type</th>
            <th className="border px-4 py-2">Clicks</th>
            <th className="border px-4 py-2">Impressions</th>
            <th className="border px-4 py-2">Cost</th>
            <th className="border px-4 py-2">CTR</th>
          </tr>
        </thead>
        <tbody>
          {googleAdsData.map((campaign) => (
            <tr key={campaign.Campaign} className="border border-gray-300 hover:bg-gray-100">
              <td className="border px-4 py-2">{campaign.Campaign}</td>
              <td className="border px-4 py-2">{campaign["Campaign type"]}</td>
              <td className="border px-4 py-2">{campaign.Clicks}</td>
              <td className="border px-4 py-2">{campaign["Impr."]}</td>
              <td className="border px-4 py-2">${campaign.Cost}</td>
              <td className="border px-4 py-2">{campaign.CTR}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      </div>

  
     
    </div>
  );
};

export default CampaignDetailsPage;
