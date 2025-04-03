import axios from "axios";
import { useContext, useEffect } from "react";
import { createContext, useState } from "react";
import { Url } from "../../Services/Api";

const ActiveFinanceContext = createContext()

export const ActiveFinanceProvider = ({children}) => {

    const [viewPort, setViewPort] = useState('desktop')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("");
    const [activeFinancePayload, setActiveFinancePayload] = useState({
        "main_banner": {
          "mobile": {
            "image_url": "",
            "alt_text": "",
            "title": "",
            "link_url": "",
            "description": ""
          },
          "desktop": {
            "image_url": "",
            "alt_text": "",
            "title": "",
            "link_url": "",
            "description": ""
          }
        },
        "slides": {
          "mobile": [],
          "desktop": []
        }
    });

    const getDataOfActiveFinance = async () => {
        const api = `/api/v1/pages/financing/get`
        setLoading(true)
        try {
            const response = await axios.get(`${Url+api}`)
            console.log("active page data get", response.data.financingPage);
            setActiveFinancePayload(response.data.financingPage)
        } catch (error) {
            console.error("error geting active sale data", error);
        }finally{

            setLoading(false)
        }
    }

    const updateActiveFinance = async () => {
        const api = `/api/v1/pages/financing/add`
      //  console.log("before submit payload", activeFinancePayload)
        setLoading(true)
        try {
            const resposnse = await axios.post(`${Url+api}`, activeFinancePayload);
          if(resposnse.status === 200) {
            setMessage("Financing Banners Add Successfully");
          }
        } catch (error) {
            console.error("Error updating data", error);
            setMessage("Error updating data");
            setLoading(false)
        }finally{
            setLoading(false)
        }
    }
    
    return (
        <ActiveFinanceContext.Provider 
            value={{
                activeFinancePayload, 
                setActiveFinancePayload, 
                getDataOfActiveFinance,
                viewPort,
                setViewPort,
                updateActiveFinance,
                loading, 
                message
            }}>
            {children}
        </ActiveFinanceContext.Provider>
    )

}

export const useActiveFinance = () => {
    return useContext(ActiveFinanceContext);
}

    // const [activeFinancePayload, setActiveFinancePayload] = useState(
    //     {
    //         "mainSlider": {
    //             "mobile": [
    //                 {
    //                     "image_url": "",
    //                     "alt_text": "",
    //                     "title": "",
    //                     "link_url": "",
    //                     "description": ""
    //                 }
    //             ],
    //             "desktop": [
    //                 {

    //                     "image_url": "",
    //                     "alt_text": "",
    //                     "title": "",
    //                     "link_url": "",
    //                     "description": ""
    //                 }

    //             ]
    //         },
    //         "subCategory": 0,
    //         "banner1": {
    //             "mobile": [
    //                 {
    //                     "image_url": "",
    //                     "alt_text": "",
    //                     "title": "",
    //                     "link_url": "",
    //                     "description": ""
    //                 }
    //             ],
    //             "desktop": [
    //                 {
    //                     "image_url": "",
    //                     "alt_text": "",
    //                     "title": "",
    //                     "link_url": "",
    //                     "description": ""
    //                 }
    //             ]
    //         },
    //         "content1": "",
    //         "banner2": [
    //             {
    //                 "image_url": "",
    //                 "alt_text": "",
    //                 "title": "",
    //                 "link_url": "",
    //                 "description": ""
    //             }
    //         ],
    //         "banner3": {
    //             "mobile": [
    //                 {
    //                     "image_url": "",
    //                     "alt_text": "",
    //                     "title": "",
    //                     "link_url": "",
    //                     "description": ""
    //                 }
    //             ],
    //             "desktop": [
    //                 {
    //                     "image_url": "",
    //                     "alt_text": "",
    //                     "title": "",
    //                     "link_url": "",
    //                     "description": ""
    //                 }
    //             ]
    //         },
    //         "content2": ""
    //     }
    // )

    // const getDataOfActiveFinance = async () => {
    //     const api = `api/v1/pages/financing/get`
    //     setLoading(true)
    //     try {
    //         const response = await axios.get(`${url}${api}`)
    //         console.log("active page data get", response.data.data);
    //         setActiveFinancePayload(response.data.data)
    //     } catch (error) {
    //         console.error("error geting active sale data", error);
    //     }finally{

    //         setLoading(false)
    //     }
    // }

    // const updateActiveFinance = async () => {
    //     const api = `/api/v1/pages/financing/add`
    //     console.log("before submit payload", activeFinancePayload)
    //     setLoading(true)
    //     try {
    //         const resposnse = await axios.put(`${url}${api}`, activeFinancePayload);
    //         console.log("after submit payload", resposnse);
    //     } catch (error) {
    //         console.error("Error updating data", error);
    //     }finally{

    //         setLoading(false)
    //     }
    // }