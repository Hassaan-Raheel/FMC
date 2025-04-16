// Slider Image Upload Function
import axios from 'axios';

export const uploadImage = async (formData, apiEndpoint, setUploadedStates) => {

    for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }

    try {
        const response = await axios.post(apiEndpoint, formData);

        const result = response.data;
        setUploadedStates('Upload Successful');
        console.log("upload result", result);
        alert('Upload Successful');

    } catch (error) {
        console.log("error", error);
        setUploadedStates(`Upload Failed: ${error.message}`);
    }
}
