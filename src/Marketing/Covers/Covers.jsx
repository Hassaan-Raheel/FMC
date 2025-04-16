import React, { useEffect, useState } from "react";
import axios from "axios";
import './Covers.css';
import { site_url } from "../../Services/Api";
const Covers = () => {
    const [coverImage, setCoverImage] = useState("");
    const [loading, setLoading] = useState(true);
    const [insights, setInsights] = useState({
        likes: 0,
        comments: 0,
        shares: 0
    });

    useEffect(() => {
       
        axios.get(`${site_url}/facebook`)
            .then(response => {
                const data = response.data.cover_image || {};
                setCoverImage(data.source || "");
                const engagement = data.engagement || {};
                setInsights({
                    likes: engagement.likes_count || 0,
                    comments: engagement.comments_count || 0,
                    shares: engagement.shares_count || 0
                });
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching cover image:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h1 className="text-3xl font-semibold mb-4"></h1>

            <div className="cover-container">
                {/* Left side: Cover Image */}
                <div className="cover-card">
                    {coverImage ? (
                        <img 
                            src={coverImage} 
                            alt="Facebook Cover" 
                            className="cover-image"
                        />
                    ) : (
                        <p className="no-image">No cover image available</p>
                    )}
                </div>

                {/* Right side: Insights */}
                <div className="insights-card">
                    <h3 className="text-xl font-semibold">Details</h3>
                    <ul className="insight-list">
                    <div className="">
                    {coverImage.caption ? (
                    <li><strong>Caption: </strong> {coverImage.caption}</li>

                    ) : (
                        <p className="no-image">No cover caption available</p>
                    )}
                </div>
                        <li><strong>Likes:</strong> {insights.likes}</li>
                        <li><strong>Comments:</strong> {insights.comments}</li>
                        <li><strong>Shares:</strong> {insights.shares}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Covers;
