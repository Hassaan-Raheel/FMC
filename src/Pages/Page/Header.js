import React, { useEffect, useState } from 'react'
import HeaderCategories from '../../Components/CategoriesPageComponents/HeaderCategories/HeaderCategories'
import { Url } from "../../Services/Api";
import axios from 'axios'
const Header = () => {
    const [parentCategories, setParentCategories] = useState();
    useEffect(() => {
        const fetchHeadCategories = async () => {
            const api = `/api/v1/productCategory/get?parent=0`
            try {
                const response = await axios.get(`${Url+api}`);
                setParentCategories(response.data.categories)
                // console.log("response head", response.data.categories);
            } catch (error) {
                console.error("error getting head categories", error);
            }
        }
        fetchHeadCategories()
    }, [])
  return (
    <div className="HomePage">
      <HeaderCategories 
        title={"Header"}
        parentCategories={parentCategories}
      />

      {/* <br />
      
      <HeaderCategories 
        title={"Footer"}
        parentCategories={parentCategories}
      /> */}
    </div>
  )
}

export default Header
