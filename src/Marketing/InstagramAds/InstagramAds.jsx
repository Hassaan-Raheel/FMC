import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Collapse } from 'antd';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { site_url } from "../../Services/Api";
import '../MetaAds/Metaads.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FaThumbsUp, FaEye, FaShareAlt, FaMoneyBillWave, FaPlayCircle } from 'react-icons/fa'; // Example icons from react-icons
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css"; 
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
const iconMapping = {
  impressions: "fas fa-eye", // Example FontAwesome icons
  clicks: "fas fa-mouse-pointer",
  ctr: "fas fa-percentage",
  spend: "fas fa-dollar-sign",
  reach: "fas fa-chart-line",
};

const { Panel } = Collapse;
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

const MetaAdsInsights = ({}) => {
  const [adsData, setAdsData] = useState([]);
  const [filteredAdsData, setFilteredAdsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter criteria state
  const [filters, setFilters] = useState({
    campaignId: '',
    startDate: '',
    endDate: '',
    status: '',
    dateRange: '',
  });

  useEffect(() => {

    // Fetch the saved Meta Ads data from the Flask backend
    axios.get(`${site_url}/saved-meta-ads2`)
    
      .then(response => {
        console.log("Fetched Ads Data:", response.data);
  
        // Filter out campaigns with 'No insights available'
        const filteredAds = response.data.ads_data?.filter(ad => 
          ad.insights && ad.insights !== "No insights available" && !(ad.name && ad.name.startsWith("Post:"))
        ) || [];
  
        setAdsData(filteredAds);
        setFilteredAdsData(filteredAds);
        setLoading(false);
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
        setLoading(false);
      });
  }, [setPageTitle]);

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Filter the ads based on the selected filters
  const filterAdsData = () => {
    let filteredData = adsData;

    // Filter by campaign ID
    if (filters.campaignId) {
      filteredData = filteredData.filter(ad => ad.campaign_id.includes(filters.campaignId));
    }

    // Filter by start date
    if (filters.startDate) {
      filteredData = filteredData.filter(ad => new Date(ad.start_date) >= new Date(filters.startDate));
    }

    // Filter by end date
    if (filters.endDate) {
      filteredData = filteredData.filter(ad => new Date(ad.end_date) <= new Date(filters.endDate));
    }

    // Filter by status
    if (filters.status) {
      filteredData = filteredData.filter(ad => ad.status.toLowerCase() === filters.status.toLowerCase());
    }

    // Filter by date range (e.g., today, last 7 days, last 30 days)
    if (filters.dateRange) {
      const currentDate = new Date();
      let filteredByDate = [];

      if (filters.dateRange === "today") {
        filteredByDate = filteredData.filter(ad => new Date(ad.start_date).toDateString() === currentDate.toDateString());
      } else if (filters.dateRange === "last7") {
        const last7Days = new Date();
        last7Days.setDate(currentDate.getDate() - 7);
        filteredByDate = filteredData.filter(ad => new Date(ad.start_date) >= last7Days);
      } else if (filters.dateRange === "last30") {
        const last30Days = new Date();
        last30Days.setDate(currentDate.getDate() - 30);
        filteredByDate = filteredData.filter(ad => new Date(ad.start_date) >= last30Days);
      }

      filteredData = filteredByDate;
    }

    setFilteredAdsData(filteredData);
  };

  // Run the filter when filter criteria changes
  useEffect(() => {
    filterAdsData();
  }, [filters]);


  
  const renderAdDetails = (ad) => {
    // Ensure ad.insights is an array, otherwise default to an empty array
    const insightsArray = Array.isArray(ad.insights) ? ad.insights : [];

    // Find Instagram-specific insights
    const instagramInsights = insightsArray.filter(i => i.publisher_platform === "instagram");
    if (instagramInsights.length === 0) return null;

    // Get insights data from the first Instagram insight (if available)
    const insight = instagramInsights[0] || {};

    const startDate = insight.date_start || "N/A";
    const endDate = insight.date_stop || "N/A";

    const clicks = insight.clicks || "N/A";
    const cpc = insight.cpc || "N/A";
    const ctr = insight.ctr || "N/A";
    const impressions = insight.impressions || "N/A";
    const reach = insight.reach || "N/A";
    const spend = insight.spend || "N/A";

    return (
      <div key={ad.id} className="card2 p-2 border border-gray-300 rounded-md shadow-sm">
        {/* <div className="dates mb-2 flex space-x-4">
          <p className="campaign-status1 text-sm font-semibold mb1">
            <strong>Date: </strong> {startDate}
          </p>
          <p className="campaign-status1 text-sm font-semibold mb1">TO</p>
          <p className="campaign-status1 text-sm font-semibold mb1">{endDate}</p>
        </div>
   */}
        <p className="ad-title text-sm font-semibold mb-1"><strong>Campaign Name:</strong> {ad.name}</p>
        <p className="campaign-name text-xs"><strong>Campaign ID:</strong> {ad.campaign_id}</p>
        <p className="campaign-status text-xs"><strong>Status:</strong> {ad.status}</p>
       
        
        <div className="insights max-h-40 overflow-auto border-t mt-2 pt-2">
          <div className='gridmain'>
          <div className="box">
            <div className='info-container'>
              <div className='text-section'>
            <p className="label text-xs font-medium">CLICKS</p>
            <p className="value text-xs">{clicks}</p>
              </div>
              <div className='icon-container'>
              <i className='fas fa-mouse-pointer'></i>
              </div>
            </div>
          </div>
          <div className="box">
            <div className='info-container'>
              <div className='text-section'>
            <p className="label text-xs font-medium">CPC</p>
            <p className="value text-xs">{cpc}</p>
              </div>
              <div className='icon-container'>
              <i className='fas fa-info-circle'></i>
              </div>
            </div>
          </div>
          <div className="box">
            <div className='info-container'>
              <div className='text-section'>
            <p className="label text-xs font-medium">CTR</p>
            <p className="value text-xs">{ctr}</p>
              </div>
              <div className='icon-container'>
              <i className='fas fa-chart-line'></i>
              </div>
            </div>
          </div>
          <div className="box">
            <div className='info-container'>
              <div className='text-section'>
            <p className="label text-xs font-medium">IMPRESSIONS</p>
            <p className="value text-xs">{impressions}</p>
              </div>
              <div className='icon-container'>
              <i className='fas fa-eye'></i>
              </div>
            </div>
          </div>
          <div className="box">
            <div className='info-container'>
              <div className='text-section'>
            <p className="label text-xs font-medium">REACH</p>
            <p className="value text-xs">{reach}</p>
              </div>
              <div className='icon-container'>
              <i className='fas fa-users'></i>
              </div>
            
            </div>
          </div>
          <div className="box">
            <div className='info-container'>
              <div className='text-section'>
            <p className="label text-xs font-medium">SPEND</p>
            <p className="value text-xs">{spend}</p>
              </div>
              <div className='icon-container'>
              <i className='fas fa-dollar-sign'></i>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    );
};

  
  const calculateTotalsForAllCampaigns = (adsData) => {
    return adsData.reduce((totals, ad) => {
      const instagramInsights = ad.insights_by_platform && ad.insights_by_platform['instagram'] ? ad.insights_by_platform['instagram'] : [];

      instagramInsights.forEach((insight) => {
        totals.impressions += Number(insight.impressions) || 0;
        totals.reach += Number(insight.reach) || 0;
        totals.engagement += Number(insight.engagement) || 0;
        totals.clicks += Number(insight.clicks) || 0;
        totals.ctr += Number(insight.ctr) || 0;
        totals.cpc += Number(insight.cpc) || 0;
        totals.spend += Number(insight.spend) || 0;
        totals.cpm += Number(insight.cpm) || 0;
      });

      return totals;
    }, { impressions: 0, reach: 0, engagement: 0, clicks: 0, ctr: 0, cpc: 0, spend: 0, cpm: 0 });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  const chartData = filteredAdsData.map((ad) => {
    // Ensure ad.insights is an array, otherwise default to an empty array
    const insightsArray = Array.isArray(ad.insights) ? ad.insights : [];
    
    // Find Instagram-specific insights
    const insights = insightsArray.find(insight => insight.publisher_platform === "instagram") || {};
  
    return {
      Id: ad.campaign_id || "Unknown",  // Use campaign_id from ad object
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
      // Ensure breakdownData is an array, filter only Instagram data
      const breakdownData = Array.isArray(ad.breakdown_insights?.[breakdownType])
        ? ad.breakdown_insights[breakdownType].filter(data => data.publisher_platform === "instagram")
        : [];
  
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
    });

  
    return Object.values(groupedData);
  };
  

  // Generate grouped data for different breakdown types
  const chartDataAge =  groupByBreakdown(filteredAdsData, "age");
  const chartDataRegion = groupByBreakdown(filteredAdsData, "region");
  const chartDataDevice = groupByBreakdown(filteredAdsData, "device_platform");
  const chartDataGender = groupByBreakdown(filteredAdsData, "gender");
  const topRegions = chartDataRegion
    .sort((a, b) => b.impressionsa - a.impressionsa) // Sort in descending order
    .slice(0, 6); // Take the top 6


  // Calculate the totals for all campaigns
  const totals = calculateTotalsForAllCampaigns(filteredAdsData);

  return (
    <div className='p-4'>
      {/* Filter Section with Collapse */}
      <div className="mb-4">
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
    {Array.from(
      new Set(
        adsData
          .filter(ad => ad.insights_by_platform?.['instagram'] && ad.insights_by_platform['instagram'].length > 0) // Exclude campaigns with no insights
          .map(ad => ad.campaign_id)
      )
    ).map((campaignId) => (
      <option key={campaignId} value={campaignId}>
        {campaignId}
      </option>
    ))}
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
                  <option value="active">Active</option>
                  
                  <option value="paused">Paused</option>
                  <option value="inactive">Completed</option>
                </select>
              </div>

              {/* <div className="filter-item">
                <label>Duration:</label>
                <select
                  value={filters.dateRange}
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
      <div className='total'>
      <div className="total-details p-4 border border-gray-300 rounded-md shadow-sm ">
      {/* Display Totals for Filtered Campaigns */}
      <h3>Instagram Ads Performance</h3>
      <div className="grid2">
        <p>Amount Spend:<strong>${totals.spend.toFixed(2)}</strong> </p>
        <p>Impressions:<strong>{totals.impressions}</strong> </p>
        <p>Clicks:<strong>{totals.clicks}</strong> </p>
        <p>CPM:<strong>${totals.cpm.toFixed(2)}</strong> </p>
        <p>CTR:<strong>{totals.ctr.toFixed(2)}%</strong> </p>
        <p>CPC:<strong>${totals.cpc.toFixed(2)}</strong> </p>
      </div>
      </div>
      </div>

       {/* Graphs Section */}
            <h3 className="text-2xl font-semibold my-6"></h3>
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

              {/* <div className="tab-container">
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
                </div> */}
             {/* Meta Ads List */}
      <div className="ads-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredAdsData.length > 0 ? (
          filteredAdsData.map((ad) => renderAdDetails(ad))
        ) : (
          <p>No Meta Ads found</p>
        )}
      </div>
      
      <div className="ads-list">
  <div className="table-container overflow-auto">
    {filteredAdsData.length > 0 && (
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
          {filteredAdsData.map((ad) => {
            const instagramInsights = ad.insights_by_platform?.["instagram"] || [];

            return instagramInsights.length > 0
              ? instagramInsights.map((insight, index) => (
                  <tr key={`${ad.id}-${index}`} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2">{ad.name}</td>
                    {Object.keys(iconMapping).map((key) => (
                      <td key={key} className="border border-gray-300 p-2 text-center">
                        {insight[key] ? (
                          <>
                            {insight[key]} <i className={`ml-2 ${iconMapping[key]}`} />
                          </>
                        ) : (
                          "N/A"
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              : null;
          })}
        </tbody>
      </table>
    )}
  </div>
</div>
    </div>
  );
};

export default MetaAdsInsights;
