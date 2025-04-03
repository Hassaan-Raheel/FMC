// import React from "react";
// import "./AnalyticsOverviewCard.css";
// import { Url } from "../../../Services/Api";
// import defaultImage from "../../../Assets/Images/defaultBannerImage 128 x 128.png";
// import ShimmerLoader from "../../UI-Controls/Loader/ShimmerLoader";

// const TopProducts = ({ title, sku, quantity, images = [], loading }) => {
//   return (
//     <div className="RatedProductCard">
//       {/* First Row: Image */}
//       <div className="ProductCardColumn-01">
//         <div className="CardImageContainer">
//           {loading ? (
//             <ShimmerLoader width="75px" height="50px" borderRadius="4px" />
//           ) : (
//             <img
//               src={images?.length > 0 ? `${Url}${images[0]}` : defaultImage}
//               alt="Product"
//               className="ProductImage"
//               style={{
//                 width: "75px",
//                 height: "50px",
//                 objectFit: "contain",
//                 borderRadius: "5px",
//                 backgroundColor: "#f5f5f5",
//               }}
//             />
//           )}
//         </div>
//       </div>

//       {/* Second Row: Product Details */}
//       <div className="ProductCardColumn-02">
//         <div className="ProductCardText">
//           <div className="ProductCardTitle">
//             {loading ? (
//               <ShimmerLoader
//                 width="200px"
//                 height="22.5px"
//                 borderRadius="20px"
//               />
//             ) : (
//               <>{ title }</>
//             )}
//           </div>
//           <div className="ProductCardSKU">
//             {loading ? (
//               <ShimmerLoader
//                 width="150px"
//                 height="22.5px"
//                 borderRadius="20px"
//               />
//             ) : (
//               <><span className="PC-ValueColor">SKU:</span> {sku}</>
//             )}
//           </div>
//           {loading ? (
//             <ShimmerLoader width="150px" height="22.5px" borderRadius="20px" />
//           ) : (
//             <div className="ProductCardQuantity">
//               <span className="PC-ValueColor">Quantity:</span> {quantity}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TopProducts;

import React from "react";
import { Tooltip } from "antd";
import "./AnalyticsOverviewCard.css";
import { Url } from "../../../Services/Api";
import defaultImage from "../../../Assets/Images/defaultBannerImage 128 x 128.png";
import ShimmerLoader from "../../UI-Controls/Loader/ShimmerLoader";

const truncateTitle = (title) => {
  const words = title.split(" ");
  return words.length > 3 ? `${words.slice(0, 3).join(" ")}...` : title;
};

const TopProducts = ({ title, sku, quantity, images = [], loading }) => {
  return (
    <div className="RatedProductCard">
      {/* First Row: Image */}
      <div className="ProductCardColumn-01">
        <div className="CardImageContainer">
          {loading ? (
            <ShimmerLoader width="75px" height="50px" borderRadius="4px" />
          ) : (
            <img
              src={images?.length > 0 ? `${Url}${images[0]}` : defaultImage}
              alt="Product"
              className="ProductImage"
              style={{
                width: "75px",
                height: "50px",
                objectFit: "contain",
                borderRadius: "5px",
                backgroundColor: "#f5f5f5",
              }}
            />
          )}
        </div>
      </div>

      {/* Second Row: Product Details */}
      <div className="ProductCardColumn-02">
        <div className="ProductCardText">
          <div className="ProductCardTitle">
            {loading ? (
              <ShimmerLoader width="150px" height="18.5px" borderRadius="10px" />
            ) : (
              <Tooltip title={title} placement="top">
                <span className="ProductCardTitleText">{truncateTitle(title)}</span>
              </Tooltip>
            )}
          </div>
          <div className="ProductCardSKU">
            {loading ? (
              <ShimmerLoader width="100px" height="18.5px" borderRadius="10px" />
            ) : (
              <><span className="PC-ValueColor">SKU:</span> {sku}</>
            )}
          </div>
          {loading ? (
            <ShimmerLoader width="100px" height="18.5px" borderRadius="10px" />
          ) : (
            <div className="ProductCardQuantity">
              <span className="PC-ValueColor">Quantity:</span> {quantity}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopProducts;