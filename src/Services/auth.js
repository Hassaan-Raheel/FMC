import axios from 'axios';

export const getToken = () => {
    return localStorage.getItem('token'); // Adjust the key based on how you store the token
};

export const verifyToken = async (token) => {
    try {
        const response = await axios.post('/api/verify-token', { token });
        return response.data.isValid; // Adjust based on your API response structure
    } catch (error) {
        console.error("Token verification failed:", error);
        return false; // Return false if verification fails
    }
};
