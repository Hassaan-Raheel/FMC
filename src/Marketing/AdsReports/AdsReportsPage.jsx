
import React, { useEffect, useState, useRef ,useMemo} from "react";
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
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import autoTable from "jspdf-autotable";
import "jspdf-autotable";
import Chart from "chart.js/auto";
import { site_url } from "../../../env";

const AdsReportPage = ({ postCount, setInstaPostCount, setPageTitle }) => {
  const [FacebookPosts, setFacebookPosts] = useState([]);
  const [FacebookReels, setFacebookReels] = useState([]);
  const [InstagramPosts, setInstagramPosts] = useState([]);
  const [InstagramReels, setInstagramReels] = useState([]);
  const [metaAds, setMetaAds] = useState([]);
  const [instaAds, setInstaAds] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeFilter, setActiveFilter] = useState(null);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [playingVideo, setPlayingVideo] = useState(null);
  const reportRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);
  const [activeSection, setActiveSection] = useState('PostsSummary');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Section refs for navigation
  // const sectionRefs = {
  //   PostsSummary: useRef(null),
  //   MetaAdsPerformance: useRef(null),
  //   FacebookAdsPerformance: useRef(null),
  //   InstagramAdsPerformance: useRef(null),
  //   GoogleAdsPerformance: useRef(null),
  //   FacebookPosts: useRef(null),
  //   FacebookReels: useRef(null),
  //   InstagramPosts: useRef(null),
  //   InstagramReels: useRef(null),
  // };


  
  const [activeTab, setActiveTab] = useState('PostsSummary');
  const tabBarItems = [
    'PostsSummary',
    'MetaAdsPerformance',
    'FacebookAdsPerformance',
    'InstagramAdsPerformance',
    'GoogleAdsPerformance',
    'FacebookPosts',
    'FacebookReels',
    'InstagramPosts',
    'InstagramReels'
  ];
  
  // 1. Fix the sectionRefs initialization (replace your current implementation)
const sectionRefs = useMemo(() => {
  const refs = {};
  tabBarItems.forEach(tab => {
    refs[tab] = React.createRef();
  });
  return refs;
}, [tabBarItems]);

// 2. Update your scroll handler (replace your current useEffect)
useEffect(() => {
  const handleScroll = () => {
    setShowBackToTop(window.scrollY > 300);
    setIsSticky(window.scrollY > 0);

    const stickyNavHeight = document.querySelector('.sticky-nav-container')?.offsetHeight || 0;
    const scrollPosition = window.scrollY + stickyNavHeight + 10; // Add small buffer

    let currentTab = tabBarItems[0]; // Default to first tab
    
    for (const tab of tabBarItems) {
      const section = sectionRefs[tab]?.current;
      if (section) {
        const { top, height } = section.getBoundingClientRect();
        const sectionTop = top + window.scrollY;
        const sectionBottom = sectionTop + height;

        if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
          currentTab = tab;
          break;
        }
      }
    }

    console.log(currentTab,"here is tsb")

    setActiveTab(currentTab);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, [tabBarItems]);


  // Function to handle navigation clicks
  const handleNavClick = (tab, index) => {
    const section = sectionRefs[tab]?.current;
    setActiveTab(tab);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    setPageTitle("Overview of Ads Report");

    const fetchCampaignData = async () => {
      try {
        const [metaAdsRes, instaAdsRes, facebookResponse, instagramResponse,googleads,campaigndata] = await Promise.all([
          fetch(`${site_url}/saved-meta-ads`).then((res) => res.json()),
          fetch(`${site_url}/saved-meta-ads2`).then((res) => res.json()),
          fetch(`${site_url}/facebook`).then((res) => res.json()),
          fetch(`${site_url}/instagram`).then((res) => res.json()),
          fetch(`${site_url}/google-ads`).then((res) => res.json()),
          fetch(`${site_url}/campaign-data`).then((res) => res.json()),
        ]);
        
        console.log("Meta Ads API Response:", metaAdsRes);
        console.log("Insta Ads API Response:", instaAdsRes);
        console.log("Google ads Ads API Response:", googleads);
        console.log("Campaign Ads API Response:", campaigndata);
        console.log("Facebook API Response:", facebookResponse);

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

      } catch (error) {
        console.error("Error fetching campaign data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignData();
  }, [setPageTitle, setInstaPostCount]);

  const handlePrint = () => {
    window.print();
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    setActiveFilter(null);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    setActiveFilter(null);
  };

  const applyQuickFilter = (days) => {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - days);

    setStartDate(pastDate.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);
    setActiveFilter(days);
  };

  const filteredFacebookPosts = FacebookPosts.filter(post => {
    if (!post.created_time) return false;
    const postDate = new Date(post.created_time);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    return (!start || postDate >= start) && (!end || postDate <= end);
  });

  const filteredFacebookReels = FacebookReels.filter((reel) => {
    if (!reel.created_time) return false;
    const postDate = new Date(reel.created_time);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    return (!start || postDate >= start) && (!end || postDate <= end);
  });

  const filteredInstagramPosts = InstagramPosts.filter(post => {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
<div>
           <div className={`sticky-nav-container ${isSticky ? 'sticky' : ''}`}>
                        <div className="sticky-nav">
                        {tabBarItems.map(tab => (
                        <div 
                          key={tab} 
                          ref={sectionRefs[tab]}
                          className="pdf-section"
                          style={{ scrollMarginTop: '150px' }}
                        >
                          {/* Your section content */}
                            <button
                              key={tab}
                              onClick={() => handleNavClick(tab)}
                              className={`tab_button ${activeTab === tab ? "active":""}`}
                            >
                              {tab.split(/(?=[A-Z])/).join(' ')}
                            </button>
                            </div>
                          ))}
                        </div>
                      </div>
     {/* Back to Top Button */}
     {showBackToTop && (
    <button 
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 z-50"
      aria-label="Back to top"
    >
      <FaArrowUp size={20} />
    </button>
  )}

    <div className="p-6 ">
      <div>
      {/* Sticky Navigation */}
  

      {/* Posts Summary Section */}
      <div ref={sectionRefs.PostsSummary} className="pdf-section"style={{ scrollMarginTop: '170px'}}>
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
                  <td className="border px-4 py-2" style={{ textAlign: 'center' }}>{FacebookPosts.length}</td>
                  <td className="border px-4 py-2" style={{ textAlign: 'center' }}>{FacebookReels.length}</td>
                  <td className="border px-4 py-2" style={{ textAlign: 'center' }}>{setInstaPostCount2}</td>
                </tr>
                <tr className="border border-gray-300 hover:bg-gray-100">
                  <td className="border px-4 py-2" style={{ textAlign: 'center' }}>Instagram</td> 
                  <td className="border px-4 py-2" style={{ textAlign: 'center' }}>{setInstaPostCount1}</td>
                  <td className="border px-4 py-2" style={{ textAlign: 'center' }}>{InstagramPosts.length}</td>
                  <td className="border px-4 py-2" style={{ textAlign: 'center' }}>{InstagramReels.length}</td>
                  <td className="border px-4 py-2" style={{ textAlign: 'center' }}>{setInstaPostCount1}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Meta Ads Performance Section */}
      <div ref={sectionRefs.MetaAdsPerformance} className="pdf-section py-8"style={{ scrollMarginTop: '150px'}}>
        <div className="p-4">
          <div className="total">
            <MetaAdsInstaSummary startDate={startDate} endDate={endDate} />
          </div>
        </div>
      </div>

      {/* Facebook Ads Performance Section */}
      <div ref={sectionRefs.FacebookAdsPerformance} className="pdf-section"style={{ scrollMarginTop: '150px'}}>
        <Facebookadsforreport startDate={startDate} endDate={endDate} />
      </div>

      {/* Instagram Ads Performance Section */}
      <div ref={sectionRefs.InstagramAdsPerformance} className="pdf-section"style={{ scrollMarginTop: '150px'}}>
        <Instagramadsforreport startDate={startDate} endDate={endDate} />
      </div>

      {/* Google Ads Performance Section */}
      <div ref={sectionRefs.GoogleAdsPerformance} className="pdf-section"style={{ scrollMarginTop: '150px'}}>
        <Googleadforreport startDate={startDate} endDate={endDate} />
      </div>

      {/* Facebook Posts Section */}
      <div ref={sectionRefs.FacebookPosts} className="pdf-section"style={{ scrollMarginTop: '150px'}}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <h3 className="text-2xl font-bold mb-4">Facebook Post ({FacebookPosts.length})</h3>
          <h3 className="text-2xl font-bold mb-4"></h3>
          {filteredFacebookPosts.length > 0 ? (
            filteredFacebookPosts.map((post, index) => {
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

      {/* Facebook Reels Section */}
      <div ref={sectionRefs.FacebookReels} className="pdf-section"style={{ scrollMarginTop: '150px'}}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <h3 className="text-2xl font-bold mb-4">Facebook Reels({FacebookReels.length})</h3>
          <h3 className="text-2xl font-bold mb-4"></h3>
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
<div ref={sectionRefs.InstagramPosts} className="pdf-section"style={{ scrollMarginTop: '150px'}}>
           
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <h3 className="text-2xl font-bold mb-4">Instagram Posts ({InstagramPosts.length})</h3>
            <h3 className="text-2xl font-bold mb-4"></h3>
         
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
                                    No posts found.
                                </p>
                            )}
                        </div>
                        </div>

                        <div ref={sectionRefs.InstagramReels} className="pdf-section"style={{ scrollMarginTop: '150px'}}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <h3 className="text-2xl font-bold mb-4">Instagram Reels ({InstagramReels.length})</h3>
        <h3 className="text-2xl font-bold mb-4"></h3>
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
    </div>
  );
};

export default AdsReportPage;

