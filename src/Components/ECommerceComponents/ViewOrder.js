import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ECommerceComponents.css";
import MainLoader from "../../Components/UI-Controls/MainLoader/MainLoader";
import CustomBtn from "../../Components/UI-Controls/Buttons/Btn";
import { Url } from "../../Services/Api";
import { ppValue, paValue } from '../../Services/Env';
import BottomToust from "../../Components/BottomToust/BottomToust";
import InputIconField from "../UI-Controls/InputField/InputIconField";
import { format } from "date-fns";
import { CiWarning } from "react-icons/ci";

const ViewOrders = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const OrdeR = location.state || {};
  const [loading, setLoading] = useState(false);
  const [loadingNote, setLoadingNote] = useState(false);
  const [orderNote, setOrderNote] = useState("");
  const [orderNotes, setOrderNotes] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentRowId, setCurrentRowId] = useState(null);
  const [margins, setMargins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [cartProtected, setCartProtected] = useState(OrdeR.cart_protected);
  const [professionalAssembled, setProfessionalAssembled] = useState(OrdeR.professional_assembled);
  const tooltipRefs = useRef([]);
  const modalRef = useRef(null);
  const [orderDate, setOrderDate] = useState(
    OrdeR.createdAt ? formatDate(OrdeR.createdAt) : ""
  );
  const { items = [] } = OrdeR;

  useEffect(() => {
    if (tooltipRefs.current.length > 0) {
      const calculatedMargins = tooltipRefs.current.map((tooltip, index) => {
        if (tooltip) {
          const lineHeight = 18;
          const padding = 10;
          const textHeight = tooltip.scrollHeight;
          const lines = Math.ceil((textHeight - padding) / lineHeight);
          return index === 0 ? 75 : 35 + lines * 7;
        }
        return 35;
      });

      setMargins(calculatedMargins);
    }
  }, [orderNotes]);

  const handleCloseMessageModal = () => {
    setShowMessage(false);
  };

  useEffect(() => {
    if (showMessage) {
      const timeOut = setTimeout(() => {
        setShowMessage(false);
      }, 3000);

      return () => clearTimeout(timeOut);
    }
  }, [showMessage]);

  useEffect(() => {
    if (OrdeR.order_notes) {
      setOrderNotes(OrdeR.order_notes);
    }
  }, [OrdeR.order_notes]);

  useEffect(() => {
    const handleDeleteClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        cancelDelete();
      }
    };

    document.addEventListener("mousedown", handleDeleteClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleDeleteClickOutside);
    };
  }, []);

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

  const formatNoteDate = (isoString) => {
    return format(new Date(isoString), "MMMM dd, yyyy 'at' hh:mm a");
  };

  const handleEditOrder = () => {
    if (OrdeR) {
      navigate("/E-Commerce/All-Orders/Edit-Orders", { state: OrdeR });
    }
  };

  const handleNoteChange = (e) => {
    setOrderNote(e.target.value);
  };

  const formatPaymentMethod = (method) => {
    if (!method) return "";
    return method
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleSubmitNote = async () => {
    if (!orderNote.trim()) return;

    let successMessage = "Order note submitted successfully!";
    let warningMessage = "Failed to submit order note.";

    setLoadingNote(true);

    try {
      const response = await axios.post(
        `${Url}/api/v1/orders/add-note/${OrdeR._id}`,
        { note: orderNote }
      );

      if (response.status === 200) {
        setOrderNotes([...orderNotes, orderNote]);
        setOrderNote("");
        setToastMessage(successMessage);
        setShowMessage(true);
        setTimeout(() => {
          navigate("/E-Commerce/All-Orders");
        }, 2500);
      }
    } catch (error) {
      console.error("Error adding order note:", error);
      setToastMessage(warningMessage);
      setShowMessage(true);
    } finally {
      setLoadingNote(false);
    }
  };

  const confirmDelete = (noteId) => {
    setCurrentRowId(noteId);
    setShowConfirm(true);
  };

  const handleDelete = () => {
    if (currentRowId) {
      handleDeleteNote(currentRowId);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!noteId) return;

    setIsLoading(true);
    setIsActive(true);

    try {
      const response = await axios.delete(
        `${Url}/api/v1/orders/delete-note/${OrdeR._id}/${noteId}`
      );

      if (response.status === 200) {
        setOrderNotes(orderNotes.filter((note) => note._id !== noteId));
        setToastMessage("Order note deleted successfully!");
        setShowMessage(true);
      }
    } catch (error) {
      console.error("Error deleting order note:", error);
      setToastMessage("Failed to delete order note.");
      setShowMessage(true);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setIsActive(false);
      }, 5000);
      setShowConfirm(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  /* --- Function to handle Order Summary total change --- */
  const calculateTotal = () => {
    return (
      OrdeR.sub_total +
      OrdeR.shipping_cost +
      (cartProtected ? ppValue : 0) +
      (professionalAssembled ? paValue : 0) +
      OrdeR.tax -
      OrdeR.discount
    ).toFixed(2);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="EditOrderMainPage">
      {loadingNote && (
        <div className="backdrop">
          <MainLoader />
        </div>
      )}

      <div className="OrderSection-01">
        <div className="Row-1st">
          <CustomBtn
            label="Edit Order"
            withIcon={false}
            iconType="plus"
            className="Edit-ViewBtn"
            type="submit"
            onClick={handleEditOrder}
          />
        </div>

        <div className="RowAlign">
          {/* Order Edit Page - LeftSide */}
          <div className="LeftSection">
            
            {/* Order Detail Section */}
            <div className="Order-Leftside">

              <div className="OrderMainContainer">
                <span className="Order-Header">Order Details</span>
              </div>

              <div className="OrderBodyContainer">
                <div className="Details-Row-01">
                  <span>Order Number: {OrdeR.uid}</span>
                  <span>
                    Customer IP: 2607: fb91: bd97: 6ab: 218b: ee9b: 71a7: 2a9c
                  </span>
                </div>
                <div className="Details-Row-02">
                  <div className="RowData-Start-View">
                    <p className="Details-Headings">General Info</p>
                    <span className="Order-Rendering-Span-Labels" >
                      Date & Time:
                    </span>
                    <input
                      type="text"
                      value={orderDate}
                      readOnly
                      className="Order-Rendering-Fields"
                    />
                    <label className="Order-Rendering-Labels">
                      Status:
                    </label>
                    <input
                      type="text"
                      value={OrdeR.status}
                      readOnly
                      className="Order-Rendering-Fields"
                    />
                    <label className="Order-Rendering-Labels" >
                      Customer:
                    </label>
                    <input
                      type="text"
                      value={"Guest"}
                      readOnly
                      className="Order-Rendering-Fields"
                    />
                    <label className="Order-Rendering-Labels" >
                      User Note:
                    </label>
                    <input
                      type="text"
                      value={OrdeR.customer_note}
                      readOnly
                      className="Order-Rendering-Fields"
                    />
                    <label
                      style={{
                        fontFamily: "var(--font-family)",
                        fontSize: "var(--font-size-medium)",
                        fontWeight: "var(--font-weight-semi-bold)",
                        color: "var(--black-color)",
                        lineHeight: "18px",
                        marginTop: "25px",
                        marginBottom: "7px",
                      }}
                    >
                      Payment Method
                    </label>
                    <input
                      type="text"
                      value={formatPaymentMethod(OrdeR.payment_method)}
                      readOnly
                      className="Order-Rendering-Fields"
                    />
                  </div>

                  <div className="RowData-Mid-View">
                    <div className="Main-Details-Heading">
                      <p className="Details-Headings-Rest">Billing Address</p>
                    </div>
                    <span>{`${OrdeR.billing?.first_name} ${OrdeR.billing?.last_name}`}</span>
                    <span>{OrdeR.billing?.address_1}</span>
                    <span>{`${OrdeR.billing?.city}, ${OrdeR.billing?.state}`}</span>
                    <span>{OrdeR.billing?.country}</span>
                    <span
                      style={{
                        marginTop: "10px",
                        fontSize: "13px",
                        fontWeight: 500,
                      }}
                    >
                      Email
                    </span>
                    <span
                      style={{
                        textDecoration: "underline",
                        color: "blue",
                        cursor: "pointer",
                        marginTop: "5px",
                      }}
                    >
                      {OrdeR.billing?.email}
                    </span>
                    <span
                      style={{
                        marginTop: "10px",
                        fontSize: "13px",
                        fontWeight: 500,
                      }}
                    >
                      Phone No.
                    </span>
                    <span
                      style={{
                        textDecoration: "underline",
                        color: "blue",
                        cursor: "pointer",
                        marginTop: "5px",
                      }}
                    >
                      {OrdeR.billing?.phone}
                    </span>
                  </div>

                </div>
              </div>
            </div>

            {/* Cart Details Section */}
            <div className="Order-Leftside">
              <div className="OrderMainContainer">
                <span className="Order-Header">Cart Details</span>
                <div className="Order-Header-Right">
                  <span className="Right-Content">Cost</span>
                  <span className="Right-Content">Qty</span>
                  <span className="Right-Content">Total</span>
                </div>
              </div>
              <div className="OrderBodyContainer">
                {items.map((item, index) => {
                  const cost =
                    item.is_protected === 1
                      ? (item.total - 99) / item.quantity
                      : item.total / item.quantity;

                  return (
                    <div key={item._id || index}>
                      {/* Individual Cart Row */}
                      <div className="CartSection-Row">
                        <div className="ImgSection">
                          <img
                            src={`${Url + item.image}`}
                            alt={item.name}
                            className="ImageStyle-Order"
                          />
                        </div>

                        <div className="CartDescription-View">
                          <span className="Main-Headings">{item.name}</span>
                          <span className="Headings-1st">SKU: {item.sku}</span>

                          {/* Render Attributes */}
                          {item.attributes && (
                            <div className="AttributesSection-Edit">
                              {item.attributes.map((attribute, attrIndex) => (
                                <div key={attrIndex} className="AttributeItem">
                                  <p className="ItemStyling">
                                    {attribute.options[0]?.name || "N/A"}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Render Protection Plan only if is_protected === 1 */}
                          {item.is_protected === 1 && (
                            <label className="ItemStyling-1st">
                              <input
                                type="checkbox"
                                checked={true} // Since is_protected is 1, it's always checked
                                style={{
                                  marginRight: "5px",
                                  marginTop: "3px",
                                  accentColor: "green",
                                }}
                                disabled
                              />
                              Protected (+$199)
                            </label>
                          )}

                        </div>

                        <div className="AmountHandling-View">
                          <span className="Cost-View">${cost.toFixed(2)}</span>{" "}
                          {/* Calculated Cost */}
                          <span className="Qty-View">{item.quantity}</span>{" "}
                          {/* Dynamic Quantity */}
                          <span className="Total-View">${item.total}</span>{" "}
                        </div>
                      </div>

                      {/* Separator */}
                      {index < items.length - 1 && (
                        <div className="RowSeparator"></div>
                      )}
                    </div>
                  );
                })}

                {/* Order Summary Section */}
                <div className="CartSection-Row-Summary">
                  <div className="Order-Total">
                    <div className="MainContainer">
                      <span className="Order-Header">Order Summary</span>
                    </div>

                    <div className="BodyContainer">
                      <div className="items-Description">
                        <span>Sub Total:</span>
                        <span>${OrdeR.sub_total.toFixed(2)}</span>
                      </div>

                      <div className="items-Description">
                        <span>Shipping:</span>
                        <span>${OrdeR.shipping_cost.toFixed(2)}</span>
                      </div>

                      {/* Protection Plan Display */}
                      <div className="items-Description">
                        <span>Protection Plan:</span>
                        <span>{cartProtected ? `$${ppValue}` : "$0"}</span>
                      </div>

                      {/* Professional Assembly Display */}
                      <div className="items-Description">
                        <span>Professional Assembly:</span>
                        <span>{professionalAssembled ? `$${paValue}` : "$0"}</span>
                      </div>

                      <div className="items-Description">
                        <span>Discount:</span>
                        <span>${OrdeR.discount.toFixed(2)}</span>
                      </div>

                      <div className="items-Description">
                        <span>Tax:</span>
                        <span>${OrdeR.tax.toFixed(2)}</span>
                      </div>

                      <div className="RowSeparator-Total"></div>

                      <div className="items-TotalDescription">
                        <span className="TotalDescription">Grand Total:</span>
                        <span className="TotalDescription">${calculateTotal()}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Order Edit Page - RightSide */}
          <div className="RightSection">
            {/* 1st Row */}
            <div className="Order-Rightside">
              <div className="OrderMainContainer">
                <span className="Order-Header">Customer History</span>
              </div>

              <div className="OrderBodyContainer">
                <div className="Customer-History">
                  <span className="History-Heading">Total Orders</span>
                  <span className="History-Value">0</span>
                  <span className="History-Heading">Total Revenue</span>
                  <span className="History-Value">$0</span>
                  <span className="History-Heading">Average Order Value</span>
                  <span className="History-Value">$0</span>
                </div>
              </div>
            </div>

            {/* 2nd Row */}
            <div className="Order-Rightside">
              <div className="OrderMainContainer">
                <span className="Order-Header">Order Attribution</span>
              </div>

              <div className="OrderBodyContainer">
                <div className="Customer-History">
                  <span className="History-Heading">Origin</span>
                  <span className="History-Value">Source: Google</span>
                  <span className="History-Heading">Device Type</span>
                  <span className="History-Value">Mobile</span>
                </div>
              </div>
            </div>

            <div className="Order-Rightside">
              <div className="OrderMainContainer">
                <span className="Order-Header">Order Status</span>
              </div>

              <div className="OrderBodyContainer">

                {orderNotes?.map((note, index) => (
                  <div className="Attribution-Row-02" key={index}>
                    <div
                      className="RowData-Start-Tooltip"
                      style={{ marginTop: `${margins[index] || 35}px` }}
                    >
                      <div className="TooltipContainer">
                        <span
                          className="TooltipText"
                          ref={(el) => (tooltipRefs.current[index] = el)}
                        >
                          {note?.note || "No Note Available"}
                        </span>
                        <span
                          style={{
                            color: "var(--text-color)",
                            fontWeight: "var(--font-weight-medium)",
                            marginLeft: "15px",
                            fontSize: "var(--font-size-small)",
                          }}
                        >
                          {note.updatedAt ? formatNoteDate(note.updatedAt) : "Date not available"}
                        </span>
                        <span
                          style={{
                            color: "#C61B1A",
                            textDecoration: "underline",
                            fontWeight: "var(--font-weight-medium)",
                            marginLeft: "55px",
                            cursor: "pointer",
                          }}
                          onClick={() => confirmDelete(note._id)}
                        >
                          Delete Note
                        </span>

                      </div>
                    </div>
                  </div>
                ))}

                {/* Input Field for Adding Notes */}
                <div className="Attribution-Row-02">
                  <div className="RowData-Start">
                    <InputIconField
                      placeholder="Enter Order Note Here"
                      value={orderNote}
                      name="order_note"
                      onChange={handleNoteChange}
                      readOnly={false}
                      onSubmit={handleSubmitNote}
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- (PopUp) To Handle Confiramtion for Delete Operation of Order Note --- */}
      {showConfirm && (
        <div className="Delete-Confirmation-Modal">
          <div className="ModalContent" ref={modalRef}>
            <CiWarning className="warningIcon" />
            <div className="deleteHeading">Warning</div>
            <div className="deleteContent">
              Are you sure you want to delete this Order Note? <br />
              This action cannot be undone.
            </div>
            <div className="separatorLine"></div>
            <div className="modalActions">
              <button
                className="NoteDelete-btn btnSecondary"
                onClick={cancelDelete}
              >
                Cancel
              </button>

              <div className="NoteSubmitBtn">
                <CustomBtn
                  label={
                    isLoading ? (
                      <div className="btnLoader-Note"></div>
                    ) : (
                      "Confirm"
                    )
                  } // Conditionally render text
                  className={`NoteDeletebtn btnDanger ${isActive ? "active" : ""
                    }`}
                  disabled={isLoading}
                  onClick={handleDelete}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomToust
        showMessage={showMessage}
        message={toastMessage}
        handleCloseMessageModal={() => handleCloseMessageModal()}
      />

    </div>
  );
};

export default ViewOrders;