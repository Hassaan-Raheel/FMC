import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaThumbsUp, FaComment, FaShareAlt } from "react-icons/fa";
import { site_url } from "../../Services/Api";
const LatestFacebookPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${site_url}/facebook`)
      .then((response) => {
        console.log("API Response:", response.data); // Debugging log
        const fetchedPosts = response.data.posts || [];
        const filteredPosts = fetchedPosts.filter(
          (post) => post.message && post.message.trim() !== "No caption available",
        );
        setPosts(filteredPosts.slice(0, 6));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Facebook posts:", error);
        setLoading(false);
      });
  }, []);
  if (loading) return <p>Loading...</p>;

  return (
    <div id="latest-facebook-posts">
    <div className="facebook-posts">
     
    <div className="posts-wrapper">
  {posts.length > 0 ? (
    posts.map((post, index) => (
      <div key={index} className="post-card">
        <p className="post-time">{new Date(post.created_time).toLocaleString()}</p>
        <p className="post-message">{post.message || "No caption available"}</p>

        {post.image_url && <img src={post.image_url} alt="Post" className="post-image" />}

        <div className="post-meta">
          <span><FaThumbsUp /> {post.likes_count}</span>
          <span><FaComment /> {post.comments_count}</span>
          <span><FaShareAlt /> {post.shares_count}</span>
        </div>
        <a href={post.permalink_url} target="_blank" rel="noopener noreferrer" className="post-link">
          View on Facebook
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
    </div>
  );
};

export default LatestFacebookPosts;
