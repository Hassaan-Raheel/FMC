// import { useEffect } from 'react';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const useTokenVerification = () => {
//     // Logout function to clear token and redirect to login
//     const handleLogout = () => {
//         sessionStorage.removeItem('authToken');
//         sessionStorage.removeItem('username');
//         window.location.href = '/'; // Redirect to login page
//     };

//     // Function to verify the token
//     const verifyToken = async () => {
//         const token = sessionStorage.getItem('authToken'); // Retrieve token from sessionStorage

//         if (!token) {
//             handleLogout(); // No token found, log the user out
//             return;
//         }

//         try {
//             const headers = {
//                 Authorization: token
//             };

//             const response = await axios.get('https://fm.skyhub.pk/api/v1/users/verify-token', { headers });

//             if (response.data.message === 'Token is valid.') {
//                 toast.success('Token is valid.');
//                 console.log("Token Status:", response.data.message);
//             } else {
//                 toast.error('Token verification failed.');
//                 handleLogout();
//             }
//         } catch (error) {
//             if (error.response && error.response.status === 401) {
//                 toast.error('Unauthorized: Invalid token.');
//                 handleLogout();
//             } else {
//                 toast.error(`Token verification error: ${error.message}`);
//                 handleLogout();
//             }
//         }
//     };

//     // Polling function to check token every 10 minutes
//     useEffect(() => {
//         const token = sessionStorage.getItem('authToken');
//         if (token) {
//             const intervalId = setInterval(verifyToken, 600000); // 10 minutes in milliseconds

//             return () => clearInterval(intervalId); // Clear interval on component unmount
//         }
//     }, []); // Empty dependency array to run once

//     return <ToastContainer position="top-right" autoClose={3000} />; // Customize toast container
// };

// export default useTokenVerification;


import { useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Url } from '../../Services/Api';

const useTokenVerification = () => {
    // Logout function to clear token and redirect to login
    const handleLogout = () => {
        sessionStorage.removeItem('authToken');
        window.location.href = '/'; // Redirect to login page
    };

    // Function to verify the token
    const verifyToken = async () => {
        const token = sessionStorage.getItem('authToken'); // Retrieve token from sessionStorage

        if (!token) {
            handleLogout(); // No token found, log the user out
            return;
        }

        try {
            const headers = {
                Authorization: token
            };

            const response = await axios.get(`${Url}/api/v1/users/verify-token`, { headers });

            if (response.data.message === 'Token is valid.') {
                toast.success('Token is valid.');
                console.log("Token Status:", response.data.message);
            } else {
                toast.error('Token verification failed.');
                handleLogout();
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error('Unauthorized: Invalid token.');
                handleLogout();
            } else {
                toast.error(`Token verification error: ${error.message}`);
                handleLogout();
            }
        }
    };

    // Function to notify user about session expiration
    const notifySessionExpiration = () => {
        toast.warn('Alert: Your session has been logged out soon... Be ready to Re-Login.');
    };

    // Polling function to check token every 10 minutes and notify at 55 minutes
    useEffect(() => {
        const token = sessionStorage.getItem('authToken');
        if (token) {
            const intervalId = setInterval(verifyToken, 600000); // 10 minutes in milliseconds

            // Set a timeout to notify user at 55 minutes
            const notifyTimeoutId = setTimeout(notifySessionExpiration, 3300000); // 55 minutes in milliseconds

            return () => {
                clearInterval(intervalId); // Clear interval on component unmount
                clearTimeout(notifyTimeoutId); // Clear timeout on component unmount
            };
        }
    }, []); // Empty dependency array to run once

    return <ToastContainer position="top-right" autoClose={3000} />; // Customize toast container
};

export default useTokenVerification;



// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const useTokenVerification = () => {
//     const [isTokenValid, setIsTokenValid] = useState(null); // Track token validity status

//     const handleLogout = () => {
//         sessionStorage.removeItem('authToken');
//         window.location.href = '/'; // Redirect to login page
//     };

//     const verifyToken = async () => {
//         const token = sessionStorage.getItem('authToken'); 

//         if (!token) {
//             handleLogout(); // No token, log the user out
//             return;
//         }

//         try {
//             const headers = { Authorization: token };
//             const response = await axios.get('https://fm.skyhub.pk/api/v1/users/verify-token', { headers });

//             if (response.data.message === 'Token is valid.') {
//                 if (isTokenValid !== true) { // Only show toast if status has changed
//                     toast.success('Token is valid.');
//                 }
//                 setIsTokenValid(true);
//             } else {
//                 toast.error('Token verification failed.');
//                 handleLogout();
//             }
//         } catch (error) {
//             if (error.response && error.response.status === 401) {
//                 toast.error('Unauthorized: Invalid token.');
//             } else {
//                 toast.error(`Token verification error: ${error.message}`);
//             }
//             handleLogout();
//         }
//     };

//     useEffect(() => {
//         const checkToken = async () => {
//             await verifyToken(); // Verify token on load
//             setTimeout(checkToken, 60000); // 5 minutes in milliseconds
//         };
        
//         checkToken(); // Start the initial token check
//         return () => clearTimeout(checkToken); // Clear timeout on unmount
//     }, []); 

//     return <ToastContainer position="top-right" autoClose={3000} />;
// };

// export default useTokenVerification;
