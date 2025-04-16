import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart, FaComment, FaShareAlt } from "react-icons/fa";
import { site_url } from "../../Services/Api";

const LatestInstagramPosts = ({ startDate, endDate }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${site_url}/instagram`)
      .then(response => {
        const fetchedPosts = response.data.posts || [];

        // Filter: Only static image posts (No reels/videos) and multi-image carousel posts
        const filteredPosts = fetchedPosts.filter(post =>
          (post.media_type === "CAROUSEL_ALBUM" || post.media_type === "IMAGE") && post.image_url && post.message
        );

        setPosts(filteredPosts);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  // Filter posts based on selected date range
  const filteredPosts = posts.filter((post) => {
    if (!post.created_time) return false; // Ensure valid date exists

    const postDate = new Date(post.created_time);
    if (isNaN(postDate)) return false; // Handle invalid dates

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    return (!start || postDate >= start) && (!end || postDate <= end);
  });

  if (loading) return <p>Loading...</p>;

  return (
    <div className="instagram-posts">
      <div className="posts-wrapper">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, index) => (
            <div key={index} className="post-card">
              <p className="post-time">
                {new Date(post.created_time).toLocaleString()}
              </p>
              <p className="post-message">
                {post.message || "No caption available"}
              </p>
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt="Post"
                  className="post-image"
                />
              )}
              <div className="post-meta">
                <span><FaHeart /> {post.likes_count || 0}</span>
                <span><FaComment /> {post.comments_count || 0}</span>
                <span><FaShareAlt /> {post.shares_count || 0}</span>
              </div>
              <a
                href={post.permalink_url}
                target="_blank"
                rel="noopener noreferrer"
                className="post-link"
              >
                View on Instagram
              </a>
            </div>
          ))
        ) : (
          <p>No posts found.</p>
        )}
      </div>
    </div>
  );
};

export default LatestInstagramPosts;
