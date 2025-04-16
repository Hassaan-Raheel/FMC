import axios from "axios";
import { useContext } from "react";
import { createContext, useState } from "react";
import { Url } from "../../Services/Api";

const ActiveFinanceContext = createContext()

export const ActiveFinanceProvider = ({children}) => {

    const [viewPort, setViewPort] = useState('desktop-view')
    const [loading, setLoading] = useState(false)
    const [activeFinancePayload, setActiveFinancePayload] = useState({
        "main_banner": {
          "mobile_view": {
            "image_url": "",
            "alt_text": "",
            "title": "",
            "link_url": "",
            "description": ""
          },
          "desktop_view": {
            "image_url": "",
            "alt_text": "",
            "title": "",
            "link_url": "",
            "description": ""
          }
        },
        "slides": [
          {
            "mobile_view": {
              "image_url": "",
              "alt_text": "",
              "title": "",
              "link_url": "",
              "description": ""
            },
            "desktop_view": {
              "image_url": "",
              "alt_text": "",
              "title": "",
              "link_url": "",
              "description": ""
            }
          }
        ]
    });

    const getDataOfActiveFinance = async () => {
        const api = `/api/v1/pages/financing/get`
        setLoading(true)
        try {
            const response = await axios.get(`${Url+api}`)
            setActiveFinancePayload(response.data.financingPage)
        } catch (error) {
            console.error("error geting active sale data", error);
        }finally{

            setLoading(false)
        }
    }

    const updateActiveFinance = async () => {
        const api = `/api/v1/pages/financing/add`
        setLoading(true)
        try {
            const resposnse = await axios.post(`${Url+api}`, activeFinancePayload);
        } catch (error) {
            console.error("Error updating data", error);
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
                loading
            }}>
            {children}
        </ActiveFinanceContext.Provider>
    )

}

export const useActiveFinance = () => {
    return useContext(ActiveFinanceContext);
}