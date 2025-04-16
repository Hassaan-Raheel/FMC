import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaThumbsUp, FaRegSmile, FaComment, FaShareAlt } from "react-icons/fa";
import { site_url } from "../../Services/Api";

const InstagramPostsPage = ({ postCount, setPostCount}) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState(() => {
        const today = new Date();
        const pastDate = new Date();
        pastDate.setDate(today.getDate() - 30); // Default to last 30 days
        return pastDate.toISOString().split("T")[0];
    });

    const [endDate, setEndDate] = useState(() => {
        return new Date().toISOString().split("T")[0];
    });

    const [activeFilter, setActiveFilter] = useState(null); // Track active filter

    useEffect(() => {
    
        axios.get(`${site_url}/instagram`)
            .then(response => {
                const fetchedPosts = response.data.posts || [];

                // Filter: Only static image posts (No reels/videos) and multi-image carousel posts
                const filteredPosts = fetchedPosts.filter(post =>
                    (post.media_type === "CAROUSEL_ALBUM" || post.media_type === "IMAGE") && post.image_url && post.message
                );

                setPosts(filteredPosts);
                setPostCount(filteredPosts.length);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, [setPostCount]);

    const handleStartDateChange = (e) => setStartDate(e.target.value);
    const handleEndDateChange = (e) => setEndDate(e.target.value);

    // Apply Quick Date Filter
    const applyQuickFilter = (days) => {
        const today = new Date();
        const pastDate = new Date();
        pastDate.setDate(today.getDate() - days);

        setStartDate(pastDate.toISOString().split("T")[0]);
        setEndDate(today.toISOString().split("T")[0]);
        setActiveFilter(days);
    };

    // Filter posts based on the selected date range
    const filteredPosts = posts.filter((post) => {
        if (!post.created_time) return false; // Ensure valid date exists

        const postDate = new Date(post.created_time);
        if (isNaN(postDate)) return false; // Handle invalid dates

        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        return (!start || postDate >= start) && (!end || postDate <= end);
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
            {/* Display Posts */}
            <div className="gridm grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post, index) => (
                        <div key={index} className="card border p-4 rounded-lg shadow-md">
                            <p className="text-gray-500 text-sm mb-2">
                                {new Date(post.created_time).toLocaleString()}
                            </p>
                            <p className="text-gray-700">{post.message || "No caption available"}</p>
                            {/* Display first image from carousel */}
                            <img 
                                src={post.image_url} 
                                alt="Post Image" 
                                className="w-full h-64 object-cover mb-4 rounded-md"
                            />
                            
                            {/* Engagement Metrics */}
                                       <div className="engagement-metrics">
                                         <div className="engagement-item">
                                           <FaThumbsUp />
                                           <span>{post.likes_count}</span>
                                         </div>
                                         <div className="engagement-item">
                                           <FaRegSmile />
                                           <span>{post.reactions_count}</span>
                                         </div>
                                         <div className="engagement-item">
                                           <FaComment />
                                           <span>{post.comments_count}</span>
                                         </div>
                                         <div className="engagement-item">
                                           <FaShareAlt />
                                           <span>{post.shares_count}</span>
                                         </div>
                                       </div>
                           
                            <a 
                                href={post.permalink_url} 
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
                        No posts found.
                    </p>
                )}
            </div>
        </div>
    );
};

export default InstagramPostsPage;
