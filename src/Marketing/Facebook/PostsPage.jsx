import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaThumbsUp, FaRegSmile, FaComment, FaShareAlt } from "react-icons/fa";
import "../../Style.css"; // Importing the CSS file
import { site_url } from "../../../env";

const PostsPage = ({ postCount, setPostCount, setPageTitle }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeFilter, setActiveFilter] = useState(null); // Track active filter
  const [expandedPosts, setExpandedPosts] = useState({});
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
  }

  const toggleExpand = (index) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setActiveFilter(null);
  };

  return (
    <div id="facebook-posts">
      <div className="p-4">
        <h1 className="text-3xl font-semibold mb-4"></h1>
        <div className="filter flex justify-between items-center mb-4">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => {
              const messageLines = post.message.split("\n");
              const shouldTruncate = messageLines.length > 2;
              return (
                <div key={index} className="card">
                  <p className="text-gray-500 text-sm mt-2">
                    {new Date(post.created_time).toLocaleString()}
                  </p>

                  <div
                    className={`post-message ${
                      expandedPosts[index] ? "expanded" : "collapsed"
                    }`}
                  >
                    {expandedPosts[index]
                      ? post.message
                      : messageLines.slice(0, 4).join("\n")}
                  </div>

                  {shouldTruncate && (
                    <span
                      className="see-more-text text-blue-500 cursor-pointer"
                      onClick={() => toggleExpand(index)}
                    >
                      {expandedPosts[index] ? " See Less" : " ...See More"}
                    </span>
                  )}

                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt="Post Image"
                      className="w-full h-64 object-cover mb-4 rounded-md"
                    />
                  )}

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
                    View on Facebook
                  </a>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 col-span-3">
              No posts found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostsPage;
