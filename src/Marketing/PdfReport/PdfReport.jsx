import React, { useEffect, useState ,useRef} from "react";
import axios from "axios";
import { FaThumbsUp, FaRegSmile, FaComment, FaShareAlt } from "react-icons/fa";
import "../../Style.css"; 
import LatestFacebookPosts from "./../../pages/Facebook/LatestFacebookPosts";
import LatestFacebookReels from "./../../pages/Facebook/LatestFacebookReels";
import LatestInstagramPosts from "./../../pages/Instagram/LatestInstagramPost";
import LatestInstagramReels from "./../../pages/Instagram/LatestInstagramReel";
import MetaAdsSummary from "./../../pages/MetaAds/MetaAdsSummary";
import MetaAdsInstaSummary from "./../../pages/MetaAds/MetaadsInstaSummary";
import Facebookadsforreport from "../../Components/Facebookadsforreport";
import Instagramadsforreport from "../../Components/Instagramadsforreport";
import Googleadforreport from "../../Components/Googleadforreport";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2pdf from "html2pdf.js";// 
// ✅ Correct import for jsPDF
import html2canvas from "html2canvas";
import autoTable from "jspdf-autotable";
import "jspdf-autotable";
import Chart from "chart.js/auto";
import { site_url } from "../../Services/Api";

const PdfReports = ({ postCount, setInstaPostCount }) => {
  const [facebookPosts, setFacebookPosts] = useState([]);
  const [facebookReels, setFacebookReels] = useState([]);
  const [instagramPosts, setInstagramPosts] = useState([]);
  const [InstagramReels, setInstagramReels] = useState([]);
  const [metaAds, setMetaAds] = useState([]);
    const [instaAds, setInstaAds] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeFilter, setActiveFilter] = useState(null); // Track active filter
  const [expandedPosts, setExpandedPosts] = useState({});
  const [playingVideo, setPlayingVideo] = useState(null);
  const reportRef = useRef(null);

  
  useEffect(() => {
  

    const fetchCampaignData = async () => {
      try {
        const [metaAdsRes, instaAdsRes, facebookResponse, instagramResponse,googleads,campaigndata] = await Promise.all([
          fetch("http://127.0.0.1:5000/saved-meta-ads").then((res) => res.json()),
          fetch("http://127.0.0.1:5000/saved-meta-ads2").then((res) => res.json()),
          fetch("http://127.0.0.1:5000/facebook").then((res) => res.json()),
          fetch("http://127.0.0.1:5000/instagram").then((res) => res.json()),
          fetch("http://127.0.0.1:5000/google-ads").then((res) => res.json()),
          fetch("http://127.0.0.1:5000/campaign-data").then((res) => res.json()),
        ]);
        
        console.log("Meta Ads API Response:", metaAdsRes);
        console.log("Insta Ads API Response:", instaAdsRes);
         
        console.log("Google ads Ads API Response:", googleads);
        console.log("Campaign Ads API Response:", campaigndata);
    
        console.log("Facebook API Response:", facebookResponse); // Debugging
    
        // Set Facebook posts and reels
        setFacebookPosts(facebookResponse.posts || []);
    
        // Filter Facebook reels
        const filteredFacebookReels = (facebookResponse.reels || []).filter(
          (reel) => reel.description && reel.description.trim() !== "No description"
        );
        setFacebookReels(filteredFacebookReels);
    
        // Filter Instagram posts and reels
        const filteredInstagramPosts = (instagramResponse.posts || []).filter(
          (post) =>
            (post.media_type === "CAROUSEL_ALBUM" || post.media_type === "IMAGE") &&
            post.image_url &&
            post.message
        );
      
 const filteredInstagramReels = (instagramResponse.posts || []).filter(post =>
  (post.media_type === "VIDEO") && post.image_url && post.message
);
setInstagramPosts(filteredInstagramPosts);
setInstagramReels(filteredInstagramReels);

        // Update post count
        // setInstaPostCount(filteredInstagramPosts.length + filteredInstagramReels.length);
      } catch (error) {
        console.error("Error fetching campaign data:", error);
      } finally {
        setLoading(false);
      }
      
    };

    fetchCampaignData();
    
}, [ setInstaPostCount]);


// const handleGeneratePDF = async () => {
//   // Fetch data
//   const fetchAdData = async () => {
//     try {
//       const [metaAdsRes, instaAdsRes, facebookResponse, instagramResponse,googleads,campaigndata] = await Promise.all([
//         fetch("http://127.0.0.1:5000/saved-meta-ads").then((res) => res.json()),
//         fetch("http://127.0.0.1:5000/saved-meta-ads2").then((res) => res.json()),
//         fetch("http://127.0.0.1:5000/facebook").then((res) => res.json()),
//         fetch("http://127.0.0.1:5000/instagram").then((res) => res.json()),
//         fetch("http://127.0.0.1:5000/google-ads").then((res) => res.json()),
//         fetch("http://127.0.0.1:5000/campaign-data").then((res) => res.json()),
//       ]);

//       console.log("Meta Ads API Response:", metaAdsRes);
//       console.log("Insta Ads API Response:", instaAdsRes);

//       return {
//         metaAds: Array.isArray(metaAdsRes?.ads_data) ? metaAdsRes.ads_data : [],
//         instaAds: Array.isArray(instaAdsRes?.ads_data) ? instaAdsRes.ads_data : [],
//       };
//     } catch (error) {
//       console.error("Error fetching campaign data:", error);
//       return { metaAds: [], instaAds: [] };
//     }
//   };

//   // Aggregate data
//   const aggregateAdData = (ads, isInstaAds = false) => {
//     const totals = {
//       spend: 0,
//       reach: 0,
//       impressions: 0,
//       clicks: 0,
//     };

//     if (!Array.isArray(ads)) {
//       console.error("aggregateAdData received a non-array value:", ads);
//       return totals;
//     }

//     ads.forEach((ad) => {
//       if (!Array.isArray(ad.insights) || ad.insights.length === 0) return;

//       const insightsToProcess = isInstaAds
//         ? ad.insights.filter((i) => i.publisher_platform === "instagram")
//         : ad.insights;

//       if (insightsToProcess.length === 0) return;

//       const insight = insightsToProcess[0]; // Use first insight if multiple exist

//       totals.spend += parseFloat(insight.spend || 0);
//       totals.reach += parseFloat(insight.reach || 0);
//       totals.impressions += parseInt(insight.impressions || 0);
//       totals.clicks += parseInt(insight.clicks || 0);
//     });

//     // Avoid division by zero
//     totals.cpc = totals.clicks > 0 ? totals.spend / totals.clicks : 0;
//     totals.cpm = totals.impressions > 0 ? (totals.spend / totals.impressions) * 1000 : 0;
//     totals.ctr = totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0;

//     return totals;
//   };

//   // Fetch and process data
//   const { metaAds, instaAds } = await fetchAdData();
//   const metaTotals = aggregateAdData(metaAds);
//   const instaTotals = aggregateAdData(instaAds, true);

//   // Calculate combined totals
//   const combinedTotals = {
//     totalSpend: metaTotals.spend + instaTotals.spend,
//     totalReach: metaTotals.reach + instaTotals.reach,
//     totalImpressions: metaTotals.impressions + instaTotals.impressions,
//     totalClicks: metaTotals.clicks + instaTotals.clicks,
//     totalCpc:
//       metaTotals.clicks + instaTotals.clicks > 0
//         ? (metaTotals.spend + instaTotals.spend) / (metaTotals.clicks + instaTotals.clicks)
//         : 0,
//     totalCpm:
//       metaTotals.impressions + instaTotals.impressions > 0
//         ? ((metaTotals.spend + instaTotals.spend) / (metaTotals.impressions + instaTotals.impressions)) * 1000
//         : 0,
//     totalCtr:
//       metaTotals.impressions + instaTotals.impressions > 0
//         ? ((metaTotals.clicks + instaTotals.clicks) / (metaTotals.impressions + instaTotals.impressions)) * 100
//         : 0,
//   };

//   // Generate PDF
//   const pdf = new jsPDF("p", "mm", "a4");
//   let startX = 13;
//   let startY = 10;
//   let boxWidth = 28;
//   let boxHeight = 25;
//   let spacing = 3;

//   pdf.setFont("helvetica", "bold");
//   pdf.setFontSize(16);
//   pdf.text("Social Media Post Summary", 13, 15);

//   autoTable(pdf, {
//     startY: startY + 10,
//     head: [["Platform", "No of Creatives", "Posts", "Reels/Shorts", "Posted"]],
//     body: [
//       ["Facebook", setInstaPostCount2, facebookPosts.length, facebookReels.length, setInstaPostCount2],
//       ["Instagram", setInstaPostCount1, instagramPosts.length, InstagramReels.length, setInstaPostCount1],
//     ],
//   });

//   startY = pdf.lastAutoTable.finalY + 10;
//   pdf.setFont("helvetica", "bold");
//   pdf.setFontSize(16);
//   pdf.text("Meta Ad Performance", 13, 55);

//   const data = [
//     { label: "Amount Spent", value: `$${combinedTotals.totalSpend.toFixed(2)}` },
//     { label: "Impressions", value: combinedTotals.totalImpressions.toLocaleString() },
//     { label: "Clicks", value: combinedTotals.totalClicks.toLocaleString() },
//     { label: "CPC", value: `$${combinedTotals.totalCpc.toFixed(2)}` },
//     { label: "CPM", value: `$${combinedTotals.totalCpm.toFixed(2)}` },
//     { label: "CTR", value: `${combinedTotals.totalCtr.toFixed(2)}%` },
//   ];

//   startY += 10;
//   pdf.setFont("helvetica", "bold");
//   pdf.setFontSize(16);
//   pdf.text("Facebook Ad Performance", 13, 100);

//   data.forEach((item, index) => {
//     let xPos = startX + (index * (boxWidth + spacing));

//     // Shadow Effect
//     const shadowOffset = 1;
//     const shadowColor = 200;

//     pdf.setFillColor(shadowColor, shadowColor, shadowColor);
//     pdf.roundedRect(xPos + shadowOffset, startY + shadowOffset, boxWidth, boxHeight, 1, 1, "F");

//     // Main Box
//     pdf.setDrawColor(0);
//     pdf.setFillColor(240, 240, 240);
//     pdf.roundedRect(xPos, startY, boxWidth, boxHeight, 1, 1, "F");

//     // Add text
//     pdf.setFont("helvetica", "normal");
//     pdf.setFontSize(9);
//     pdf.text(item.label, xPos + 5, startY + 10);

//     pdf.setFont("helvetica", "bold");
//     pdf.setFontSize(12);
//     pdf.text(item.value, xPos + 5, startY + 20);
//   });

//   startY = pdf.lastAutoTable.finalY + 10;
//   pdf.setFont("helvetica", "bold");
//   pdf.setFontSize(16);
//   pdf.text("Meta Ad Performance", 13, 55);

//   const data2 = [
//     { label: "Amount Spent", value: `$${combinedTotals.totalSpend.toFixed(2)}` },
//     { label: "Impressions", value: combinedTotals.totalImpressions.toLocaleString() },
//     { label: "Clicks", value: combinedTotals.totalClicks.toLocaleString() },
//     { label: "CPC", value: `$${combinedTotals.totalCpc.toFixed(2)}` },
//     { label: "CPM", value: `$${combinedTotals.totalCpm.toFixed(2)}` },
//     { label: "CTR", value: `${combinedTotals.totalCtr.toFixed(2)}%` },
//   ];

//   startY += 10;
//   pdf.setFont("helvetica", "bold");
//   pdf.setFontSize(16);
//   pdf.text("Facebook Ad Performance", 13, 100);

//   data2.forEach((item, index) => {
//     let xPos = startX + (index * (boxWidth + spacing));

//     // Shadow Effect
//     const shadowOffset = 1;
//     const shadowColor = 200;

//     pdf.setFillColor(shadowColor, shadowColor, shadowColor);
//     pdf.roundedRect(xPos + shadowOffset, startY + shadowOffset, boxWidth, boxHeight, 1, 1, "F");

//     // Main Box
//     pdf.setDrawColor(0);
//     pdf.setFillColor(240, 240, 240);
//     pdf.roundedRect(xPos, startY, boxWidth, boxHeight, 1, 1, "F");

//     // Add text
//     pdf.setFont("helvetica", "normal");
//     pdf.setFontSize(9);
//     pdf.text(item.label, xPos + 5, startY + 10);

//     pdf.setFont("helvetica", "bold");
//     pdf.setFontSize(12);
//     pdf.text(item.value, xPos + 5, startY + 20);
//   });

//   pdf.save("Meta_Ad_Report.pdf");
// };


const handlePrint = () => {
  window.print();
};

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

  const filteredFacebookPosts = facebookPosts.filter(post => {
    if (!post.created_time) return false;
    const postDate = new Date(post.created_time);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    return (!start || postDate >= start) && (!end || postDate <= end);
});
const filteredFacebookReels = facebookReels.filter((reel) => {
  if (!reel.created_time) return false;
  const postDate = new Date(reel.created_time);
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  return (!start || postDate >= start) && (!end || postDate <= end);
});


const filteredInstagramPosts = instagramPosts.filter(post => {
    if (!post.created_time) return false;
    const postDate = new Date(post.created_time);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    return (!start || postDate >= start) && (!end || postDate <= end);
});
const filteredInstagramReels = InstagramReels.filter(reel => {
  if (!reel.created_time) return false;
  const postDate = new Date(reel.created_time);
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  return (!start || postDate >= start) && (!end || postDate <= end);
});

// const handlePrint = useReactToPrint({
//   content: () => {
//     console.log("Ref value before printing:", reportRef.current); // Debugging
//     return reportRef.current || null; // Prevents passing null
//   },
//   documentTitle: "Report",
// });
//   // Generate PDF using html2canvas and jsPDF
//   const generatePDF = () => {
//     const input = document.getElementById("pdf-content");
//     html2canvas(input, { scale: 2 }).then((canvas) => {
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       const imgWidth = 210;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
//       pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
//       pdf.save("Report.pdf");
//     });
//   };

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
  }

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setActiveFilter(null);
  };

const setInstaPostCount1 = (filteredInstagramPosts?.length || 0) + (filteredInstagramReels?.length || 0);
const setInstaPostCount2 = (filteredFacebookPosts?.length || 0) + (filteredFacebookReels?.length || 0);
const postcount = (filteredFacebookPosts?.length || 0) - (filteredFacebookReels?.length || 0);

  return (
    
    <div className="p-6">
    {/* <button onClick={handleGeneratePDF} className="print-btn">Download PDF</button> */}
    <div>
     
     <div class="pdf-section">
      <div className="ads-list">
        <div className="table-container overflow-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
          <th className="border px-4 py-2" style={{ textAlign: 'center' }}>Platform</th>
            <th className="border px-4 py-2" style={{ textAlign: 'center' }}>No of Creatives</th>
            <th className="border px-4 py-2" style={{ textAlign: 'center' }}>Posts</th>
            <th className="border px-4 py-2" style={{ textAlign: 'center' }}>Reels/ Shorts</th>
            <th className="border px-4 py-2" style={{ textAlign: 'center' }}>Posted</th>
          </tr>
        </thead>
        <tbody>
         
        <tr>
  <td className="border px-4 py-2" style={{ textAlign: 'center' }}>Facebook</td>
  <td className="border px-4 py-2" style={{ textAlign: 'center' }}>{setInstaPostCount2}</td>
  <td className="border px-4 py-2" style={{ textAlign: 'center' }}>{facebookPosts.length}</td>
  <td className="border px-4 py-2" style={{ textAlign: 'center' }}>{facebookReels.length}</td>
  <td className="border px-4 py-2" style={{ textAlign: 'center' }}>{setInstaPostCount2}</td>
</tr>

            <tr className="border border-gray-300 hover:bg-gray-100">
              <td className="border px-4 py-2" style={{ textAlign: 'center' }}>Instagram</td> 
              <td className="border px-4 py-2" style={{ textAlign: 'center' }}>{setInstaPostCount1}</td>
              <td className="border px-4 py-2" style={{ textAlign: 'center' }}>{instagramPosts.length}</td>
              <td className="border px-4 py-2" style={{ textAlign: 'center' }}>{InstagramReels.length}</td>
           <td className="border px-4 py-2" style={{ textAlign: 'center' }}>{setInstaPostCount1}</td>
            </tr>
      
        </tbody>
      </table>
      </div>
      </div>
</div>
<div class="pdf-section">
      <div className="p-4">
    
      <div className="total">
        <MetaAdsInstaSummary startDate={startDate} endDate={endDate} />
      </div>
      </div>
</div>
<div class="pdf-section">
        < Facebookadsforreport startDate={startDate} endDate={endDate} />
        </div>
        <div class="pdf-section">
        < Instagramadsforreport startDate={startDate} endDate={endDate} />
        </div>
        <div class="pdf-section">
        < Googleadforreport startDate={startDate} endDate={endDate} />
        </div>
        
        <div class="pdf-section">
      <div className="dashboard-container2">
        <h3 className="text-2xl font-bold mb-4">Facebook Post ({facebookPosts.length})</h3>
      </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              
                  {filteredFacebookPosts.map((post, index) => {
                  const messageLines = (post.message || "").split("\n");
                    const shouldTruncate = messageLines.length > 2;
                    return (
                      <div key={index} className="card">
                        <p className="text-gray-500 text-sm mt-2">
                          {new Date(post.created_time).toLocaleString()}
                        </p>
          
                        {/* Post message with truncation */}
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
                          View on Facebook
                        </a>
                      </div>
                    );
                  })}
                </div>
</div>
<div class="pdf-section">

                <div className="dashboard-container2">
  <h3 className="text-2xl font-bold mb-4">Facebook Reels({facebookReels.length})</h3>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
  {filteredFacebookReels.map((reel, index) => (
    <div key={index} className="card">
      <p className="text-gray-400 text-sm">
        {new Date(reel.created_time).toLocaleString()}
      </p>
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
        <span>
          <FaThumbsUp /> {reel.likes_count}
        </span>
        <span>
          <FaComment /> {reel.comments_count}
        </span>
        <span>
          <FaShareAlt /> {reel.shares_count}
        </span>
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
<div class="pdf-section">
                <div className="dashboard-container2">
        <h3 className="text-2xl font-bold mb-4">Instagram Posts ({instagramPosts.length})</h3>
      </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
         
                            {filteredInstagramPosts.length > 0 ? (
                                filteredInstagramPosts.map((post, index) => (
                                    <div key={index} className="card border p-5 rounded-lg shadow-md">
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
                                    No multi-image static posts found.
                                </p>
                            )}
                        </div>
                        </div>

                        <div class="pdf-section">
      <div className="dashboard-container2">
        <h3 className="text-2xl font-bold mb-4">Instagram Reels ({InstagramReels.length})</h3>
      </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                       {filteredInstagramReels.length > 0 ? (
                           filteredInstagramReels.map((reel, index) => (
                               <div key={index} className="card border p-5 rounded-lg shadow-md">
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
                  
      </div>
    </div>
  );
};

export default PdfReports;
