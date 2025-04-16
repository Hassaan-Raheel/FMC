import React from 'react'
import '../Page.css'
// import HeaderCategories from '../../Components/CategoriesPageComponents/HeaderCategories/HeaderCategories'
// import ShopByCategory from '../../Components/HomePageSections/ShopByCategory/ShopByCategory'
// import BestSellerSection from '../../Components/HomePageSections/BestSellerSection/BestSellerSection'
// import CategoryDescription from '../../Components/CategoriesPageComponents/CategoryDescription/CategoryDescription'
import EditCategory from '../../Components/CategoriesPageComponents/EditCategory/EditCategory'

const Categories = () => {
  return (
    <div className="HomePage" style={{ gap: '20px' }}>
      {/* <HeaderCategories />
      <ShopByCategory />
      <BestSellerSection />
      <CategoryDescription /> */}
      <EditCategory />
    </div>
  )
}

export default Categories
