import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyToken } from '../Services/auth'; // Import the verifyToken function
import { getToken } from '../Services/auth'; // Import the getToken function
import './Page.css';
import './Dashbaord.css'
import categoryImage from '../Assets/check-images/New-Jersey-images-1-600x400 1.png'
import AdvertisingHead from '../Components/DashboardComponents/AdvertisingHead/AdvertisingHead';
import OrderDetails from '../Components/DashboardComponents/OrdersDetails/OrderDetails';
import RavenueChart from '../Components/DashboardComponents/RavenueChart/RavenueChart';
import RecentOrders from '../Components/DashboardComponents/RecentOrders/RecentOrders';
import UserInfo from '../Components/DashboardComponents/UserInfo/UserInfo';
import SalesPerformance from '../Components/DashboardComponents/SalesPerformance/SalesPerformance';
import TopCategories from '../Components/DashboardComponents/TopCategories/TopCategories';
import Tempreture from '../Components/DashboardComponents/Tempreture/Tempreture';
import { UrlHub, UrlHost } from "../Services/Api";

const Dashboard = () => {
  // const navigate = useNavigate();
  // const intervalRef = useRef(null); // Ref to store interval ID
  // const [isChecking, setIsChecking] = useState(false); // Track token check status
  // const [hasNavigated, setHasNavigated] = useState(false); // Track if navigation has occurred

  // const checkTokenValidity = useCallback(async () => {
  //   setIsChecking(true); // Set checking status to true
  //   const token = getToken(); // Retrieve the token

  //   if (token) {
  //     const isValid = await verifyToken(token);
  //     if (!isValid && !hasNavigated) {
  //       setHasNavigated(true); // Prevent multiple navigations
  //       navigate('/login'); // Redirect to login if token is invalid
  //     }
  //   } else if (!hasNavigated) {
  //     setHasNavigated(true); // Prevent multiple navigations
  //     navigate('/login'); // Redirect if no token found
  //   }
    
  //   setIsChecking(false); // Reset checking status
  // }, [hasNavigated, navigate]); // Add hasNavigated and navigate as dependencies

  // useEffect(() => {
  //   // Check token validity immediately when component mounts
  //   checkTokenValidity();

  //   // Set an interval to check token validity every 5 minutes
  //   intervalRef.current = setInterval(() => {
  //     if (!isChecking) {
  //       checkTokenValidity(); // Call check only if not currently checking
  //     }
  //   }, 5 * 60 * 1000);

  //   // Clean up the interval on component unmount
  //   return () => clearInterval(intervalRef.current);
  // }, [checkTokenValidity, isChecking]); // Add checkTokenValidity and isChecking as dependencies

  const topCategoriesData = [
          {img: categoryImage, name: 'Home Decor', val: '92/112', percentage: '82' },
          {img: categoryImage, name: 'Living Room', val: '92/112', percentage: '40' },
          {img: categoryImage, name: 'Dining Room', val: '92/112', percentage: '54' },
          {img: categoryImage, name: 'Bed Room', val: '92/112', percentage: '66' },
      ]
  
  return (
    <div className="HomePage">
      <div className='dashboard-main-page'>
        <div className='left-side-widgets'>
          <AdvertisingHead />
          <OrderDetails />
          <RavenueChart />
          <RecentOrders heading={'Recent Order'} />
          <RecentOrders heading={'Website Statistics'} />
        </div>
        <div className='right-side-widgets'>
          <UserInfo />
          <div className='dashboard-sale-performance-and-firewall'>
            <SalesPerformance />
            <Tempreture />
          </div>
          <TopCategories data={topCategoriesData} heading={'Top Categories'} />
          <TopCategories data={topCategoriesData} heading={'Top Products'} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;