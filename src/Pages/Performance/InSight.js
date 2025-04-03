import React, { useState } from 'react';
import '../Page.css'; // Import the CSS file
import './InSight.css'
import { BsLaptop } from "react-icons/bs";
import { LuSmartphone } from "react-icons/lu";
import axios from 'axios';
import MainLoader from '../../Components/UI-Controls/MainLoader/MainLoader';
import { IoIosArrowDown } from "react-icons/io";

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { FaSquareFull } from "react-icons/fa6";
import { FaCircle } from "react-icons/fa";
import { IoTriangleSharp } from "react-icons/io5";


const InSights = () => {
  const [loading, setLoading] = useState(false)
  const [performanceData, setPerformanceData] = useState()
  const baseUrl = `https://furnituremecca.zellesolutions.com`;


  const screenTogglerData = [
    { name: 'Mobile', icon: <LuSmartphone size={20} /> },
    { name: 'Desktop', icon: <BsLaptop size={20} /> }
  ]

  const [selectedScreen, setSelectedScreen] = useState(screenTogglerData.length - 1);

  const handleScreenSelect = (index) => {
    setSelectedScreen((prevState) => prevState === index ? null : index)
  }

  const [chartData, setChartData] = useState([
    {
      name: 'Performance',
      fill: '#FFC750',
      backGround: 'rgba(255, 199, 80, 0.3)',
      percentage: 70
    },
    {
      name: 'Accessibility',
      fill: '#6BCF1E',
      backGround: 'rgba(107, 207, 30, 0.3)',
      percentage: 87
    },
    {
      name: 'Best Practices',
      fill: '#C61B1A',
      backGround: 'rgba(198, 27, 26, 0.3)',
      percentage: 90
    },
    {
      name: 'Performance',
      fill: '#6BCF1E',
      backGround: 'rgba(107, 207, 30, 0.3)',
      percentage: 82
    },
  ])

  // useEffect(() => {
  const fetchWebsitePerformanceData = async (pageUrl) => {
    if (selectedScreen === 0) {
      // const api = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://furnituremecca.zellesolutions.com&key=AIzaSyDHTJtwucktFk_RTSuvvRM5TTDn3k5Th1Y&strategy=mobile`;
      const api = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${pageUrl}&key=AIzaSyDHTJtwucktFk_RTSuvvRM5TTDn3k5Th1Y&strategy=mobile`;
      try {
        setLoading(true)
        const response = await axios.get(api);
        console.log("url performance check", response)
        setPerformanceData(response.data.lighthouseResult)
        console.log("performance data", performanceData?.audits?.['first-contentful-paint']?.score)
      } catch (error) {
        console.error("error geting performance data", error);
      }
      setLoading(false);
    } else {
      // const api = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://furnituremecca.zellesolutions.com&key=AIzaSyDHTJtwucktFk_RTSuvvRM5TTDn3k5Th1Y&strategy=desktop`;
      const api = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${pageUrl}&key=AIzaSyDHTJtwucktFk_RTSuvvRM5TTDn3k5Th1Y&strategy=desktop`;
      try {
        setLoading(true)
        const response = await axios.get(api);
        console.log("url performance check", response?.data?.lighthouseResult?.fullPageScreenshot?.screenshot?.data)
        setPerformanceData(response.data.lighthouseResult)
        console.log("performance data", performanceData?.audits?.['first-contentful-paint']?.score)
      } catch (error) {
        console.error("error geting performance data", error);
      }
      setLoading(false);
    }
  }
  //   fetchWebsitePerformanceData()
  // }, [selectedScreen])

  console.log("performance score", parseInt(performanceData?.categories?.performance?.score * 100))

  const [pageInsightDetails, setPageInsightDetails] = useState(false);
  const handlePAgeInsightDetails = () => {
    setPageInsightDetails(!pageInsightDetails)
  }

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("")

  const dropdownData = [
    { name: 'Home', url: baseUrl },
    { name: 'Categories', url: `${baseUrl}/living-rooms` },
    { name: 'Products List', url: `${baseUrl}/living-rooms/living-room-sets` },
    { name: 'Product Details', url: `${baseUrl}/product/cohen-sectional` },
    { name: 'About', url: `${baseUrl}/about-us` },
    { name: 'contact', url: `${baseUrl}/contact-us` },
    { name: 'Financing', url: `${baseUrl}/financing` },
    { name: 'Shipping & Delivery', url: `${baseUrl}/shipping-and-delivery` },
    { name: 'Terms & Conditions', url: `${baseUrl}/terms-and-conditions` },
    { name: 'Privacy Policy', url: `${baseUrl}/privacy-policy` },
    { name: 'Return Policy', url: `${baseUrl}/return-policy` },
  ]

  const [webPageUrl, setWebPageUrl] = useState(() => dropdownData?.[0]?.url)
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectOption = (item) => {
    setSelectedOption(item.name)
    setWebPageUrl(item.url)
    setShowPageOption(false)
    console.log("item url", item.url)
    setIsOpen(false)
  }

  const handleCheckPerformance = () => {
    fetchWebsitePerformanceData(webPageUrl)
  }

  const [showPagesOption, setShowPageOption] = useState(false);
  const handleShowPageBody = () => {
    setShowPageOption(!showPagesOption)
  }

  console.log("check chart score", performanceData?.categories?.performance?.score)



  return (
    <div className="HomePage" style={{ gap: '20px' }}>
      {/* {loading && <MainLoader />} */}

      <div className='performance-section-main'>

        <div className='performance-report-section'>

          <div className='performance-head-section'>
            <h3 className='performance-report-heading'>Performance Report</h3>

            <div className='insight-screen-toggler-section'>
              {screenTogglerData.map((item, index) => (
                <div
                  key={index}
                  className={`desktop-screen-single-toggler ${selectedScreen === index ? 'selected-desktop-screen-single-toggler' : ''}`}
                  onClick={() => handleScreenSelect(index)}
                >
                  {item.icon}
                  {/* <p>{item.name}</p> */}
                </div>
              ))}

            </div>

            <div className='performance-report-search-bar-container'>

              <div className="url-dropdown-main">
                <button className="dropdown-toggle" onClick={toggleDropdown}>
                  {selectedOption !== "" ? selectedOption : 'Select Option'}
                </button>

                {isOpen && (
                  <ul className="url-dropdown-menu">
                    {dropdownData.map((item, index) => (
                      <li key={index} onClick={() => {
                        handleSelectOption(item);
                        // fetchWebsitePerformanceData(item.url)
                      }}>{item.name}</li>
                    ))}
                  </ul>
                )}

              </div>

              <button onClick={handleCheckPerformance}>Analyze</button>
            </div>
          </div>

          <div className='performance-body'>
            {performanceData?.categories?.performance?.score !== undefined ? (

              <div className='performance-page-show'>

                <div className='performance-page-chart'>
                  <div className='performance-count-single-chart-and-title-div'>
                    <CircularProgressbar
                      value={performanceData?.categories?.performance?.score}
                      text={`${Number(performanceData?.categories?.performance?.score * 100).toFixed(0)}%`}
                      background={true}
                      maxValue={1}
                      className='circle-progress-bar'
                      styles={{
                        root: { // For overall styling
                          width: '150px',
                          height: '150px',
                        },
                        path: { // Styling for the progress path
                          stroke: parseInt(performanceData?.categories?.performance?.score * 100) > 89 && parseInt(performanceData?.categories?.performance?.score * 100) < 100 ? (
                            "#6BCF1E"
                          ) : parseInt(performanceData?.categories?.performance?.score * 100) > 50 && parseInt(performanceData?.categories?.performance?.score * 100) < 89 ? (
                            "#FFC750"
                          ) : (
                            "#C61B1A"
                          ),
                          strokeLinecap: 'round',
                        },
                        trail: { // Styling for the trail (background circle)
                          stroke: parseInt(performanceData?.categories?.performance?.score * 100) > 89 && parseInt(performanceData?.categories?.performance?.score * 100) < 100 ? (
                            'rgba(107, 207, 30, 0.3)'
                          ) : parseInt(performanceData?.categories?.performance?.score * 100) > 50 && parseInt(performanceData?.categories?.performance?.score * 100) < 89 ? (
                            'rgba(255, 199, 80, 0.3)'
                          ) : (
                            'rgba(198, 27, 26, 0.3)'
                          ),
                        },
                        text: { // Styling for the text inside the circle
                          fill: parseInt(performanceData?.categories?.performance?.score * 100) > 89 && parseInt(performanceData?.categories?.performance?.score * 100) < 100 ? (
                            "#6BCF1E"
                          ) : parseInt(performanceData?.categories?.performance?.score * 100) > 50 && parseInt(performanceData?.categories?.performance?.score * 100) < 89 ? (
                            "#FFC750"
                          ) : (
                            "#C61B1A"
                          ),
                          fontSize: '30px',
                          fontWeight: '600'
                        },
                        background: { // Background style
                          fill: parseInt(performanceData?.categories?.performance?.score * 100) > 89 && parseInt(performanceData?.categories?.performance?.score * 100) < 100 ? (
                            'rgba(107, 207, 30, 0.3)'
                          ) : parseInt(performanceData?.categories?.performance?.score * 100) > 50 && parseInt(performanceData?.categories?.performance?.score * 100) < 89 ? (
                            'rgba(255, 199, 80, 0.3)'
                          ) : (
                            'rgba(198, 27, 26, 0.3)'
                          ),
                        },
                      }}
                    />
                    <p>Performance</p>
                  </div>
                </div>

              </div>

            ) : (

              <div className='check-performance-page-select-main-container'>
                <div className='check-performance-dropdown-main'>
                  
                  <div className='dropdown-main'>

                    <div className='dropdown-performance-head' onClick={handleShowPageBody}>
                      <h3>{selectedOption !== "" ? selectedOption : 'Select Option'}</h3>
                      
                      <IoIosArrowDown size={20} />
                    </div>

                    <ul className={`dropdown-performance-body ${showPagesOption ? 'show-dropdown-body' : ''}`}>
                      {dropdownData.map((item, index) => (
                        <li key={index} onClick={() => {
                          handleSelectOption(item);
                          // fetchWebsitePerformanceData(item.url)
                        }}>{item.name}</li>
                      ))}
                    </ul>

                  </div>

                  <button className={loading ? 'show-loader' : ''} onClick={handleCheckPerformance}>{loading ? "" : "Analyze Performance"}</button>
                </div>
              </div>
              
            )}


            <div className='performance-matrices'>

              <div className='performance-matrices-head'>
                <div className='performance-matrices-indications'>
                  <p className='performance-matrices-heading'>Matrices</p>
                  <span>
                    <IoTriangleSharp size={25} style={{ color: '#C61B1A' }} />
                    <p>0 - 49</p>
                  </span>
                  <span>
                    <FaSquareFull size={25} style={{ color: '#FFC750' }} />
                    <p>50 - 89</p>
                  </span>
                  <span>
                    <FaCircle size={25} style={{ color: '#6BCF1E' }} />
                    <p>90 - 100</p>
                  </span>
                </div>
                <h3 className='performance-matrices-expend-heading' onClick={handlePAgeInsightDetails}>Expand View</h3>
              </div>

              <div className='performance-matrices-details-container'>

                {/* FCP */}
                <div className='performance-matrices-details-columns'>

                  <span className='performance-matrices-details-columns-heading'>
                    {
                      parseFloat(performanceData?.audits?.['first-contentful-paint']?.displayValue) > 0 && parseFloat(performanceData?.audits?.['first-contentful-paint']?.displayValue) < 0.9 ? (
                        <FaCircle size={30} color="#6BCF1E" />
                      ) : parseFloat(performanceData?.audits?.['first-contentful-paint']?.displayValue) > 0.9 && parseFloat(performanceData?.audits?.['first-contentful-paint']?.displayValue) < 1.6 ? (
                        <FaSquareFull size={30} color="#FFC750" />
                      ) : (
                        <IoTriangleSharp size={30} color="#C61B1A" />
                      )
                    }
                    <p>First Contentful paint</p>
                  </span>

                  <p 
                    className='performance-ping-data'
                    style={
                      {
                        color: parseFloat(performanceData?.audits?.['first-contentful-paint']?.displayValue) > 0 && parseFloat(performanceData?.audits?.['first-contentful-paint']?.displayValue) < 0.9 ? "#6BCF1E" :
                               parseFloat(performanceData?.audits?.['first-contentful-paint']?.displayValue) > 0.9 && parseFloat(performanceData?.audits?.['first-contentful-paint']?.displayValue) < 1.6 ? "#FFC750" :
                               "#C61B1A"
                      }
                    }
                  >
                    {performanceData?.audits?.['first-contentful-paint']?.displayValue}
                  </p>
                  
                  <div className={`performance-matrices-detail-section ${pageInsightDetails ? 'show-page-insight-details' : ''}`}>
                    <p>First Contentful Paint marks the time at which the first text or image is painted. <a href='https://developer.chrome.com/docs/lighthouse/performance/first-contentful-paint/?utm_source=lighthouse&utm_medium=lr'> Learn more about the First Contentful Paint metric. </a></p>
                  </div>
                </div>

                {/* LCP */}
                <div className='performance-matrices-details-columns'>
                  <span className='performance-matrices-details-columns-heading'>
                    {
                      parseFloat(performanceData?.audits?.['largest-contentful-paint']?.displayValue) > 0 && parseFloat(performanceData?.audits?.['largest-contentful-paint']?.displayValue) < 2.5 ? (
                        <FaCircle size={30} color="#6BCF1E" />
                      ) : parseFloat(performanceData?.audits?.['largest-contentful-paint']?.displayValue) > 2.5 && parseFloat(performanceData?.audits?.['largest-contentful-paint']?.displayValue) < 4 ? (
                        <FaSquareFull size={30} color="#FFC750" />
                      ) : (
                        <IoTriangleSharp size={30} color="#C61B1A" />
                      )
                    }
                    <p>Largest Contentful paint</p>
                  </span>
                  <p 
                    className='performance-ping-data'
                    style={
                      {
                        color: parseFloat(performanceData?.audits?.['largest-contentful-paint']?.displayValue) > 0 && parseFloat(performanceData?.audits?.['largest-contentful-paint']?.displayValue) < 2.5 ? "#6BCF1E" :
                               parseFloat(performanceData?.audits?.['largest-contentful-paint']?.displayValue) > 2.5 && parseFloat(performanceData?.audits?.['largest-contentful-paint']?.displayValue) < 4 ? "#FFC750" :
                               "#C61B1A"
                      }
                    }
                  >
                    {performanceData?.audits?.['largest-contentful-paint']?.displayValue}</p>
                  <div className={`performance-matrices-detail-section ${pageInsightDetails ? 'show-page-insight-details' : ''}`}>
                    <p>Largest Contentful Paint marks the time at which the largest text or image is painted. <a href='https://developer.chrome.com/docs/lighthouse/performance/lighthouse-largest-contentful-paint/?utm_source=lighthouse&utm_medium=lr'> Learn more about the Largest Contentful Paint metric </a></p>
                  </div>
                </div>

                {/* Blocking Time */}
                <div className='performance-matrices-details-columns'>
                  <span className='performance-matrices-details-columns-heading'>
                    {
                      parseInt(performanceData?.audits?.['total-blocking-time']?.displayValue) > 0 && parseInt(performanceData?.audits?.['total-blocking-time']?.displayValue) < 200 ? (
                        <FaCircle size={30} color="#6BCF1E" />
                      ) : parseInt(performanceData?.audits?.['total-blocking-time']?.displayValue) > 200 && parseInt(performanceData?.audits?.['total-blocking-time']?.displayValue) < 600 ? (
                        <FaSquareFull size={30} color="#FFC750" />
                      ) : (
                        <IoTriangleSharp size={30} color="#C61B1A" />
                      )
                    }
                    <p>Total Blocking Time</p>
                  </span>
                  <p 
                    className='performance-ping-data'
                    style={{
                      color: parseInt(performanceData?.audits?.['total-blocking-time']?.displayValue) > 0 && parseInt(performanceData?.audits?.['total-blocking-time']?.displayValue) < 200 ? "#6BCF1E" :
                             parseInt(performanceData?.audits?.['total-blocking-time']?.displayValue) > 200 && parseInt(performanceData?.audits?.['total-blocking-time']?.displayValue) < 600 ? "#FFC750" :
                             "#C61B1A"
                    }}
                  >
                    {performanceData?.audits?.['total-blocking-time']?.displayValue} 
                  </p>
                  <div className={`performance-matrices-detail-section ${pageInsightDetails ? 'show-page-insight-details' : ''}`}>
                    <p>Sum of all time periods between FCP and Time to Interactive, when task length exceeded 50ms, expressed in milliseconds. <a href='https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time/?utm_source=lighthouse&utm_medium=lr'> Learn more about the Total Blocking Time metric. </a></p>
                  </div>
                </div>

                {/* CLS */}
                <div className='performance-matrices-details-columns'>
                  <span className='performance-matrices-details-columns-heading'>
                    {
                      parseFloat(performanceData?.audits?.['cumulative-layout-shift']?.displayValue) > 0 && parseFloat(performanceData?.audits?.['cumulative-layout-shift']?.displayValue) < 0.1 ? (
                        <FaCircle size={30} color="#6BCF1E" />
                      ) : parseFloat(performanceData?.audits?.['cumulative-layout-shift']?.displayValue) > 0.1 && parseFloat(performanceData?.audits?.['cumulative-layout-shift']?.displayValue) < 0.25 ? (
                        <FaSquareFull size={30} color="#FFC750" />
                      ) : (
                        <IoTriangleSharp size={30} color="#C61B1A" />
                      )
                    }
                    <p>Cumulative Layout Shift</p>
                  </span>
                  <p 
                    className='performance-ping-data'
                    style={
                      {
                        color: parseFloat(performanceData?.audits?.['cumulative-layout-shift']?.displayValue) > 0 && parseFloat(performanceData?.audits?.['cumulative-layout-shift']?.displayValue) < 0.1 ? "#6BCF1E" :
                               parseFloat(performanceData?.audits?.['cumulative-layout-shift']?.displayValue) > 0.1 && parseFloat(performanceData?.audits?.['cumulative-layout-shift']?.displayValue) < 0.25 ? "#FFC750" :
                               "#C61B1A"

                      }
                    }
                  >
                    {performanceData?.audits?.['cumulative-layout-shift']?.displayValue}
                  </p>
                  <div className={`performance-matrices-detail-section ${pageInsightDetails ? 'show-page-insight-details' : ''}`}>
                    <p>Cumulative Layout Shift measures the movement of visible elements within the viewport. <a href='https://web.dev/articles/cls?utm_source=lighthouse&utm_medium=lr'> Learn more about the Cumulative Layout Shift metric. </a></p>
                  </div>
                </div>

                {/* Spee index */}
                <div className='performance-matrices-details-columns'>
                  <span className='performance-matrices-details-columns-heading'>
                    {
                      parseFloat(performanceData?.audits?.['speed-index']?.displayValue) > 0 && parseFloat(performanceData?.audits?.['speed-index']?.displayValue) < 3.4 ? (
                        <FaCircle size={30} color="#6BCF1E" />
                      ) : parseFloat(performanceData?.audits?.['speed-index']?.displayValue) > 3.4 && parseFloat(performanceData?.audits?.['speed-index']?.displayValue) < 5.8 ? (
                        <FaSquareFull size={30} color="#FFC750" />
                      ) : (
                        <IoTriangleSharp size={30} color="#C61B1A" />
                      )
                    }
                    <p>Speed Index</p>
                  </span>
                  <p 
                    className='performance-ping-data'
                    style={
                      {
                        color: parseFloat(performanceData?.audits?.['speed-index']?.displayValue) > 0 && parseFloat(performanceData?.audits?.['speed-index']?.displayValue) < 3.4 ? "#6BCF1E" :
                               parseFloat(performanceData?.audits?.['speed-index']?.displayValue) > 3.4 && parseFloat(performanceData?.audits?.['speed-index']?.displayValue) < 5.8 ? "#FFC750" :
                               "#C61B1A"
                      }
                    }
                  >
                    {performanceData?.audits?.['speed-index']?.displayValue}
                  </p>
                  <div className={`performance-matrices-detail-section ${pageInsightDetails ? 'show-page-insight-details' : ''}`}>
                    <p>Speed Index shows how quickly the contents of a page are visibly populated. <a href='https://developer.chrome.com/docs/lighthouse/performance/speed-index/?utm_source=lighthouse&utm_medium=lr'>Learn more about the Speed Index metric. </a></p>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default InSights;