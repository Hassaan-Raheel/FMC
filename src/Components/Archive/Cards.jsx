import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaThumbsUp, FaRegSmile, FaComment, FaShareAlt } from "react-icons/fa";
import "../Style.css"; // Importing the CSS file
import { site_url } from "../Services/Api";
const Cards = ({ postCount, setPostCount,setPageTitle }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeFilter, setActiveFilter] = useState(null); // Track active filter

  useEffect(() => {
    setPageTitle("Facebook Posts");
    axios

      .get(`${site_url}/facebook`)
      .then((response) => {
        const fetchedPosts = response.data.posts || [];
        setPosts(fetchedPosts);
        setPostCount(fetchedPosts.length);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
     
  }, [setPageTitle, setPostCount]);

  // Handle custom date change
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    setActiveFilter(null); // Reset active filter if manually selecting date
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    setActiveFilter(null);
  };

  // Handle Quick Filter buttons
  const applyQuickFilter = (days) => {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - days);

    setStartDate(pastDate.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);
    setActiveFilter(days); // Set active filter state
  };

  const filteredPosts = posts.filter((post) => {
    const postDate = new Date(post.created_time);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    return (
      (!start || postDate >= start) &&
      (!end || postDate <= end) &&
      post.image_url &&
      post.message
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }}
return
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredPosts.map((post, index) => (
          <div key={index} className="card">
            <p className="text-gray-500 text-sm mt-2">
              {new Date(post.created_time).toLocaleString()}
            </p>
            <p>{post.message || "No caption available"}</p>

            {post.image_url ? (
              <img
                src={post.image_url}
                alt="Post Image"
                className="w-full h-64 object-cover mb-4 rounded-md"
              />
            ) : (
              <p className="text-center text-gray-500">No image available</p>
            )}

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
              {Link}
            </a>
          </div>
        ))}
      </div>

export default Cards;