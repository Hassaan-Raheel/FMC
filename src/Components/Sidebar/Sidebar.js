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
  { name: "Home", path: "/Pages/Home" },
  { name: "Categories", path: "/Pages/Categories" },
  { name: "FAQs", path: "/Pages/faqs" },
  { name: "Active Sale", path: "/Pages/Active-Sale" },
  { name: "About", path: "/Pages/About" },
  { name: "Financing", path: "/Pages/Financing" },
  { name: "Shipping & Delivery", path: "/Pages/Shipping-&-Delivery" },
  { name: "Terms & Conditions", path: "/Pages/Terms-&-Conditions" },
  { name: "Privacy Policy", path: "/Pages/Privacy-Policy" },
  { name: "Return Policy", path: "/Pages/Return-Policy" },
];

const eComAttributes = [
  { name: "All Orders", path: "/E-Commerce/All-Orders" },
  { name: "All Products", path: "/E-Commerce/All-Products" },
  { name: "Add Product", path: "/E-Commerce/Add-Product" },
  { name: "Product Categories", path: "/E-Commerce/Product-Categories" },
  { name: "Product Attributes", path: "/E-Commerce/Product-Attributes" },
  { name: "Product Tags", path: "/E-Commerce/Product-Tags" },
  { name: "Product Reviews", path: "/E-Commerce/Product-Reviews" },
  { name: "Customers", path: "/E-Commerce/Customers" },
  { name: "Settings", path: "/E-Commerce/Settings/Shipping" },
];

const headFootAttributes = [
  { name: "Header", path: "/Header-Footer/Header" },
  { name: "Footer", path: "/Header-Footer/Footer" },
];

const appointAttributes = [
  { name: "All Appointments", path: "/Appointments/All-Appointments" },
  { name: "Appointments Planner", path: "/Appointments/Appointments-Planner" },
];

const securityAttributes = [
  { name: "Rate Limit", path: "/Security/Rate-Limit" },
  { name: "FireWall", path: "/Security/FireWall" },
];

const analyticsAttributes = [
  { name: "Overview", path: "/Analytics/Overview" },
  { name: "Products", path: "/Analytics/Products" },
  { name: "Revenue", path: "/Analytics/Revenue" },
  { name: "Order", path: "/Analytics/Order" },
];

const marketingAttributes = [
  { name: "Email", path: "/Marketing/Email" },
  { name: "Facebook", path: "/Marketing/Facebook" },
  { name: "Instagram", path: "/Marketing/Instagram" },
  { name: "Tik Tok", path: "/Marketing/Tik-Tok" },
  { name: "Google Ads", path: "/Marketing/Google-Ads" },
];

const settingsAttributes = [
  { name: "Users", path: "/Settings/Users" },
  { name: "History", path: "/Settings/History" },
  { name: "Time Zones", path: "/Settings/Time-Zones" },
];

const formsAttributes = [
  { name: "All Forms", path: "/Forms/All-Forms" },
  { name: "Add Form", path: "/Forms/Add-Form" },
];

const blogsAttributes = [
  { name: "All Blogs", path: "/Blogs/All-Blogs" },
  { name: "Add Blog", path: "/Blogs/Add-Blog" },
  { name: "Categories", path: "/Blogs/Categories" },
  { name: "Tags", path: "/Blogs/Tags" },
];

const seoAttributes = [
  { name: "Home Page", path: "/SEO/Home" },
  { name: "Category Page", path: "/SEO/Category" },
  { name: "Active Sale Page", path: "/SEO/Active-Sale" },
  { name: "Product Archive Page", path: "/SEO/Product-Archive" },
  { name: "Product Page", path: "/SEO/Product" },
  { name: "Cart Page", path: "/SEO/Cart" },
  { name: "CheckOut Page", path: "/SEO/CheckOut" },
  { name: "Terms & Conditions", path: "/SEO/Terms-&-Conditions" },
  { name: "Privacy Policy", path: "/SEO/Privacy-Policy" },
  { name: "Refund Policy", path: "/SEO/Refund-Policy" },
  { name: "Financing Page", path: "/SEO/Financing" },
  { name: "Careers Page", path: "/SEO/Careers" },
  { name: "Contact Us", path: "/SEO/Contact-Us" },
  { name: "Store Locator", path: "/SEO/Store-Locator" },
];

const integrationAttributes = [
  { name: "Search Console", path: "/Integration/Search-Console" },
  { name: "Google", path: "/Integration/Google" },
  { name: "Bing", path: "/Integration/Bing" },
  { name: "Yahoo", path: "/Integration/Yahoo" },
  { name: "Google Analytics", path: "/Integration/Google-Analytics" },
  { name: "Google Tags Manager", path: "/Integration/Google-Tags-Manager" },
  { name: "Meta", path: "/Integration/Meta" },
  { name: "Tik Tok", path: "/Integration/Tik-Tok" },
];

const performanceAttributes = [
  { name: "In Sight", path: "/Performance/In-Sight" },
  { name: "Database Insight", path: '/Performance/Database-In-Sight' },
  { name: "Server Logs", path: '/Performance/Server-Logs' }
];

const addOnsAttributes = [
  { name: "Coupons", path: "/Add-Ons/Coupons" },
  { name: "Price Tags", path: "/Add-Ons/Price-Tags" },
];

function Sidebar() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedChildren, setSelectedChildren] = useState(
    {}
  );
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const categories = [
    {
      name: "Dashboard",
      path: "/Dashboard",
      grayImage: Dashboard_Icon,
      colorImage: Dashboard_Icon,
      isDropdown: false,
    },
    {
      name: "Header / Footer",
      path: "/Header-Footer",
      grayImage: Header_Icon,
      colorImage: Header_Icon,
      isDropdown: false,
      attributes: headFootAttributes,
    },
    {
      name: "Pages",
      path: "/Pages",
      grayImage: Pages_Icon,
      colorImage: Pages_Icon,
      isDropdown: true,
      attributes: pagesAttributes,
    },
    {
      name: "E-Commerce",
      path: "/E-Commerce",
      grayImage: ECommerce_Icon,
      colorImage: ECommerce_Icon,
      isDropdown: true,
      attributes: eComAttributes,
    },
    {
      name: "Appointments",
      path: "/Appointments",
      grayImage: Appointment_Icon,
      colorImage: Appointment_Icon,
      isDropdown: true,
      attributes: appointAttributes,
    },
    {
      name: "SEO",
      path: "/SEO",
      grayImage: SEO_Icon,
      colorImage: SEO_Icon,
      isDropdown: true,
      attributes: seoAttributes,
    },
    {
      name: "Analytics",
      path: "/Analytics",
      grayImage: Analytics_Icon,
      colorImage: Analytics_Icon,
      isDropdown: true,
      attributes: analyticsAttributes,
    },
    {
      name: "Forms",
      path: "/Forms",
      grayImage: Forms_Icon,
      colorImage: Forms_Icon,
      isDropdown: true,
      attributes: formsAttributes,
    },
    {
      name: "Blogs",
      path: "/Blogs",
      grayImage: Blogs_Icon,
      colorImage: Blogs_Icon,
      isDropdown: true,
      attributes: blogsAttributes,
    },
    {
      name: "Marketing",
      path: "/Marketing",
      grayImage: Marketing_Icon,
      colorImage: Marketing_Icon,
      isDropdown: true,
      attributes: marketingAttributes,
    },
    {
      name: "Integration",
      path: "/Integration",
      grayImage: Integrations_Icon,
      colorImage: Integrations_Icon,
      isDropdown: true,
      attributes: integrationAttributes,
    },
    {
      name: "Performance",
      path: "/Performance",
      grayImage: Performance_Icon,
      colorImage: Performance_Icon,
      isDropdown: true,
      attributes: performanceAttributes,
    },
    {
      name: "Security",
      path: "/Security",
      grayImage: Security_Icon,
      colorImage: Security_Icon,
      isDropdown: true,
      attributes: securityAttributes,
    },
    {
      name: "Add Ons",
      path: "/Add-Ons",
      grayImage: AddsOn_Icon,
      colorImage: AddsOn_Icon,
      isDropdown: true,
      attributes: addOnsAttributes,
    },
    {
      name: "Settings",
      path: "/Settings",
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

    categories.forEach((category, parentIndex) => {
      if (category.isDropdown && category.attributes) {
        const childIndex = category.attributes.findIndex(
          (attr) => attr.path === path
        );
        if (childIndex !== -1) {
          foundParentIndex = parentIndex;
          foundChildIndex = childIndex;
        }
      } else if (category.path === path) {
        foundParentIndex = parentIndex;
      }
    });

    if (foundParentIndex !== null) {
      setSelectedIndex(foundParentIndex);
      setOpenDropdown(foundParentIndex);
      setSelectedChildren(
        foundChildIndex !== null ? { [foundParentIndex]: foundChildIndex } : {}
      );
    }
  }, [location.pathname]);

  const handleClick = (index, path, isDropdown) => {
    if (isDropdown) {
      setOpenDropdown(openDropdown === index ? null : index);
    } else {
      setSelectedIndex(index);
      setSelectedChildren(
        {}
      );
      setOpenDropdown(null);
      navigate(path);
    }
  };

  const handleDropdownClick = (attrPath, attrIndex, parentIndex) => {
    navigate(attrPath);
    setSelectedChildren({
      [parentIndex]: attrIndex,
    });
    setSelectedIndex(parentIndex);
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
                    handleClick(index, category.path, category.isDropdown)
                  }
                >
                  <span
                    className={`navItem ${
                      selectedIndex === index ? "active" : ""
                    }`}
                  >
                    <span>
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

                {category.isDropdown && openDropdown === index && (
                  <ul className="dropdownList">
                    {category.attributes.map((attr, attrIndex) => (
                      <li
                        key={attrIndex}
                        className={`dropdownItem ${
                          selectedChildren[index] === attrIndex ? "active" : ""
                        }`}
                        onClick={() =>
                          handleDropdownClick(attr.path, attrIndex, index)
                        }
                      >
                        {attr.name}
                      </li>
                    ))}
                  </ul>
                )}
              </React.Fragment>
            ))}
          </ul>
        </nav>
      </div>

      <div
        className="logoutSection"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          className={`logoutButton ${isHovered ? "square" : ""}`}
          onClick={handleLogout}
        >
          <BiLogOutCircle
            className={isHovered ? "logoutIcon-hovered" : "logoutIcon"}
          />
          {isHovered && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;