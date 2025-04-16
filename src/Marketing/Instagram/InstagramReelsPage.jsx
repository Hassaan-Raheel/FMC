import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaThumbsUp, FaRegSmile, FaComment, FaShareAlt } from "react-icons/fa";
import { site_url } from "../../Services/Api";

const InstagramReelsPage = ({ reelCount, setReelCount }) => {
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [playingVideo, setPlayingVideo] = useState(null);
    const [startDate, setStartDate] = useState(() => {
        const today = new Date();
        const pastDate = new Date();
        pastDate.setDate(today.getDate() - 30); // Default: last 30 days
        return pastDate.toISOString().split("T")[0];
    });

    const [endDate, setEndDate] = useState(() => {
        return new Date().toISOString().split("T")[0];
    });

    const [activeFilter, setActiveFilter] = useState(null);

    useEffect(() => {
        axios.get(`${site_url}/instagram`)
            .then(response => {
                const allPosts = response.data.posts || [];

                const filteredReels = allPosts.filter(post => {
                    if (post.media_type !== "VIDEO" || !post.created_time) return false;

                    const postDate = new Date(post.created_time);
                    if (isNaN(postDate)) return false;

                    const start = startDate ? new Date(startDate) : null;
                    const end = endDate ? new Date(endDate) : null;

                    return (!start || postDate >= start) && (!end || postDate <= end);
                });

                setReels(filteredReels);
                setReelCount(filteredReels.length);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching reels:", error);
                setLoading(false);
            });
    }, [startDate, endDate, setReelCount]);

    const handleStartDateChange = (e) => setStartDate(e.target.value);
    const handleEndDateChange = (e) => setEndDate(e.target.value);
    // Filter posts based on the selected date range
    const filteredReels = reels.filter((reel) => {
        if (!reel.created_time) return false; // Ensure valid date exists

        const postDate = new Date(reel.created_time);
        if (isNaN(postDate)) return false; // Handle invalid dates

        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        return (!start || postDate >= start) && (!end || postDate <= end);
    });

    // Quick filter for last X days
    const applyQuickFilter = (days) => {
        const today = new Date();
        const pastDate = new Date();
        pastDate.setDate(today.getDate() - days);

        setStartDate(pastDate.toISOString().split("T")[0]);
        setEndDate(today.toISOString().split("T")[0]);
        setActiveFilter(days);
    };

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
            {/* Display Reels */}
            <div className="gridm grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredReels.length > 0 ? (
                    filteredReels.map((reel, index) => (
                        <div key={index} className="card border p-4 rounded-lg shadow-md">
                            <p className="text-gray-500 text-sm mb-2">
                                {new Date(reel.created_time).toLocaleString()}
                            </p>
                            <p className="text-gray-700">{reel.message || "No caption available"}</p>
                            {/* Show Thumbnail First, Click to Play Video */}
                            {playingVideo === index ? (
                                <video 
                                    controls 
                                    autoPlay
                                    className="w-full h-64 object-cover mb-4 rounded-md"
                                >
                                    <source src={reel.image_url} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <img 
                                    src={reel.thumbnail_url || reel.image_url} 
                                    alt="Reel Thumbnail"
                                    className="w-full h-64 object-cover mb-4 rounded-md cursor-pointer"
                                    onClick={() => setPlayingVideo(index)}
                                />
                            )}

                           
<div className="engagement-metrics">
    <div className="engagement-item">
        <FaThumbsUp />
        <span>{reel.likes_count || reel.insights?.likes || 0}</span>
    </div>
    <div className="engagement-item">
        <FaRegSmile />
        <span>{reel.reactions_count || reel.insights?.reactions || 0}</span>
    </div>
    <div className="engagement-item">
        <FaComment />
        <span>{reel.comments_count || reel.insights?.comments || 0}</span>
    </div>
    <div className="engagement-item">
        <FaShareAlt />
        <span>{reel.shares_count || reel.insights?.shares || 0}</span>
    </div>
</div>
                            <a 
                                href={reel.permalink_url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-500 mt-2 block"
                            >
                                View on Instagram
                            </a>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 col-span-3">
                        No reels found in the selected date range.
                    </p>
                )}
            </div>
        </div>
    );
};

export default InstagramReelsPage;
