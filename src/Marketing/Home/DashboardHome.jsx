import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaThumbsUp, FaRegSmile, FaComment, FaShareAlt } from "react-icons/fa";
import "../../Style.css"; 
import LatestFacebookPosts from "./../../pages/Facebook/LatestFacebookPosts";
import LatestFacebookReels from "./../../pages/Facebook/LatestFacebookReels";
import LatestInstagramPosts from "./../../pages/Instagram/LatestInstagramPost";
import LatestInstagramReels from "./../../pages/Instagram/LatestInstagramReel";
import MetaAdsSummary from "./../../pages/MetaAds/MetaAdsSummary";
import { site_url } from "../../../env";

const DashboardHome = ({ postCount, setPostCount, setPageTitle }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeFilter, setActiveFilter] = useState(null);
  const [dateFilter, setDateFilter] = useState({ start: null, end: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPageTitle("Dashboard");
  }, [setPageTitle]);



  useEffect(() => {
    axios
      .get(`${site_url}/saved-meta-ads`)
      .then((response) => {
        const filteredAds = response.data.ads_data.filter(
          (ad) => ad.insights && ad.insights !== "No insights available" && ad.insights.length > 0
        );
        setMetaAds(filteredAds || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Meta Ads data:", error);
        setLoading(false);
      });
  }, []);


  if (loading) {
    return <div className="loader"></div>
  }

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    setActiveFilter(null);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    setActiveFilter(null);
  };

  const applyQuickFilter = (days) => {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - days);

    setStartDate(pastDate.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);
    setActiveFilter(days);
  };

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setActiveFilter(null);
  };

 
  return (
    <div className="">
      {/* <div className="dashboard-container2">
        <h3 className="text-2xl font-bold mb-4">Dashboard Overview</h3>
      </div> */}

      {/* Filters */}
      <div className="filter margin-top flex justify-between items-center mb-4">
        <div className="quick-filter-container mb-4">
          {[1, 3, 7, 15, 30].map((days) => (
            <button
              key={days}
              className={`filter-btn ${activeFilter === days ? "active" : ""}`}
              onClick={() => applyQuickFilter(days)}
            >
              Last {days} Day{days > 1 ? "s" : ""}
            </button>
          ))}
        </div>

        <div className="date-filter-container mb-4">
          <input type="date" value={startDate} onChange={handleStartDateChange} className="date-input" />
          <span className="date-text">-</span>
          <input type="date" value={endDate} onChange={handleEndDateChange} className="date-input" />
        </div>

        <button className="clear-filter-btn" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      <div className="dashboard-container2">
        <h3 className="text-lg mb-0 mt-0">Meta Ad Performance</h3>
        <MetaAdsSummary  />
      </div>
    
      <div className="dashboard-container2">
        <div className="posts-container">
          <h3 className="section-title">Latest Facebook Posts</h3>
          <LatestFacebookPosts startDate={startDate} endDate={endDate} />
        </div>
      </div>

      <div className="dashboard-container2">
        <div className="posts-container">
          <h3 className="section-title">Latest Facebook Reels</h3>
          <LatestFacebookReels startDate={startDate} endDate={endDate} />
        </div>
      </div>

      <div className="dashboard-container2">
        <div className="posts-container">
          <h3 className="section-title">Latest Instagram Posts</h3>
          <LatestInstagramPosts startDate={startDate} endDate={endDate} />
        </div>
      </div>
      <div className="dashboard-container2">
        <div className="posts-container">
          <h3 className="section-title">Latest Instagram Reels</h3>
          <LatestInstagramReels startDate={startDate} endDate={endDate} />
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
