import React, { useState, useEffect } from "react";
import { NavLink, Routes, Route, useLocation } from "react-router-dom";
import { Home, Facebook, Instagram, Image, LogOut, ShoppingBag, ChevronDown, ChevronUp } from "lucide-react"; 
import { motion } from "framer-motion"; 
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import PostsPage from "../Facebook/PostsPage";
import InstagramPostsPage from "../Instagram/InstagramPostsPage";
import InstagramReelsPage from "../Instagram/InstagramReelsPage";
import ReelsPage from "../Facebook/ReelsPage";
import MetaAdsPage from "../MetaAds/MetaAdsPage";
import AdsReportsPage from "../AdsReports/AdsReportsPage";
import Covers from "../Covers/Covers";
import InstagramAds from "../InstagramAds/InstagramAds";
import DashboardHome from "../Home/DashboardHome";
import GoogleAdsOverviewPage from "../GoogleAds/GoogleAdsOverviewPage";
import CampaignDetailsPage from "../GoogleAds/CampaignDetailsPage";
import CompetitionPage from "../GoogleAds/CompetitionPage";
import ConversionsPage from "../GoogleAds/ConversionsPage";
import MerchantCenterPage from "../GoogleAds/MerchantCenterPage";
import MetaVsGooglePage from "../GoogleAds/MetaVsGooglePage";
import TrafficAudiencePage from "../GoogleAds/TrafficAudiencePage";
import PdfReport from "../PdfReport/PdfReport";
import { AdsProvider } from "../../Components/AdsContext";

import "../../Style.css";

const Dashboard = ({ handleLogout }) => {
  const [userName, setUserName] = useState("");
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [pageTitle, setPageTitle] = useState("Dashboard");

  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0); // Ensure page refresh
  }, [location.pathname]); // Runs every time route changes

  const printRef = useRef(); // Reference for printable content

  const handlePrint = useReactToPrint({
    content: () => {
      console.log("Print function triggered!"); // Debugging
      console.log("printRef.current:", printRef.current); // Check if content exists
      return printRef.current;
    },
    documentTitle: "Dashboard Report",
  });

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName") || "Admin";
    setUserName(storedUserName);
  }, []);

  useEffect(() => {
    setIsContentOpen(
      location.pathname.includes("/dashboard/content/facebook") ||
      location.pathname.includes("/dashboard/content/instagram")
    );
  }, [location]);

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const toggleSubmenu = (submenu) => {
    setActiveSubmenu(activeSubmenu === submenu ? null : submenu);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        {/* Sidebar */}
        <div className="sidebar">
          <NavLink to="/dashboard/" className="logo-container">
            <img src="/logo.png" alt="Logo" className="logo" />
          </NavLink>
          <div className="sidebar-menu-container">
            <ul className="sidebar-menu">
              <li>
                <NavLink to="/dashboard/" className="sidebar-link">
                  <Home size={18} className="icon" /> Home
                </NavLink>
              </li>

              <li>
                <div className="sidebar-link" onClick={() => toggleMenu("content")}>
                  <ShoppingBag size={18} className="icon" /> Content
                  {activeMenu === "content" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
                {activeMenu === "content" && (
                  <motion.ul className="submenu-list">
                    <li>
                      <div className="sidebar-link" onClick={() => toggleSubmenu("facebook")}>
                        <Facebook size={18} className="icon" /> Facebook
                        {activeSubmenu === "facebook" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                      {activeSubmenu === "facebook" && (
                        <motion.ul className="submenu-list">
                          <li><NavLink to="/dashboard/content/facebook/posts" className="sidebar-link">Posts</NavLink></li>
                          <li><NavLink to="/dashboard/content/facebook/reels" className="sidebar-link">Reels</NavLink></li>
                        </motion.ul>
                      )}
                    </li>

                    <li>
                      <div className="sidebar-link" onClick={() => toggleSubmenu("instagram")}>
                        <Instagram size={18} className="icon" /> Instagram
                        {activeSubmenu === "instagram" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                      {activeSubmenu === "instagram" && (
                        <motion.ul className="submenu-list">
                          <li><NavLink to="/dashboard/content/instagram/posts" className="sidebar-link">Posts</NavLink></li>
                          <li><NavLink to="/dashboard/content/instagram/reels" className="sidebar-link">Reels</NavLink></li>
                        </motion.ul>
                      )}
                    </li>

                    <li>
                      <NavLink to="/dashboard/content/covers" className="sidebar-link">
                        <Image size={18} className="icon" /> Covers
                      </NavLink>
                    </li>
                  </motion.ul>
                )}
              </li>

              <li>
                <div className="sidebar-link" onClick={() => toggleMenu("ads")}>
                  <ShoppingBag size={18} className="icon" /> Ads Reports
                  {activeMenu === "ads" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
                {activeMenu === "ads" && (
                  <motion.ul className="submenu-list">
                    <li>
                      <NavLink to="/dashboard/ads-reports/Overview" className="sidebar-link">
                      <ShoppingBag size={18} className="icon" />Overview</NavLink>
                    </li>

                    {/* Meta Ads Submenu */}
                    <li>
                      <div className="sidebar-link" onClick={() => toggleSubmenu("metaAds")}>
                        <ShoppingBag size={18} className="icon" /> Meta Ads
                        {activeSubmenu === "metaAds" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                      {activeSubmenu === "metaAds" && (
                        <motion.ul className="submenu-list">
                          <li><NavLink to="/dashboard/meta-ads/facebook" className="sidebar-link">Facebook Ads</NavLink></li>
                          <li><NavLink to="/dashboard/meta-ads/instagram" className="sidebar-link">Instagram Ads</NavLink></li>
                        </motion.ul>
                      )}
                    </li>

                    {/* Google Ads */}
                    <li>
                      <div className="sidebar-link" onClick={() => toggleSubmenu("googleAds")}>
                        <ShoppingBag size={18} className="icon" /> Google Ads
                        {activeSubmenu === "googleAds" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                      {activeSubmenu === "googleAds" && (
                        <motion.ul className="submenu-list">
                          <li><NavLink to="/dashboard/google-ads/overview" className="sidebar-link">Overview</NavLink></li>
                          <li><NavLink to="/dashboard/google-ads/traffic-audience" className="sidebar-link">Traffic & Audience</NavLink></li>
                          <li><NavLink to="/dashboard/google-ads/campaign-details" className="sidebar-link">Campaign Details</NavLink></li>
                          <li><NavLink to="/dashboard/google-ads/conversions" className="sidebar-link">Conversions</NavLink></li>
                          <li><NavLink to="/dashboard/google-ads/merchant-center" className="sidebar-link">Google Merchant Center</NavLink></li>
                          <li><NavLink to="/dashboard/google-ads/competition" className="sidebar-link">Competition</NavLink></li>
                          <li><NavLink to="/dashboard/google-ads/meta-vs-google" className="sidebar-link">Meta Ads vs. Google Ads</NavLink></li>
                        </motion.ul>
                      )}
                    </li>
                  </motion.ul>
                )}
              </li>

              <li>
                <div className="sidebar-link logout" onClick={handleLogout}>
                  <LogOut size={18} className="icon" /> Logout
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="navbar">
            <div className="navbar-center">
              <h4 className="text-2xl font-bold">{pageTitle}</h4>
            </div>
            <div className="navbar-right">
              <div className="profile-info">
                <span className="username">{userName || "Admin"}</span>
                <img src="../public/pp.png" alt="Profile" className="profile-pic" />
              </div>
            </div>
          </div>

          <div className="content-box" id="dashboard-content">
            <Routes>
              <Route path="/" element={<DashboardHome setPageTitle={setPageTitle} />} />
              <Route path="content/facebook/posts" element={<PostsPage setPageTitle={setPageTitle} />} />
              <Route path="content/facebook/reels" element={<ReelsPage setPageTitle={setPageTitle} />} />
              <Route path="content/instagram/posts" element={<InstagramPostsPage setPageTitle={setPageTitle} />} />
              <Route path="content/instagram/reels" element={<InstagramReelsPage setPageTitle={setPageTitle} />} />
              <Route path="content/covers" element={<Covers setPageTitle={setPageTitle} />} />
              <Route path="meta-ads/facebook" element={<MetaAdsPage setPageTitle={setPageTitle} />} />
              <Route path="meta-ads/instagram" element={<InstagramAds setPageTitle={setPageTitle} />} />
              <Route path="google-ads/overview" element={<GoogleAdsOverviewPage setPageTitle={setPageTitle} />} />
              <Route path="google-ads/traffic-audience" element={<TrafficAudiencePage setPageTitle={setPageTitle} />} />
              <Route path="google-ads/campaign-details" element={<CampaignDetailsPage setPageTitle={setPageTitle} />} />
              <Route path="google-ads/conversions" element={<ConversionsPage setPageTitle={setPageTitle} />} />
              <Route path="google-ads/merchant-center" element={<MerchantCenterPage setPageTitle={setPageTitle} />} />
              <Route path="google-ads/competition" element={<CompetitionPage setPageTitle={setPageTitle} />} />
              <Route path="google-ads/meta-vs-google" element={<MetaVsGooglePage setPageTitle={setPageTitle} />} />
              <Route path="pdfreports" element={<PdfReport setPageTitle={setPageTitle} />} />
              <Route path="ads-reports/Overview" element={<AdsReportsPage setPageTitle={setPageTitle} />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;