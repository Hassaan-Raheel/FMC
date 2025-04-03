import axios from "axios";
import { useContext } from "react";
import { createContext, useState } from "react";
import { Url } from "../../Services/Api";

const ActiveSaleContext = createContext()

export const ActiveSaleProvider = ({children}) => {

    const [viewPort, setViewPort] = useState('desktop-view')
    const [loading, setLoading] = useState(false)
    const [activeSalePayload, setActiveSalePayload] = useState(
        {
            "mainSlider": {
                "mobile_view": [
                    {
                        "image_url": "",
                        "alt_text": "",
                        "title": "",
                        "link_url": "",
                        "description": ""
                    }
                ],
                "desktop_view": [
                    {

                        "image_url": "",
                        "alt_text": "",
                        "title": "",
                        "link_url": "",
                        "description": ""
                    }

                ]
            },
            "subCategory": 0,
            "banner1": {
                "mobile_view": [
                    {
                        "image_url": "",
                        "alt_text": "",
                        "title": "",
                        "link_url": "",
                        "description": ""
                    }
                ],
                "desktop_view": [
                    {
                        "image_url": "",
                        "alt_text": "",
                        "title": "",
                        "link_url": "",
                        "description": ""
                    }
                ]
            },
            "content1": "",
            "banner2": [
                {
                    "image_url": "",
                    "alt_text": "",
                    "title": "",
                    "link_url": "",
                    "description": ""
                }
            ],
            "banner3": {
                "mobile_view": [
                    {
                        "image_url": "",
                        "alt_text": "",
                        "title": "",
                        "link_url": "",
                        "description": ""
                    }
                ],
                "desktop_view": [
                    {
                        "image_url": "",
                        "alt_text": "",
                        "title": "",
                        "link_url": "",
                        "description": ""
                    }
                ]
            },
            "content2": ""
        }
    )

    const getDataOfActiveSale = async () => {
        const api = `/api/v1/sales-page/get`
        setLoading(true)
        try {
            const response = await axios.get(`${Url+api}`)
            setActiveSalePayload(response.data.data)
        } catch (error) {
            console.error("error geting active sale data", error);
        }finally{
            setLoading(false)
        }
    }

    const updateActiveSale = async () => {
        const api = `/api/v1/sales-page/edit`
        setLoading(true)
        try {
            const resposnse = await axios.put(`${Url+api}`, activeSalePayload);
        } catch (error) {
            console.error("Error updating data", error);
        }finally{
            setLoading(false)
        }
    }

    return (
        <ActiveSaleContext.Provider 
            value={{
                activeSalePayload, 
                setActiveSalePayload, 
                getDataOfActiveSale,
                viewPort,
                setViewPort,
                updateActiveSale,
                loading
            }}>
            {children}
        </ActiveSaleContext.Provider>
    )

}

export const useActiveSale = () => {
    return useContext(ActiveSaleContext);
}