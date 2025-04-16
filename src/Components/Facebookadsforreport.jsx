import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import '../Marketing/MetaAds/Metaads.css'; // Assuming the CSS is imported here or globally
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FaThumbsUp, FaEye, FaShareAlt, FaMoneyBillWave, FaPlayCircle } from 'react-icons/fa'; // Example icons from react-icons
import { site_url } from "../Services/Api";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css"; 
import { Collapse } from "antd";
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
const formatNumber = (num) => {
  if (num >= 10000) {
    return `${(num / 1000).toFixed(1)}K`; // Convert to K format with 1 decimal
  }
  return `${num.toFixed(2)}`; // Keep normal format if less than 1000
};
const { Panel } = Collapse;
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];


const Facebookadsforreport = ({ setMetaAdCount }) => {
  const [selectedAd, setSelectedAd] = useState(null); // Add this state
  const [metaAds, setMetaAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false); // To manage the dropdown state
  const [filters, setFilters] = useState({
    status: "",
    campaignId: "",
    campaignName: "",
    adId: "",
    adSetId: "",
    startDate: "",  // Start date filter
    endDate: "",    // End date filter
    dateRange: "",  // Predefined date range filter
  });

  useEffect(() => {
    axios
      .get(`${site_url}/saved-meta-ads`)
      .then((response) => {
        const filteredAds = response.data.ads_data.filter(
          (ad) => ad.insights && ad.insights !== "No insights available" && ad.insights.length > 0  &&
          ad.insights.length > 0 &&
          !(ad.name && ad.name.startsWith("Instagram post:"))
        );
        setMetaAds(filteredAds || []);
        setMetaAdCount(filteredAds.length);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Meta Ads data:", error);
        setLoading(false);
      });
  }, [ setMetaAdCount]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
  };

  const filteredMetaAds = metaAds.filter((ad) => {
    const lowercasedSearch = search.toLowerCase();
    const matchesName = ad.name.toLowerCase().includes(lowercasedSearch);
    let matchesFilter = true;

    if (filters.status) {
      matchesFilter = ad.status.toLowerCase().includes(filters.status.toLowerCase());
    }
    if (filters.campaignId) {
      matchesFilter = ad.campaign_id.toLowerCase().includes(filters.campaignId.toLowerCase());
    }
    if (filters.campaignName) {
      matchesFilter = ad.campaign_name.toLowerCase().includes(filters.campaignName.toLowerCase());
    }
    if (filters.adId) {
      matchesFilter = ad.id.toLowerCase().includes(filters.adId.toLowerCase());
    }
    if (filters.adSetId) {
      matchesFilter = ad.adset_id.toLowerCase().includes(filters.adSetId.toLowerCase());
    }

    // Date filter
    if (filters.startDate && filters.endDate) {
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);

      const adStartDate = new Date(ad.insights[0]?.date_start);
      const adEndDate = new Date(ad.insights[0]?.date_stop);

      matchesFilter = adStartDate >= startDate && adEndDate <= endDate;
    }

    // Handle predefined date ranges (Today, Last 7 days, etc.)
    if (filters.dateRange) {
      const today = new Date();
      let startDate = new Date();
      let endDate = new Date();

      switch (filters.dateRange) {
        case "today":
          startDate = new Date(today.setDate(today.getDate()));
          endDate = new Date(today.setDate(today.getDate()));
          break;
        case "last7":
          startDate = new Date(today.setDate(today.getDate() - 7));
          break;
        case "last30":
          startDate = new Date(today.setDate(today.getDate() - 30));
          break;
        default:
          break;
      }

      const adStartDate = new Date(ad.insights[0]?.date_start);
      const adEndDate = new Date(ad.insights[0]?.date_stop);

      matchesFilter = adStartDate >= startDate && adEndDate <= endDate;
    }

    return matchesName && matchesFilter;
  });
  const iconMapping = {
    impressions: "fas fa-eye",
    clicks: "fas fa-mouse-pointer",
    ctr: "fas fa-chart-line",
    spend: "fas fa-dollar-sign",
    reach: "fas fa-users",
    video_views: "fas fa-play-circle",
  };
  

  const renderAdDetails = (ad) => {
    const startDate =
      ad.insights && ad.insights.length > 0 ? ad.insights[0].date_start : "N/A";
    const endDate =
      ad.insights && ad.insights.length > 0 ? ad.insights[0].date_stop : "N/A";

    return (
      
      <div key={ad.id} className="card2 p-2 border border-gray-300 rounded-md shadow-sm">
      
        {/* <div className="dates mb-2 flex space-x-4"> 
          <p className="campaign-status1 text-sm font-semibold mb1">
            <strong>Date: </strong> {startDate}
          </p>
          <p className="campaign-status1 text-sm font-semibold mb1">
           TO
          </p>
          <p className="campaign-status1 text-sm font-semibold mb1">
             {endDate}
          </p>
        </div> */}

        <p className="ad-title text-sm font-semibold mb-1"><strong>Campaign Name:</strong> {ad.name}</p>
        <p className="campaign-name text-xs">
          <strong>Campaign ID:</strong> {ad.campaign_id}
        </p>
        <p className="campaign-status text-xs">
          <strong>Status:</strong> {ad.status}
        </p>
       
        
        <div className="insights max-h-40 overflow-auto border-t mt-2 pt-2">
  {ad.insights && ad.insights.length > 0 ? (
    <div className="gridmain">
      {Object.entries(ad.insights[0]).map(([key, value]) => (
        key !== "cpm" &&
        key !== "frequency" &&
        key !== "date_start" &&
        key !== "date_stop" &&
        key !== "campaign_name" &&
        key !== "video_play_actions" && (
          <div key={key} className="box">
            <div className="info-container">
              <div className="text-section">
                <p className="label text-xs font-medium">
                  {key.replace(/_/g, " ").toUpperCase()}:
                </p>
                <p className="value text-xs">
                  {value === "0" || !value ? "N/A" : value}
                </p>
              </div>
              <div className="icon-container">
                <i className={iconMapping[key] || "fas fa-info-circle"}></i>
              </div>
            </div>
          </div>
        )
      ))}
      {ad.insights[0].video_play_actions && ad.insights[0].video_play_actions.length > 0 && (
        <div className="video-box">
          <p className="label text-xs font-medium">Video Views:</p>
          <p className="value text-xs">{ad.insights[0].video_play_actions[0].value}</p>
          <i className="fas fa-play-circle"></i>
        </div>
      )}
    </div>
  ) : (
    <p className="no-insights text-xs">No insights available</p>
  )}
</div>
      </div>
    );
  };
  const renderAdDetailsTable = () => {
    if (filteredMetaAds.length === 0) {
      return <p className="text-sm text-gray-500">No data available</p>;
    }
  
    return (
      <div className="table-container overflow-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border border-gray-300 p-2">Campaign Name</th>
              {Object.keys(iconMapping).map((key) => (
                <th key={key} className="border border-gray-300 p-2">
                  {key.replace(/_/g, " ").toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredMetaAds.map((ad) => (
              <tr key={ad.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{ad.name}</td>
                {Object.keys(iconMapping).map((key) => (
                  <td key={key} className="border border-gray-300 p-2 text-center">
                    {ad.insights?.[0]?.[key] ? (
                      <>
                        {ad.insights[0][key]}
                        <i className={`ml-2 ${iconMapping[key]}`} />
                      </>
                    ) : (
                      "N/A"
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const aggregateAdData = (ads) => {
    const aggregatedData = {
      totalSpend: 0,
      totalImpressions: 0,
      totalClicks: 0,
      totalCpm: 0,
      totalCtr: 0,
      totalCpc: 0,
    };
  
    ads.forEach((ad) => {
      aggregatedData.totalSpend += parseFloat(ad.insights[0]?.spend || 0);
      aggregatedData.totalImpressions += parseInt(ad.insights[0]?.impressions || 0);
      aggregatedData.totalClicks += parseInt(ad.insights[0]?.clicks || 0);
      aggregatedData.totalCpm += parseInt(ad.insights[0]?.cpm || 0);
      aggregatedData.totalCtr += parseFloat(ad.insights[0]?.ctr || 0);
      aggregatedData.totalCpc += parseFloat(ad.insights[0]?.cpc || 0);
    });
  
    if (ads.length > 0) {
      aggregatedData.totalCpm = aggregatedData.totalSpend / aggregatedData.totalImpressions;
    }
    if (ads.length > 0) {
      aggregatedData.totalCpc = aggregatedData.totalSpend / aggregatedData.totalClicks;
    }
    if (ads.length > 0) {
      aggregatedData.totalCtr = aggregatedData.totalClicks / aggregatedData.totalImpressions;
    }
  
    return aggregatedData;
  };
  
  const renderTotalDetails = () => {
    const aggregatedData = aggregateAdData(filteredMetaAds);
  
    return (
      <div className="total-details p-4 border border-gray-300 rounded-md shadow-sm">
        <h3 className="text-lg ">Facebook Ad Performance</h3>
        <div className="grid2 mb-2">
          <p>Amount Spend<strong> ${aggregatedData?.totalSpend.toFixed(2)}</strong></p>
          <p>Impressions<strong>{aggregatedData?.totalImpressions}</strong> </p>
          <p>Clicks<strong>{aggregatedData?.totalClicks}</strong></p>
          <p>CPM<strong>${aggregatedData?.totalCpm.toFixed(2)}</strong> </p>
          <p>CTR<strong>{aggregatedData?.totalCtr.toFixed(2)}%</strong></p>
          <p>CPC<strong>${aggregatedData?.totalCpc.toFixed(2)}</strong></p>
        </div>
      </div>
    );
  };
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  const chartData = filteredMetaAds.map((ad) => {
    const insights = ad.insights[0] || {};  // Ensure the first insight exists, default to empty object
    const campaignId = ad.campaign_id || "Unknown";  // Access campaign_id directly from the ad object
  
    return {
      Id: campaignId,  // Correct campaignId from ad object
      spend: parseFloat(insights.spend || 0),
      reach: parseInt(insights.reach || 0),
      impressions: parseInt(insights.impressions || 0),
      clicks: parseInt(insights.clicks || 0),
      cpc: parseFloat(insights.cpc || 0),
      cpm: parseFloat(insights.cpm || 0),
      ctr: parseFloat(insights.ctr || 0),
    };
  });

  const groupByBreakdown = (ads, breakdownType) => {
    const groupedData = {};
  
    ads.forEach((ad) => {
      const breakdownData = ad.breakdown_insights?.[breakdownType];
  
      if (Array.isArray(breakdownData)) {
        breakdownData.forEach((data) => {
          const category = data[breakdownType] || "Unknown";
  
          if (!groupedData[category]) {
            groupedData[category] = {
              [breakdownType]: category,
              reacha: 0,
              impressionsa: 0,
              clicka: 0,
              campaigns: [],
            };
          }
  
          groupedData[category].reacha += parseInt(data.reach || 0);
          groupedData[category].impressionsa += parseInt(data.impressions || 0);
          groupedData[category].clicka += parseInt(data.clicks || 0);
          groupedData[category].campaigns.push(ad.adset_id || "Unknown");
        });
      }
    });
  
    return Object.values(groupedData);
  };
  

  // Generate grouped data for different breakdown types
  const chartDataAge =  groupByBreakdown(filteredMetaAds, "age");
  const chartDataRegion = groupByBreakdown(filteredMetaAds, "region");
  const chartDataDevice = groupByBreakdown(filteredMetaAds, "device_platform");
  const chartDataGender = groupByBreakdown(filteredMetaAds, "gender");
  const topRegions = chartDataRegion
    .sort((a, b) => b.impressionsa - a.impressionsa) // Sort in descending order
    .slice(0, 6); // Take the top 6



    
  return (
    <div className="p-4">
      <div className="total">
        {filteredMetaAds.length > 0 ? renderTotalDetails() : <p>No Meta Ads found</p>}
      </div>
<div className="grid22">
      {/* Graphs Section */}
      <h3 className="text-lg">Ads Performance Chart</h3>
      <div className="gridmain grid-cols-1 md:grid-cols-2 gap-6">
        <div className="grid1 grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Reach vs Total Impressions */}
          <div className="chart-container">
            <h3 className="text-lg font-medium mb-2">Reach vs Impressions</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="reach" fill="#8884d8" name="Reach" />
                <Bar dataKey="impressions" fill="#82ca9d" name="Impressions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid1 grid-cols-1 md:grid-cols-2 gap-6">
          {/* CPM vs CTR */}
          <div className="chart-container">
            <h3 className="text-lg font-medium mb-2">CPM vs CTR</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cpm" fill="#ffc658" name="CPM" />
                <Bar dataKey="ctr" fill="#ff7f50" name="CTR" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
      </div>

      <div className="grid3 grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Spending vs Total Clicks */}
        <div className="chart-container">
          <h3 className="text-lg font-medium mb-2">Amount Spend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="spend" fill="#a29bfe" name="Total Spend" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Total Spending vs CPC */}
        <div className="chart-container">
          <h3 className="text-lg font-medium mb-2">Impressions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="impressions" fill="#fcbf49" name="Impressions" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3 className="text-lg font-medium mb-2">Click</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="clicks" fill="#ff7f50" name="Clicks" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3 className="text-lg font-medium mb-2">CPC</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cpc" fill="#82ca9d" name="CPC" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      </div>
<div className="grid22">  
        <h3 className="text-lg mb-0 mt-0">Statistics</h3>
         
         <div className="tab-container1">
            <Tabs>
              <TabList className="tab-list">
                <Tab className="tab">Age</Tab>
                <Tab className="tab">Region</Tab>
                <Tab className="tab">Devices</Tab>
                <Tab className="tab">Genders</Tab>
              </TabList>
      
              <TabPanel className="gridmain">
                <div className="gridmain tab-panel-content">
                  <div className="grid1"> 
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartDataAge}
                        dataKey="impressionsa"
                        nameKey="age"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                      >
                        {chartDataAge.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  </div>
                  <div className="grid1"> 
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartDataAge}>
                      <XAxis dataKey="age" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="reacha" fill="#8884d8" name="Reach" />
                      <Bar dataKey="impressionsa" fill="#82ca9d" name="Impressions" />
                      <Bar dataKey="clicka" fill="#8884d8" name="Clicks" />
                    </BarChart>
                  </ResponsiveContainer></div>
                </div>
      
              </TabPanel>
      
              <TabPanel>
                <div className="gridmain tab-panel-content">
                  <div className="grid1"> 
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={topRegions}
                        dataKey="impressionsa"
                        nameKey="region"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                      >
                        {topRegions.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  </div>
                  <div className="grid1"> 
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topRegions}>
                      <XAxis dataKey="region" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="reacha" fill="#8884d8" name="Reach" />
                      <Bar dataKey="impressionsa" fill="#82ca9d" name="Impressions" />
                      <Bar dataKey="clicka" fill="#8884d8" name="Clicks" />
                    </BarChart>
                  </ResponsiveContainer>
                  </div>
                </div>
              </TabPanel>
      
              <TabPanel>
                <div className="gridmain tab-panel-content">
                  <div className="grid1"> 
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartDataDevice}
                        dataKey="impressionsa"
                        nameKey="device_platform"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                      >
                        {chartDataDevice.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid1"> 
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartDataDevice}>
                      <XAxis dataKey="device_platform" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="reacha" fill="#8884d8" name="Reach" />
                      <Bar dataKey="impressionsa" fill="#82ca9d" name="Impressions" />
                      <Bar dataKey="clicka" fill="#8884d8" name="Clicks" />
                    </BarChart>
                  </ResponsiveContainer>
                  </div>
                </div>
              </TabPanel>
      
              <TabPanel>
                <div className="gridmain tab-panel-content">
                  <div className="grid1"> 
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartDataGender}
                        dataKey="impressionsa"
                        nameKey="gender"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                      >
                        {chartDataGender.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid1"> 
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartDataGender}>
                      <XAxis dataKey="gender" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="reacha" fill="#8884d8" name="Reach" />
                      <Bar dataKey="impressionsa" fill="#82ca9d" name="Impressions" />
                      <Bar dataKey="clicka" fill="#8884d8" name="Clicks" />
                    </BarChart>
                  </ResponsiveContainer>
                  </div>
                </div>
              </TabPanel>
            </Tabs>
          </div>
          </div>
      
     

      {/* Meta Ads List */}
      <div className="grid22">
      <h3 className="text-lg mb-0 mt-0">Individual Statistics</h3>
      <div className="ads-list grid23 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
     
        {filteredMetaAds.length > 0 ? (
          filteredMetaAds.map((ad) => renderAdDetails(ad))
        ) : (
          <p>No Meta Ads found</p>
        )}
      </div>
      </div>

      <div className="ads-list">
  {filteredMetaAds.length > 0 ? (
    renderAdDetailsTable() // Call it ONCE to render a single table
  ) : (
    <p>No Meta Ads found</p>
  )}
</div>

    </div>
  );
};

export default Facebookadsforreport;
