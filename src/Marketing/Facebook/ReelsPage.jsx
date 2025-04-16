import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaThumbsUp, FaRegSmile, FaComment, FaShareAlt } from "react-icons/fa";
import { site_url } from "../../Services/Api";

const ReelsPage = ({ reelCount, setReelCount}) => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeFilter, setActiveFilter] = useState("default");

  useEffect(() => {
  
    axios
      .get(`${site_url}/facebook`)
      .then((response) => {
        const fetchedReels = response.data.reels || [];
        const filteredReels = fetchedReels.filter(
          (reel) => reel.description && reel.description.trim() !== "No description"
        );
        setReels(filteredReels);
        setReelCount(filteredReels.length);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching reels:", error);
        setLoading(false);
      });
  }, [setReelCount]);

  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);

  // Function to set date range dynamically
  const setDateRange = (days) => {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - days);

    setStartDate(pastDate.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);
  };

  const applyQuickFilter = (days) => {
    setActiveFilter(days);
    setDateRange(days); // Apply the quick filter
  };

  const filteredReels = reels.filter((reel) => {
    const reelDate = new Date(reel.created_time);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    return (
      (!start || reelDate >= start) && (!end || reelDate <= end)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }
  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setActiveFilter(null);
  };

  return (

    <div id="facebook-reels">
    <div className="p-4">
          <h1 className="text-3xl font-semibold mb-4"></h1>
          <div className="filter flex justify-between items-center mb-4">
      {/* Quick Date Filter Buttons */}
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

      {/* Custom Date Filter */}
      <div className="date-filter-container mb-4">
        <input
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          className="date-input"
        />
        <span className="date-text">-</span>
        <input
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          className="date-input"
        />
      </div>
      <button className="clear-filter-btn" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      {/* Reels Grid */}
      <div className="gridm grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredReels.map((reel, index) => (
          <div key={index} className="card">
            <p className="text-gray-400 text-sm">
              {new Date(reel.created_time).toLocaleString()}
            </p>

            {/* Scrollable Caption */}
            <div className="caption-scroll">
              <p className="text-lg font-semibold">{reel.description}</p>
            </div>

            {reel.thumbnail && (
              <img
                src={reel.thumbnail}
                alt="Reel Thumbnail"
                className="w-full h-64 object-cover mt-2 rounded-md"
              />
            )}
            <div className="post-meta">
                          <span><FaThumbsUp /> {reel.likes_count}</span>
                          <span><FaComment /> {reel.comments_count}</span>
                          <span><FaShareAlt /> {reel.shares_count}</span>
                        </div>
            <div className="mt-4">
            <a
  href={`https://www.facebook.com${reel.permalink_url}`}
  target="_blank"
  rel="noopener noreferrer"
  className="text-blue-500 hover:underline"
>
  View on Facebook
</a>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default ReelsPage;
