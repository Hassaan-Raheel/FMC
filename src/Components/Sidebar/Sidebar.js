import React, { useState, useEffect } from "react";
import LogoImg from "../../Assets/Images/updatedLogo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { CgChevronDown } from "react-icons/cg";
import { BiLogOutCircle } from "react-icons/bi";
import "./Sidebar.css";

/* Import images for the categories */
import Dashboard_Icon from "../../Assets/Icons/Primary/Updated Icons/dashboard.png";
import Pages_Icon from "../../Assets/Icons/Primary/Updated Icons/pages.png";
import ECommerce_Icon from "../../Assets/Icons/Primary/Updated Icons/ecommerce.png";
import Appointment_Icon from "../../Assets/Icons/Primary/Updated Icons/appointment.png";
import Analytics_Icon from "../../Assets/Icons/Primary/Updated Icons/analytics.png";
import Marketing_Icon from "../../Assets/Icons/Primary/Updated Icons/marketing.png";
import Settings_Icon from "../../Assets/Icons/Primary/Updated Icons/setting.png";
import Blogs_Icon from "../../Assets/Icons/Primary/Updated Icons/blog.png";
import Security_Icon from "../../Assets/Icons/Primary/Updated Icons/security.png";
import AddsOn_Icon from "../../Assets/Icons/Primary/Updated Icons/addon.png";
import Performance_Icon from "../../Assets/Icons/Primary/Updated Icons/performance.png";
import Integrations_Icon from "../../Assets/Icons/Primary/Updated Icons/ads.png";
import SEO_Icon from "../../Assets/Icons/Primary/Updated Icons/seo.png";
import Forms_Icon from "../../Assets/Icons/Primary/Updated Icons/form.png";
import Header_Icon from "../../Assets/Icons/Primary/Updated Icons/header.png";

/* ---Sidebar Attributes--- */

const pagesAttributes = [
  { name: "Home", path: "/pages/home" },
  { name: "Categories", path: "/pages/categories" },
  { name: "FAQs", path: "/pages/faqs" },
  { name: "Active Sale", path: "/pages/active-sale" },
  { name: "About", path: "/pages/about" },
  { name: "Financing", path: "/pages/financing" },
  { name: "Shipping & Delivery", path: "/pages/shipping-delivery" },
  { name: "Terms & Conditions", path: "/pages/terms-conditions" },
  { name: "Privacy Policy", path: "/pages/privacy-policy" },
  { name: "Return Policy", path: "/pages/return-policy" },
];

const eComAttributes = [
  { name: "All Orders", path: "/ecommerce/all-orders" },
  { name: "All Products", path: "/ecommerce/all-products" },
  { name: "Add Product", path: "/ecommerce/add-product" },
  { name: "Product Categories", path: "/ecommerce/product-categories" },
  { name: "Product Attributes", path: "/ecommerce/product-attributes" },
  { name: "Product Tags", path: "/ecommerce/product-tags" },
  { name: "Product Reviews", path: "/ecommerce/product-reviews" },
  { name: "Customers", path: "/ecommerce/customers" },
  { name: "Settings", path: "/ecommerce/settings/shipping" },
];

const headFootAttributes = [
  { name: "Header", path: "/header-footer/header" },
  { name: "Footer", path: "/header-footer/footer" },
];

const appointAttributes = [
  { name: "All Appointments", path: "/appointments/all-appointments" },
  { name: "Appointments Planner", path: "/appointments/appointments-planner" },
];

const securityAttributes = [
  { name: "Rate Limit", path: "/security/rate-limit" },
  { name: "FireWall", path: "/security/firewall" },
];

const analyticsAttributes = [
  { name: "Overview", path: "/analytics/overview" },
  { name: "Products", path: "/analytics/products" },
  { name: "Revenue", path: "/analytics/revenue" },
  { name: "Order", path: "/analytics/order" },
];

const marketingAttributes = [
  { name: "Overview", path: "/marketing/Overview" },
  { 
    name: "Meta Ads", 
    path: "/marketing/MetaAds",
    subcategories: [
      { name: "Facebook Ads", path: "/marketing/MetaAds/FacebookAds" },
      { name: "Instagram Ads", path: "/marketing/MetaAds/InstagramAds" },
    ]
  },
  { 
    name: "Google Ads", 
    path: "/marketing/googleads",
    subcategories: [
      { name: "Overview", path: "/marketing/googleads/overview" },
      { name: "Campaign Details", path: "/marketing/googleads/CampaignDetails" },
    ]
  },
  { 
    name: "Content", 
    path: "/marketing/content",
    subcategories: [
      { name: "Facebook Post", path: "/marketing/facebook/Posts" },
      { name: "Facebook Reels", path: "/marketing/instagram/Reels" },
      { name: "Covers", path: "/marketing/Covers" },
      { name: "instagram Posts", path: "/marketing/facebook/Posts" },
      { name: "instagram Reels", path: "/marketing/instagram/Reels" },
    ]
  },
 
  // { name: "Tik Tok", path: "/marketing/tik-tok" },
  // { name: "Google Ads", path: "/marketing/google-ads" },
];

const settingsAttributes = [
  { name: "Users", path: "/settings/users" },
  { name: "History", path: "/settings/history" },
  { name: "Time Zones", path: "/settings/time-zones" },
];

const formsAttributes = [
  { name: "All Forms", path: "/forms/all-forms" },
  { name: "Add Form", path: "/forms/add-form" },
];

const blogsAttributes = [
  { name: "All Blogs", path: "/blogs/all-blogs" },
  { name: "Add Blog", path: "/blogs/add-blog" },
  { name: "Categories", path: "/blogs/categories" },
  { name: "Tags", path: "/blogs/tags" },
];

const seoAttributes = [
  { name: "Home Page", path: "/seo/home" },
  { name: "Category Page", path: "/seo/category" },
  { name: "Active Sale Page", path: "/seo/active-sale" },
  { name: "Product Archive Page", path: "/seo/product-archive" },
  { name: "Product Page", path: "/seo/product" },
  { name: "Cart Page", path: "/seo/cart" },
  { name: "CheckOut Page", path: "/seo/checkout" },
  { name: "Terms & Conditions", path: "/seo/terms-conditions" },
  { name: "Privacy Policy", path: "/seo/privacy-policy" },
  { name: "Refund Policy", path: "/seo/refund-policy" },
  { name: "Financing Page", path: "/seo/financing" },
  { name: "Careers Page", path: "/seo/careers" },
  { name: "Contact Us", path: "/seo/contact-us" },
  { name: "Store Locator", path: "/seo/store-locator" },
];

const integrationAttributes = [
  { name: "Search Console", path: "/integration/search-console" },
  { name: "Google", path: "/integration/google" },
  { name: "Bing", path: "/integration/bing" },
  { name: "Yahoo", path: "/integration/yahoo" },
  { name: "Google Analytics", path: "/integration/google-analytics" },
  { name: "Google Tags Manager", path: "/integration/google-tags-manager" },
  { name: "Meta", path: "/integration/meta" },
  { name: "Tik Tok", path: "/integration/tik-tok" },
];

const performanceAttributes = [
  { name: "In Sight", path: "/performance/in-sight" },
  { name: "Database Insight", path: '/performance/database-in-sight' },
  { name: "Server Logs", path: '/performance/server-logs' }
];

const addOnsAttributes = [
  { name: "Coupons", path: "/add-ons/coupons" },
  { name: "Price Tags", path: "/add-ons/price-tags" },
];

function Sidebar() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedChildren, setSelectedChildren] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openSubDropdowns, setOpenSubDropdowns] = useState({});
  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const categories = [
    {
      name: "Dashboard",
      path: "/dashboard",
      grayImage: Dashboard_Icon,
      colorImage: Dashboard_Icon,
      isDropdown: false,
    },
    {
      name: "Header / Footer",
      path: "/header-footer",
      grayImage: Header_Icon,
      colorImage: Header_Icon,
      isDropdown: false,
      attributes: headFootAttributes,
    },
    {
      name: "Pages",
      path: "/pages",
      grayImage: Pages_Icon,
      colorImage: Pages_Icon,
      isDropdown: true,
      attributes: pagesAttributes,
    },
    {
      name: "E-Commerce",
      path: "/ecommerce",
      grayImage: ECommerce_Icon,
      colorImage: ECommerce_Icon,
      isDropdown: true,
      attributes: eComAttributes,
    },
    {
      name: "Appointments",
      path: "/appointments",
      grayImage: Appointment_Icon,
      colorImage: Appointment_Icon,
      isDropdown: true,
      attributes: appointAttributes,
    },
    {
      name: "SEO",
      path: "/seo",
      grayImage: SEO_Icon,
      colorImage: SEO_Icon,
      isDropdown: true,
      attributes: seoAttributes,
    },
    {
      name: "Analytics",
      path: "/analytics",
      grayImage: Analytics_Icon,
      colorImage: Analytics_Icon,
      isDropdown: true,
      attributes: analyticsAttributes,
    },
    {
      name: "Forms",
      path: "/forms",
      grayImage: Forms_Icon,
      colorImage: Forms_Icon,
      isDropdown: true,
      attributes: formsAttributes,
    },
    {
      name: "Blogs",
      path: "/blogs",
      grayImage: Blogs_Icon,
      colorImage: Blogs_Icon,
      isDropdown: true,
      attributes: blogsAttributes,
    },
    {
      name: "Marketing",
      path: "/marketing",
      grayImage: Marketing_Icon,
      colorImage: Marketing_Icon,
      isDropdown: true,
      attributes: marketingAttributes,
    },
    {
      name: "Integration",
      path: "/integration",
      grayImage: Integrations_Icon,
      colorImage: Integrations_Icon,
      isDropdown: true,
      attributes: integrationAttributes,
    },
    {
      name: "Performance",
      path: "/performance",
      grayImage: Performance_Icon,
      colorImage: Performance_Icon,
      isDropdown: true,
      attributes: performanceAttributes,
    },
    {
      name: "Security",
      path: "/security",
      grayImage: Security_Icon,
      colorImage: Security_Icon,
      isDropdown: true,
      attributes: securityAttributes,
    },
    {
      name: "Add Ons",
      path: "/add-ons",
      grayImage: AddsOn_Icon,
      colorImage: AddsOn_Icon,
      isDropdown: true,
      attributes: addOnsAttributes,
    },
    {
      name: "Settings",
      path: "/settings",
      grayImage: Settings_Icon,
      colorImage: Settings_Icon,
      isDropdown: true,
      attributes: settingsAttributes,
    },
  ];

  useEffect(() => {
    const path = location.pathname;
    let foundParentIndex = null;
    let foundChildIndex = null;
    let foundSubChildIndex = null;

    categories.forEach((category, parentIndex) => {
      // Check if current path matches the main category path
      if (category.path === path) {
        foundParentIndex = parentIndex;
        return;
      }

      // Check dropdown items
      if (category.isDropdown && category.attributes) {
        category.attributes.forEach((attr, attrIndex) => {
          // Check if path matches dropdown item path
          if (attr.path === path) {
            foundParentIndex = parentIndex;
            foundChildIndex = attrIndex;
            return;
          }

          // Check subdropdown items
          if (attr.subcategories) {
            attr.subcategories.forEach((sub, subIndex) => {
              if (sub.path === path) {
                foundParentIndex = parentIndex;
                foundChildIndex = attrIndex;
                foundSubChildIndex = subIndex;
                setOpenSubDropdowns(prev => ({
                  ...prev,
                  [`${parentIndex}-${attrIndex}`]: true
                }));
                return;
              }
            });
          }
        });
      }
    });

    if (foundParentIndex !== null) {
      setSelectedIndex(foundParentIndex);
      setOpenDropdown(foundParentIndex);
      if (foundChildIndex !== null) {
        setSelectedChildren({
          [foundParentIndex]: foundSubChildIndex !== null 
            ? `${foundChildIndex}-${foundSubChildIndex}`
            : foundChildIndex
        });
      }
    }
  }, [location.pathname]);

  const handleMainItemClick = (index, path, isDropdown) => {
    if (isDropdown) {
      setOpenDropdown(openDropdown === index ? null : index);
    } else {
      setSelectedIndex(index);
      setSelectedChildren({});
      setOpenDropdown(null);
      navigate(path);
    }
  };

  const toggleSubDropdown = (parentIndex, attrIndex) => {
    const key = `${parentIndex}-${attrIndex}`;
    setOpenSubDropdowns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleDropdownItemClick = (path, parentIndex, attrIndex, hasSubcategories) => {
    if (hasSubcategories) {
      toggleSubDropdown(parentIndex, attrIndex);
    } else {
      navigate(path);
      setSelectedIndex(parentIndex);
      setSelectedChildren({
        [parentIndex]: attrIndex
      });
    }
  };

  const handleSubDropdownItemClick = (path, parentIndex, attrIndex, subIndex) => {
    navigate(path);
    setSelectedIndex(parentIndex);
    setSelectedChildren({
      [parentIndex]: `${attrIndex}-${subIndex}`
    });
  };

  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("username");
    localStorage.clear();
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <div className="logoSection">
        <img src={LogoImg} alt="Logo" className="logoImage" />
      </div>

      <div className="navSection">
        <nav>
          <ul>
            {categories.map((category, index) => (
              <React.Fragment key={index}>
                <li
                  className={`category-item ${
                    selectedIndex === index ? "active" : ""
                  }`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() =>
                    handleMainItemClick(index, category.path, category.isDropdown)
                  }
                >
                  <span
                    className={`navItem ${
                      selectedIndex === index ? "active" : ""
                    }`}
                  >
                    <span className="navItemContent">
                      <img
                        src={
                          hoveredIndex === index || selectedIndex === index
                            ? category.colorImage
                            : category.grayImage
                        }
                        alt={category.name}
                        className="catImage"
                      />
                      <p className="catName">{category.name}</p>
                    </span>
                    {category.isDropdown && (
                      <CgChevronDown
                        className={`dropdownIcon ${
                          openDropdown === index ? "open" : ""
                        }`}
                      />
                    )}
                  </span>
                </li>

                {/* Dropdown items */}
                {category.isDropdown && openDropdown === index && (
                  <ul className="dropdownList">
                    {category.attributes.map((attr, attrIndex) => (
                      <React.Fragment key={attrIndex}>
                        <li
                          className={`dropdownItem ${
                            selectedChildren[index] === attrIndex ||
                            (typeof selectedChildren[index] === 'string' && 
                             selectedChildren[index].startsWith(`${attrIndex}-`))
                              ? "active"
                              : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDropdownItemClick(
                              attr.path, 
                              index, 
                              attrIndex, 
                              attr.subcategories
                            );
                          }}
                        >
                          <div className="dropdownItemContent">
                            {attr.name}
                            {attr.subcategories && (
                              <CgChevronDown
                                className={`subdropdownIcon ${
                                  openSubDropdowns[`${index}-${attrIndex}`] ? "open" : ""
                                }`}
                              />
                            )}
                          </div>
                        </li>

                        {/* Subdropdown items */}
                        {attr.subcategories && openSubDropdowns[`${index}-${attrIndex}`] && (
                          <ul className="subDropdownList">
                            {attr.subcategories.map((sub, subIndex) => (
                              <li
                                key={subIndex}
                                className={`subDropdownItem ${
                                  selectedChildren[index] === `${attrIndex}-${subIndex}`
                                    ? "active"
                                    : ""
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSubDropdownItemClick(
                                    sub.path, 
                                    index, 
                                    attrIndex, 
                                    subIndex
                                  );
                                }}
                              >
                                {sub.name}
                              </li>
                            ))}
                          </ul>
                        )}
                      </React.Fragment>
                    ))}
                  </ul>
                )}
              </React.Fragment>
            ))}
          </ul>
        </nav>
      </div>

      <div className="logoutSection" onClick={handleLogout}>
        <BiLogOutCircle className="logoutIcon" />
        <p>Log Out</p>
      </div>
    </aside>
  );
}

export default Sidebar;