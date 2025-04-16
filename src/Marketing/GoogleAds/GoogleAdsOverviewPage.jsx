import React, { useEffect, useState } from "react";
import axios from "axios";
import { Collapse, Upload, Button, message } from "antd";  // Added Upload and Button here
import { UploadOutlined } from "@ant-design/icons";  // Added for the upload icon
import "../MetaAds/Metaads.css";
import { site_url } from "../../Services/Api";
import FunnelComponent from "../../Components/Funnelcomponent";
import DailySpendRoasGraph from "../../Components/DailySpendRoasGraph";
import CampaignPieCharts from "../../Components/CampaignPieCharts";


const { Panel } = Collapse;
const { Dragger } = Upload;

const formatNumber = (num) => {
  const number = typeof num === 'string' ? parseFloat(num.replace(/,/g, '')) : num;
  if (isNaN(number)) return '0';
  if (number >= 10000) return `${(number / 1000).toFixed(1)}K`;
  return `${number.toFixed(2)}`;
};

const GoogleAdsOverviewPage = ({ }) => {
  const [googleAdsData, setGoogleAdsData] = useState([]);
  const [campaignData, setCampaignData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filteredData2, setFilteredData2] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
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
          fetch(`${site_url}/google-ads`).then(res => res.ok ? res.json() : []),
          fetch(`${site_url}/campaign-data`).then(res => res.ok ? res.json() : [])
        ]);
    
        // Ensure data is an array
        setGoogleAdsData(Array.isArray(googleAdsRes) ? googleAdsRes : []);
        setFilteredData(Array.isArray(googleAdsRes) ? googleAdsRes : []);
        
        setCampaignData(Array.isArray(campaignDataRes) ? campaignDataRes : []);
        setFilteredCampaigns(Array.isArray(campaignDataRes) ? campaignDataRes : []);
      } catch (error) {
        console.error("Error fetching Campaign Data:", error);
        // Set empty arrays on error
        setGoogleAdsData([]);
        setFilteredData([]);
        setCampaignData([]);
        setFilteredCampaigns([]);
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
  
  // const handleStartDateChange = (e) => {
  //   setStartDate(e.target.value);
  //   // setActiveFilter(null); // Reset active filter if manually selecting date
  // };

  // const handleEndDateChange = (e) => {
  //   setEndDate(e.target.value);
  //   setActiveFilter(null);
  // };

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

  // const clearFilters = () => {
  //   setStartDate("");
  //   setEndDate("");
  //   setFilters(null);
  // };

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
  const totals = filteredData.reduce(
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


  const fetchData = async () => {
    try {
      setLoading(true);
      const [googleAdsRes, campaignDataRes] = await Promise.all([
        axios.get(`${site_url}/google-ads`).then(res => res.data),
        axios.get(`${site_url}/campaign-data`).then(res => res.data)
      ]);

      setGoogleAdsData(googleAdsRes);
      setFilteredData(googleAdsRes);
      setCampaignData(campaignDataRes);
      setFilteredCampaigns(campaignDataRes);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to load data. Please upload CSV files first.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpload = async (file, endpoint) => {
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);

    try {
      const response = await axios.post(`${site_url}/${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      message.success(`${file.name} uploaded successfully`);
      fetchData(); // Refresh data after upload
      return false; // Prevent default upload behavior
    } catch (error) {
      message.error(`${file.name} upload failed: ${error.response?.data?.error || error.message}`);
      return false;
    } finally {
      setUploading(false);
    }
  };

  const uploadProps = (endpoint) => ({
    name: 'file',
    multiple: false,
    accept: '.csv',
    beforeUpload: (file) => handleUpload(file, endpoint),
    showUploadList: false,
  });


  return (
    <div className="p-4">

          {/* Upload Section */}
          
          <div className="mb-4 margin-bottom MYFILTERS">
          <Collapse>
          <Panel header="Upload CSV file" key="">     
          <h3 className="text-lg font-semibold mb-3">Upload CSV Files</h3>
        <div className="gridm">
          <div className="gridupload flex-1 border rounded-md p-4">
            <h3 className="mb-2">Google Ads Data</h3>
            <Dragger {...uploadProps('upload-google-ads')}>
              <Button icon={<UploadOutlined />} loading={uploading}>
                Click to Upload data.csv
              </Button>
            </Dragger>
            <p className="text-xs text-gray-500 mt-2">
              Should contain campaign performance data
            </p>
          </div>
          
          <div className="gridupload flex-1 border rounded-md p-4">
            <h3 className="mb-2">Campaign Data</h3>
            <Dragger {...uploadProps('upload-campaign-data')}>
              <Button icon={<UploadOutlined />} loading={uploading}>
                Click to Upload campaign.csv
              </Button>
            </Dragger>
            <p className="text-xs text-gray-500 mt-2">
              Should contain detailed campaign metrics
            </p>
          </div>

          {(!googleAdsData.length || !campaignData.length) && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800">
              No data found. Please upload both CSV files to see the dashboard.
            </p>
          </div>
        )}
        </div>
</Panel>
        </Collapse>
</div>




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
  {Array.isArray(campaignData) && 
    Array.from(new Set(campaignData.map((ad) => ad.Campaign)))
      .map((campaignId) => (
        <option key={campaignId} value={campaignId}>
          {campaignId}
        </option>
      ))
  }
</select>
              </div>

              {/* <div className="filter-item S-date">
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
              {/* <button className="clear-filter-btn" onClick={clearFilters}>
               Clear Filters
                </button> */}
            </div>
          </Panel>
        </Collapse>
      </div>

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
      <DailySpendRoasGraph data={Array.isArray(campaignData) ? campaignData : []} />
      
      </div>
      </div>
      </div>
    
      <div>
      <CampaignPieCharts campaignData={Array.isArray(filteredData2) ? filteredData2 : []} />
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


      {/* <div className="ads-list">
      <h3 className="text-lg font-bold mb-4"></h3>
      <div className="table-container overflow-auto">
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              {[
                "Day", "Campaign status", "Campaign", "Budget name", "Currency code", "Budget",
                "Budget type", "Status", "Status reasons", "Cost", "Store visits", "Avg. Daily Spent - ZS",
                "Budget Pacing %", "Campaign type", "Impr.", "Viewable rate", "Clicks", "CTR",
                "Avg. CPC", "Conversions", "Conv. rate", "Cost / conv.", "Conv. value",
                "Conv. value / cost", "Click share", "Search impr. share", "Search top IS",
                "Search abs. top IS", "Search lost IS (budget)", "Search lost top IS (budget)",
                "Search lost IS (rank)", "Search lost top IS (rank)", "Display impr. share",
                "Results", "Results value", "Impr. (Top) %"
              ].map((field) => (
                <th key={field} className="border px-4 py-2">{field}</th>
              ))}
            </tr>
          </thead>
          <tbody>
  {filteredData2.map((campaign, index) => (
    <tr key={index} className="text-center">
      <td className="border px-4 py-2">{campaign["Day"]}</td>
      <td className="border px-4 py-2">{campaign["Campaign status"]}</td>
      <td className="border px-4 py-2">{campaign["Campaign"]}</td>
      <td className="border px-4 py-2">{campaign["Budget name"]}</td>
      <td className="border px-4 py-2">{campaign["Currency code"]}</td>
      <td className="border px-4 py-2">${campaign["Budget"]}</td>
      <td className="border px-4 py-2">{campaign["Budget type"]}</td>
      <td className="border px-4 py-2">{campaign["Status"]}</td>
      <td className="border px-4 py-2">{campaign["Status reasons"]}</td>
      <td className="border px-4 py-2">${campaign["Cost"]}</td>
      <td className="border px-4 py-2">{campaign["Store visits"]}</td>
      <td className="border px-4 py-2">${campaign["Avg. Daily Spent - ZS"]}</td>
      <td className="border px-4 py-2">{campaign["Budget Pacing %"]}</td>
      <td className="border px-4 py-2">{campaign["Campaign type"]}</td>
      <td className="border px-4 py-2">{campaign["Impr."]}</td>
      <td className="border px-4 py-2">{campaign["Viewable rate"]}</td>
      <td className="border px-4 py-2">{campaign["Clicks"]}</td>
      <td className="border px-4 py-2">{campaign["CTR"]}</td>
      <td className="border px-4 py-2">${campaign["Avg. CPC"]}</td>
      <td className="border px-4 py-2">{campaign["Conversions"]}</td>
      <td className="border px-4 py-2">{campaign["Conv. rate"]}</td>
      <td className="border px-4 py-2">${campaign["Cost / conv."]}</td>
      <td className="border px-4 py-2">${campaign["Conv. value"]}</td>
      <td className="border px-4 py-2">{campaign["Conv. value / cost"]}</td>
      <td className="border px-4 py-2">{campaign["Click share"]}</td>
      <td className="border px-4 py-2">{campaign["Search impr. share"]}</td>
      <td className="border px-4 py-2">{campaign["Search top IS"]}</td>
      <td className="border px-4 py-2">{campaign["Search abs. top IS"]}</td>
      <td className="border px-4 py-2">{campaign["Search lost IS (budget)"]}</td>
      <td className="border px-4 py-2">{campaign["Search lost top IS (budget)"]}</td>
      <td className="border px-4 py-2">{campaign["Search lost IS (rank)"]}</td>
      <td className="border px-4 py-2">{campaign["Search lost top IS (rank)"]}</td>
      <td className="border px-4 py-2">{campaign["Display impr. share"]}</td>
      <td className="border px-4 py-2">{campaign["Results"]}</td>
      <td className="border px-4 py-2">{campaign["Results value"]}</td>
      <td className="border px-4 py-2">{campaign["Impr. (Top) %"]}</td>
    </tr>
  ))}
</tbody>

        </table>
      
   
      </div>
    </div> */}
    </div>
  );
};

export default GoogleAdsOverviewPage;
