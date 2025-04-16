import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaThumbsUp, FaComment, FaShareAlt } from "react-icons/fa";
import { site_url } from "../../Services/Api";
const LatestFacebookReels = ({ startDate, endDate }) => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    axios
      .get(`${site_url}/facebook`)
      .then((response) => {
        const fetchedReels = response.data.reels || [];
        const filteredReels = fetchedReels.filter(
          (reel) => reel.description && reel.description.trim() !== "No description"
        );
        setReels(filteredReels);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching reels:", error);
        setLoading(false);
      });
  }, []);

  // Filter posts based on selected date range
  const filteredReels = reels.filter((reel) => {
    if (!reel.created_time) return false; // Ensure valid date exists

    const postDate = new Date(reel.created_time);
    if (isNaN(postDate)) return false; // Handle invalid dates

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    return (!start || postDate >= start) && (!end || postDate <= end);
  });

  if (loading) return <p>Loading...</p>;

  return (
    <div id="latest-facebook-reels">
      <div className="facebook-posts">
        <div className="posts-wrapper">
          {filteredReels.length > 0 ? (
            filteredReels.map((reel, index) => (
              <div key={index} className="post-card">
                <p className="post-time">{new Date(reel.created_time).toLocaleString()}</p>
                <p className="post-message">{reel.description || "No caption available"}</p>
                
                {reel.thumbnail && (
                  <img src={reel.thumbnail} alt="Post" className="post-image" />
                )}

                <div className="post-meta">
                  <span><FaThumbsUp /> {reel.likes_count || 0}</span>
                  <span><FaComment /> {reel.comments_count || 0}</span>
                  <span><FaShareAlt /> {reel.shares_count || 0}</span>
                </div>
                <a
                  href={`https://www.facebook.com${reel.permalink_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="post-link"
                >
                  View on Facebook
                </a>
              </div>
            ))
          ) : (
            <p>No recent reels available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LatestFacebookReels;