import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart, FaComment, FaShareAlt } from "react-icons/fa";
import { site_url } from "../../../env";

const LatestInstagramReels = ({ startDate, endDate }) => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${site_url}/instagram`)
      .then(response => {
        const fetchedPosts = response.data.posts || [];

        // Filter: Only static image posts (No reels/videos) and multi-image carousel posts
        const filteredReels = fetchedPosts.filter(post =>
          (post.media_type === "VIDEO" || post.media_type === "") && post.image_url && post.message
        );

        setReels(filteredReels);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  // Filter posts based on selected date range
  const filteredReels = reels.filter((reels) => {
    if (!reels.created_time) return false; // Ensure valid date exists

    const postDate = new Date(reels.created_time);
    if (isNaN(postDate)) return false; // Handle invalid dates

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    return (!start || postDate >= start) && (!end || postDate <= end);
  });

  if (loading) return <p>Loading...</p>;

  return (
    <div className="instagram-posts">
      <div className="posts-wrapper">
        {filteredReels.length > 0 ? (
          filteredReels.map((reels, index) => (
            <div key={index} className="post-card">
              <p className="post-time">
                {new Date(reels.created_time).toLocaleString()}
              </p>
              <p className="post-message">
                {reels.message || "No caption available"}
              </p>
              {reels.image_url && (
                <img
                  src={reels.thumbnail_url || reels.image_url}
                  alt="Post"
                  className="post-image"
                />
              )}
              <div className="post-meta">
                <span><FaHeart /> {reels.likes_count || 0}</span>
                <span><FaComment /> {reels.comments_count || 0}</span>
                <span><FaShareAlt /> {reels.shares_count || 0}</span>
              </div>
              <a
                href={reels.permalink_url}
                target="_blank"
                rel="noopener noreferrer"
                className="post-link"
              >
                View on Instagram
              </a>
            </div>
          ))
        ) : (
          <p>No recent reels available.</p>
        )}
      </div>
    </div>
  );
};

export default LatestInstagramReels;
