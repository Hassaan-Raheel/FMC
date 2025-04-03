import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./ECommerceComponents.css";
import MainLoader from "../../Components/UI-Controls/MainLoader/MainLoader";
import CustomBtn from "../../Components/UI-Controls/Buttons/Btn";
import PrdImage from "../../Assets/Images/Image 01.jpg";
import RatingReview from "../UI-Controls/StarRating/Rating";
import Dropdowncustom from "../../Components/UI-Controls/Dropdown/dropdownaddgeneral1";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css"; // Import styles
import { Url } from '../../Services/Api';
import BottomToust from "../../Components/BottomToust/BottomToust";

const EditReviews = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const customerReview = location.state || {};
  const [prdDetails, setPrdDetails] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(
    customerReview.status || "pending"
  );
  const [loading, setLoading] = useState(false);
  const [reviewDate, setReviewDate] = useState(
    customerReview.date_created ? formatDate(customerReview.date_created) : ""
  );
  const [showMessage, setShowMessage] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true); // Set loading to true before the API call
      try {
        const response = await axios.get(
          `${Url}/api/v1/products/get/${customerReview.product_id}`
        );

        const productData = response.data.products[0]; // Access the first product
        if (productData && productData.image) {
          const imageUrl = productData.image.image_url; // Extract image_url
          setPrdDetails({
            name: productData.name,
            sku: productData.sku,
            permalink: productData.permalink,
            imageUrl, // Set image_url in state
          });
         // console.log("Image URL:", imageUrl);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    if (customerReview.product_id) {
      fetchProductDetails();
      setIsEdit(true);
    }
  }, [customerReview.product_id]);

  const handleCloseMessageModal = () => {
    setShowMessage(false);
  };

  useEffect(() => {
    if (showMessage === true) {
      const timeOut = setTimeout(() => {
        setShowMessage(false);
      }, 3000);

      return () => clearTimeout(timeOut);
    }
  }, [showMessage]);

  // Utility to format the date (ISO to readable)
  function formatDate(isoDate) {
    const date = new Date(isoDate);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Function to handle edit Customer Review
  const handleUpdate = async () => {
    if (customerReview) {
      try {
        setLoading(true); // Show loader during update
        const updatedPayload = {
          ...customerReview, // Spread the existing payload
          product_id: customerReview.product_id,
          status: selectedStatus, // Update only the status
          id: customerReview.id,
        };

        // Make an API call to update the review
        const response = await axios.put(
          `${Url}/api/v1/reviews/edit-review`, // Replace with the correct endpoint
          updatedPayload
        );

        if (response.status >= 200 && response.status <= 300) {
          let updateMessage = "Review updated successfully!";
         // console.log("Review updated successfully:", response.data);
          // toast.success("Data has been updated successfully!");
          setToastMessage(updateMessage);
          setShowMessage(true);
          setTimeout(() => {
            navigate("/E-Commerce/Product-Reviews");
          }, 4000);
          // navigate("/E-Commerce/Product-Reviews"); // Redirect to the review list page
        } else {
          let errorMessage = "Something went wrong. Kindly check it carefully.";
          console.error("Failed to update the review:", response.data);
          // toast.error("Something went wrong. Kindly check it carefully.");
          setToastMessage(errorMessage);
          setShowMessage(true);
        }
      } catch (error) {
        console.error("Error updating review:", error);
      } finally {
        setLoading(false); // Hide loader after update
      }
    }
  };

  const getStatusStyle = (status) => {
    let textColor;
    let backgroundColor;

    switch (status.toLowerCase()) {
      case "approved":
        textColor = "#5285B4";
        backgroundColor = "#5285B410"; // Background color with opacity
        break;
      case "rejected":
        textColor = "#F08F9F";
        backgroundColor = "#F08F9F10";
        break;
      case "pending":
        textColor = "#F4B074";
        backgroundColor = "#F4B07410";
        break;
      default:
        textColor = "#43CC5C";
        backgroundColor = "#43CC5C10";
    }

    return { textColor, backgroundColor };
  };

  const ReviewStatusOptions = [
    { value: "pending", label: "Pending" },
    { value: "rejected", label: "Rejected" },
    { value: "approved", label: "Approved" },
  ];

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
   // console.log("Selected Status:", value);
  };

  const handleCancelEdit = () => {
    setPrdDetails([]);
    setSelectedStatus("pending");
    setIsEdit(false);
    navigate("/E-Commerce/Product-Reviews");
  };

  return (
    <>
    <div className="ViewReviewMainPage">
      {loading && (
        <div className="backdrop">
          <MainLoader />
        </div>
      )}
      <div className="EditCommentSection">
        <div className="Row-1st">
          {isEdit && (
            <CustomBtn
              label="Cancel Edit"
              className="CancelEditBtn-Review"
              onClick={handleCancelEdit}
              type="button"
            />
          )}
          <CustomBtn
            label="Update Review"
            withIcon={false}
            iconType="plus"
            className="Update-CommentBtn"
            type="submit"
            onClick={handleUpdate}
          />
        </div>

        <div className="RowAlign-ViewReview">
          {/* Review View Page - LeftSide */}
          <div className="LeftSection-ViewReview">
            {/* Review View Section */}
            <div className="Review-Leftside">
              <div className="ReviewMainContainer">
                <span className="Review-Header">Details</span>
              </div>
              <div className="ReviewBodyContainer">
                <div className="ReviewDetails-Row-01">
                  <div className="Image-Section">
                    {/* Render Product Image */}
                    <img
                      src={
                        `${Url+prdDetails?.imageUrl}` ||
                        "default-image-url.jpg"
                      } // Fallback to a default image if not available
                      alt={prdDetails?.name || "Product Image"}
                      className="Product-Image"
                      style={{
                        width: "150px",
                        height: "90px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div className="Product-Detail">
                    {/* Render Product Details */}
                    <div className="Detail-Row">
                      <span className="Detail-Label">Product Name</span>
                      <span className="Detail-Value">{prdDetails.name}</span>
                    </div>
                    <div className="Detail-Row">
                      <span className="Detail-Label">SKU</span>
                      <span className="Detail-Value">{prdDetails.sku}</span>
                    </div>
                    <div className="Detail-Row">
                      <span className="Detail-Label">Permalink</span>
                      <a
                        href={prdDetails.permalink || "#"} // Use prdDetails.permalink dynamically or fallback to "#" if undefined
                        target="_blank"
                        rel="noopener noreferrer"
                        className="Detail-Value Link"
                      >
                        {prdDetails.permalink
                          ? prdDetails.permalink
                          : "No Permalink Available"}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="ReviewDetails-Row-02">
                  <div className="RowData-Start-ViewReviews">
                    <p className="Reviews-Headings">User Information</p>
                    <div className="UserInfo">
                      <div className="LeftPortion-UserInfo">
                        <div className="Overall-Content">
                          <div className="Rendering-Labels">Review Date</div>
                          <input
                            type="text"
                            value={reviewDate}
                            readOnly
                            className="Rendering-Fields"
                          />
                        </div>
                        <div className="Overall-Content">
                          <div className="Rendering-Labels">Reviewer Name</div>
                          <input
                            type="text"
                            value={customerReview.reviewer}
                            readOnly
                            className="Rendering-Fields"
                          />
                        </div>
                        <div className="Overall-Content">
                          <div className="Rendering-Labels">Reviewer Email</div>
                          <input
                            type="text"
                            value={customerReview.reviewer_email}
                            readOnly
                            className="Rendering-Fields"
                          />
                        </div>
                        <div className="Overall-Content">
                          <div className="Rendering-Labels">
                            Reviewer Status
                          </div>
                          <Dropdowncustom
                            options={ReviewStatusOptions}
                            selected={selectedStatus}
                            onChange={handleStatusChange} // Handle status change
                            dropdownClass="custom-dropdown-tax"
                            dropdownstyle={{ width: "175px" }}
                            headerborder="1px solid rgb(249, 249, 249)"
                            headerheight="35px"
                            headerBgColor="#FDFDFD"
                            size={17}
                            className="Rendering-Fields"
                          />
                        </div>
                      </div>
                      <div className="RightPortion-UserInfo">
                        <div className="Overall-Content">
                          <div className="Rendering-Labels-Right">Rating</div>
                          <RatingReview
                            rating={customerReview.rating}
                            disabled={true}
                            size={20}
                          />
                        </div>
                        <div className="Overall-Content">
                          <div className="Rendering-Labels-Right">
                            Verified:
                          </div>
                          <input
                            type="text"
                            value={
                              customerReview.verified === false
                                ? "Non-Verified"
                                : "Verified"
                            }
                            readOnly
                            className="Rendering-Fields"
                            style={{ fontWeight: 700 }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="Rendering-Labels-Style">Comments</div>
                    <textarea
                      value={customerReview.review}
                      readOnly
                      className="Comment_Details"
                    ></textarea>
                  </div>

                  <div className="RowData-Mid-ViewReviews">
                    <div className="Main-Details-Heading">
                      <p className="Details-Headings-ViewReview">
                        Customer Images
                      </p>
                    </div>
                    <div className="Image-Scroll-Container">
                      {customerReview.images &&
                      customerReview.images.length > 0 ? (
                        <div className="Image-Grid">
                          {customerReview.images.map((image, index) => (
                            <img
                              key={index}
                              src={`${Url+image}`}
                              alt={`Review Image ${index + 1}`}
                              className="Scrollable-Image"
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="Rendering-Labels-Image">
                          No Image Preview ...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*<ToastContainer position="top-right" autoClose={5000} />*/}{" "}
      <BottomToust
          showMessage={showMessage}
          message={toastMessage}
          handleCloseMessageModal={() => handleCloseMessageModal()}
        />
    </div>
    </>
  );
};

export default EditReviews;
