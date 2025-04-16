import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ECommerceComponents.css";
import axios from "axios";
import Dropdowncustom from "../../Components/UI-Controls/Dropdown/dropdownaddgeneral1";
import CustomBtn from "../../Components/UI-Controls/Buttons/Btn";
import InputField from "../../Components/UI-Controls/InputField/InputField";
import BottomToust from "../../Components/BottomToust/BottomToust";
import { Url } from '../../Services/Api';
import { ppValue, paValue } from '../../Services/Env';
import InputIconField from "../UI-Controls/InputField/InputIconField";
import Counter from "../UI-Controls/Counter/Counter";
import { format } from "date-fns";
import { CiWarning } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import SectionLoader from "../UI-Controls/MainLoader/SectionLoader";

const EditOrders = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const OrdeR = location.state || {};
  const [loading, setLoading] = useState(false);
  const [loadingNote, setLoadingNote] = useState(false);
  const [summaryloading, setSummaryLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(
    OrdeR.status || "pending"
  );
  const [orderDate, setOrderDate] = useState(
    OrdeR.createdAt ? formatDate(OrdeR.createdAt) : ""
  );
  const [orderNote, setOrderNote] = useState("");  // State to store order note
  const [orderNotes, setOrderNotes] = useState([]); // State for order notes array
  const [userNote, setUserNote] = useState(OrdeR.customer_note || "");
  const [billingDetails, setBillingDetails] = useState({
    first_name: OrdeR.billing.first_name,
    last_name: OrdeR.billing.last_name,
    address_1: OrdeR.billing.address_1,
    city: OrdeR.billing.city,
    state: OrdeR.billing.state,
    postal_code: OrdeR.billing.postal_code,
    country: OrdeR.billing.country,
    phone: OrdeR.billing.phone,
    email: OrdeR.billing.email,
    _id: OrdeR.billing._id,
  });
  const { items = [] } = OrdeR;
  const [showMessage, setShowMessage] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const tooltipRefs = useRef([]);
  const modalRef = useRef(null);
  const [margins, setMargins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentRowId, setCurrentRowId] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [itemsArray, setItemsArray] = useState(OrdeR.items);
  const [cartProtected, setCartProtected] = useState(OrdeR.cart_protected);
  const [professionalAssembled, setProfessionalAssembled] = useState(OrdeR.professional_assembled);
  const [isProtected, setIsProtected] = useState(() => {
    const initialState = {};
    OrdeR.items.forEach((item) => {
      initialState[item._id] = item.is_protected;
    });
    return initialState;
  });
  const [isEditingState, setIsEditingState] = useState({});

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

  const OrderStatusOptions = [
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "delivered", label: "Delivered" },
    { value: "canceled", label: "Canceled" },
  ];

  const formatNoteDate = (isoString) => {
    return format(new Date(isoString), "MMMM dd, yyyy 'at' hh:mm a");
  };

  const handleNoteChange = (e) => {
    setOrderNote(e.target.value);
  };

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBillingDetails({ ...billingDetails, [name]: value });
  };

  // Handle combined name change
  const handleNameChange = (e) => {
    const [first, ...rest] = e.target.value.split(" ");
    setBillingDetails({
      ...billingDetails,
      first_name: first || "",
      last_name: rest.join(" ") || "",
    });
  };

  // Handle combined city & state change
  const handleCityStateChange = (e) => {
    const [city, ...rest] = e.target.value.split(",");
    setBillingDetails({
      ...billingDetails,
      city: city.trim() || "",
      state: rest.join(",").trim() || "",
    });
  };

  // Handle combined country & postal code change
  const handleCountryPostalChange = (e) => {
    const [country, ...rest] = e.target.value.split(" ");
    setBillingDetails({
      ...billingDetails,
      country: country.trim() || "",
      postal_code: rest.join(" ").trim() || "",
    });
  };

  const handleUserNoteChange = (e) => {
    setUserNote(e.target.value);
  };

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

  const formatPaymentMethod = (method) => {
    if (!method) return "";
    return method
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // onChange handlers
  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    //  console.log("Selected Status:", value);
  };

  /* --- Function to handle submission of updates of Order Details Section --- */
  const updateOrderDetails = async () => {
    setLoading(true);

    let successMessage = "Order details submitted successfully!";
    let warningMessage = "Failed to update order details.";

    try {
      const updatedOrder = {
        ...OrdeR,
        status: selectedStatus,
        customer_note: userNote,
        billing: {
          ...OrdeR.billing,
          first_name: billingDetails.first_name,
          last_name: billingDetails.last_name,
          address_1: billingDetails.address_1,
          city: billingDetails.city,
          state: billingDetails.state,
          postal_code: billingDetails.postal_code,
          country: billingDetails.country,
          phone: billingDetails.phone,
          email: billingDetails.email,
          _id: billingDetails._id,
        },
      };

      const response = await axios.put(
        `${Url}/api/v1/orders/edit/${OrdeR._id}`,
        updatedOrder
      );

      if (response.status === 200) {
        setToastMessage(successMessage);
        setShowMessage(true);

        setTimeout(() => {
          navigate("/E-Commerce/All-Orders");
        }, 2500);
      }
    } catch (error) {
      console.error("Error updating order:", error);
      setToastMessage(warningMessage);
      setShowMessage(true);
    } finally {
      setLoading(false);
    }
  };

  /* --- Function to handle submission of Order Status --- */
  // const handleSubmitNote = async () => {
  //   if (!orderNote.trim()) return;

  //   let successMessage = "Order note submitted successfully!";
  //   let warningMessage = "Failed to submit order note.";

  //   try {
  //     const response = await axios.post(
  //       `${Url}/api/v1/orders/add-note/${OrdeR._id}`,
  //       { note: orderNote }
  //     );

  //     if (response.status === 200) {
  //       setOrderNotes([...orderNotes, orderNote]);
  //       setOrderNote("");
  //       setToastMessage(successMessage);
  //       setShowMessage(true);
  //       setTimeout(() => {
  //         navigate("/E-Commerce/All-Orders");
  //       }, 2500);
  //     }
  //   } catch (error) {
  //     console.error("Error adding order note:", error);
  //     setToastMessage(warningMessage);
  //     setShowMessage(true);
  //   }
  // };

  const handleSubmitNote = async () => {
    if (!orderNote.trim()) return;

    let successMessage = "Order note submitted successfully!";
    let warningMessage = "Failed to submit order note.";

    setLoadingNote(true); // Start loader

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
      setLoadingNote(false); // Stop loader
    }
  };

  useEffect(() => {
    if (OrdeR.order_notes) {
      setOrderNotes(OrdeR.order_notes);  // Setting order notes from API response
    }
  }, [OrdeR.order_notes]);

  const confirmDelete = (noteId) => {
    setCurrentRowId(noteId);
    setShowConfirm(true);
  };

  const handleDelete = () => {
    console.log(`Deleting order note with ID: ${currentRowId}`);
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

  /* --- Function to Handle Display of Confirmation Dialogue Box of Delete Action --- */
  const handleDeleteClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      cancelDelete();
      // cancelSelectedDelete();
      // cancelDuplicate();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleDeleteClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleDeleteClickOutside);
    };
  }, []);

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  /* --- Function to handle Cart Details Item is_protect & protected_price --- */
  const handleProtectedChange = (id) => {
    setIsProtected((prevState) => {
      const updatedState = {
        ...prevState,
        [id]: prevState[id] === 1 ? 0 : 1,
      };

      setItemsArray((prevItems) =>
        prevItems.map((item) =>
          item._id === id
            ? {
              ...item,
              is_protected: updatedState[id],
              protected_price:
                updatedState[id] === 1
                  ? item.quantity > 1  // Always check quantity, even if unchanged
                    ? 199
                    : 149
                  : 0, // Reset price if is_protected is 0
            }
            : item
        )
      );

      return updatedState;
    });
  };

  /* --- Function to handle Cart Details Item quantity change --- */
  const handleItemChange = (id, field, value) => {
    setItemsArray((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item._id === id ? { ...item, [field]: value } : item
      );
      console.log("Updated Items: ", updatedItems);
      return updatedItems;
    });
  };

  useEffect(() => {
    /*console.log("Re-render with updated itemsArray: ", itemsArray);*/
  }, [itemsArray]);

  /* --- Function to handle Order Summary Protection Plan & Professional Assembly change --- */
  const handleOrderSummaryChange = (field, value) => {
    if (field === "cart_protected") {
      setCartProtected(value);
    } else if (field === "professional_assembled") {
      setProfessionalAssembled(value);
    }
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

  const handleEditClick = (id) => {
    setIsEditingState((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  // const updateCartDetails = async () => {
  //   setSummaryLoading(true);

  //   let successMessage = "Cart details submitted successfully!";
  //   let warningMessage = "Failed to update cart details.";
  //   try {
  //     // Update the itemsArray state first
  //     // const updatedItems = itemsArray.map((item) => ({
  //     //   ...item,
  //     //   is_protected: isProtected[item._id] || 0, // Ensure latest state is used
  //     //   protected_price: isProtected[item._id] === 1 ? 99 : 0, // Update protected_price accordingly
  //     // }));

  //     const updatedItems = itemsArray.map((item) => ({
  //       ...item,
  //       is_protected: isProtected[item._id] || 0,
  //       protected_price:
  //         isProtected[item._id] === 1
  //           ? item.quantity === 1
  //             ? 149
  //             : 199
  //           : 0,
  //     }));

  //     // Calculate new total including protection price
  //     // const protectionTotal = updatedItems.reduce((sum, item) => sum + item.protected_price, 0);

  //     const updatedTotal = (
  //       OrdeR.sub_total +
  //       OrdeR.shipping_cost +
  //       // protectionTotal +
  //       (cartProtected ? 199 : 0) +
  //       (professionalAssembled ? 210 : 0) +
  //       OrdeR.tax -
  //       OrdeR.discount
  //     ).toFixed(2);

  //     // Construct the updated order data
  //     const updatedData = {
  //       ...OrdeR,
  //       // cart_protected: updatedItems.some(item => item.is_protected === 1) ? 1 : 0,
  //       // cart_protection_price: protectionTotal,
  //       cart_protected: cartProtected ? 1 : 0,
  //       cart_protection_price: cartProtected ? 199 : 0,
  //       professional_assembled: professionalAssembled ? 1 : 0,
  //       professional_assembled_price: professionalAssembled ? 210 : 0,
  //       items: updatedItems,
  //       total: updatedTotal,
  //     };

  //     console.log("Final API Payload: ", updatedData);

  //     // Update state first before making the API call
  //     setItemsArray(updatedItems);

  //     // Make the API call separately
  //     const response = await axios.put(
  //       `${Url}/api/v1/orders/edit-order-items/${OrdeR._id}`,
  //       updatedData
  //     );

  //     if (response.status === 200) {
  //       setToastMessage(successMessage);
  //       setShowMessage(true);

  //       setTimeout(() => {
  //         navigate("/E-Commerce/All-Orders");
  //       }, 2500);
  //     }
  //   } catch (error) {
  //     console.error("Error updating order:", error);
  //     setToastMessage(warningMessage);
  //     setShowMessage(true);
  //   } finally {
  //     setSummaryLoading(false);
  //   }
  // };

  /* --- Function to update Cart Details section Items quantity, is_protected, protected_price and Summary cart_protection & professional_assembly --- */
  const updateCartDetails = async () => {
    setSummaryLoading(true);

    let successMessage = "Cart details submitted successfully!";
    let warningMessage = "Failed to update cart details.";

    try {
      const updatedItems = itemsArray.map((item) => ({
        ...item,
        is_protected: isProtected[item._id] || 0,
        protected_price:
          isProtected[item._id] === 1
            ? item.quantity === 1
              ? 149
              : 199
            : 0,
      }));

      const updatedTotal = (
        OrdeR.sub_total +
        OrdeR.shipping_cost +
        (cartProtected ? 199 : 0) +
        (professionalAssembled ? 210 : 0) +
        OrdeR.tax -
        OrdeR.discount
      ).toFixed(2);

      const updatedData = {
        ...OrdeR,
        cart_protected: cartProtected ? 1 : 0,
        cart_protection_price: cartProtected ? 199 : 0,
        professional_assembled: professionalAssembled ? 1 : 0,
        professional_assembled_price: professionalAssembled ? 210 : 0,
        items: updatedItems,
        total: updatedTotal,
      };

      console.log("Final API Payload: ", updatedData);

      setItemsArray(updatedItems);

      const response = await axios.put(
        `${Url}/api/v1/orders/edit-order-items/${OrdeR._id}`,
        updatedData
      );

      if (response.status === 200) {
        setToastMessage(successMessage);
        setShowMessage(true);

        setTimeout(() => {
          navigate("/E-Commerce/All-Orders");
        }, 2500);
      }
    } catch (error) {
      console.error("Error updating order:", error);
      setToastMessage(warningMessage);
      setShowMessage(true);
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <div className="EditOrderMainPage">

      {(summaryloading || loading || loadingNote) && (
        <div className="backdrop">
          <SectionLoader />
        </div>
      )}

      <div className="OrderSection-01">
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
                  <div className="RowData-Start-Edit">
                    <p className="Details-Headings">General Info</p>
                    <span className="Order-Rendering-Span-Labels">
                      Date & Time:
                    </span>
                    <InputField
                      type="text"
                      value={orderDate}
                      readOnly={true}
                      height={32}
                      width={255}
                    />
                    <label
                      style={{
                        fontFamily: "var(--font-family)",
                        fontSize: "var(--font-size-small)",
                        fontWeight: "var(--font-weight-semi-bold)",
                        lineHeight: "18px",
                        marginTop: "10px",
                        marginBottom: "7px",
                      }}
                    >
                      Status:
                    </label>
                    <Dropdowncustom
                      options={OrderStatusOptions}
                      selected={selectedStatus}
                      onChange={handleStatusChange} // Handle status change
                      dropdownClass="custom-dropdown-tax"
                      dropdownstyle={{ width: "256px" }}
                      headerborder="var(--standered-border)"
                      listmaxHeight="160px"
                      headerheight="32px"
                      headerBgColor="#FDFDFD"
                      size={17}
                    />
                    <label className="Order-Rendering-Labels">
                      Customer:
                    </label>
                    <InputField
                      type="text"
                      value={"Guest"}
                      /*value={orderDate}*/
                      readOnly={true}
                      height={32}
                      width={255}
                    />
                    <label className="Order-Rendering-Labels">
                      User Note:
                    </label>
                    <InputField
                      type="text"
                      value={userNote}
                      onChange={handleUserNoteChange}
                      height={32}
                      width={255}
                    />
                    <label className="Order-Rendering-Labels">
                      Payment Method
                    </label>
                    <InputField
                      type="text"
                      value={formatPaymentMethod(OrdeR.payment_method)}
                      readOnly={true}
                      height={32}
                      width={255}
                    />
                  </div>

                  <div className="RowData-Mid-Edit">
                    <div className="Main-Details-Heading">
                      <p className="Details-Headings-Rest">Billing Address</p>
                    </div>
                    {/* Combined First Name & Last Name Field */}
                    <InputField
                      type="text"
                      value={`${billingDetails.first_name} ${billingDetails.last_name}`}
                      onChange={handleNameChange}
                      height={28}
                      width={220}
                    />
                    <InputField
                      type="text"
                      name="address_1"
                      value={billingDetails.address_1}
                      onChange={handleChange}
                      height={28}
                      width={220}
                    />
                    {/* Combined City & State Field */}
                    <InputField
                      type="text"
                      value={`${billingDetails.city}, ${billingDetails.state}`}
                      onChange={handleCityStateChange}
                      height={28}
                      width={220}
                    />
                    {/* Combined Country & Postal Code Field */}
                    <InputField
                      type="text"
                      value={`${billingDetails.country} ${billingDetails.postal_code}`}
                      onChange={handleCountryPostalChange}
                      height={28}
                      width={220}
                    />
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
                      {OrdeR.billing.email}
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
                        marginTop: "2px",
                      }}
                    >
                      <InputField
                        type="text"
                        name="phone"
                        value={billingDetails.phone}
                        onChange={handleChange}
                        height={28}
                        width={220}
                      />
                    </span>
                  </div>

                </div>
                <div className="Details-Row-03">
                  <CustomBtn
                    label={loading ? <div className="btn-loader-Order"></div> : "Save"}
                    type="button"
                    onClick={updateOrderDetails}
                    className="ActionDetailsUpdateBtn"
                  />
                </div>
              </div>
            </div>

            {/* Cart Details Section */}
            <div className="Order-Leftside">
              <div className="OrderMainContainer">
                <span className="Order-Header">Cart Details</span>
                <div className="Order-Header-RightEdit">
                  <span className="Right-Content-Edit">Cost</span>
                  <span className="Right-Content-Edit">Qty</span>
                  <span className="Right-Content-Edit">Total</span>
                  <span className="Right-Content-Edit">Tax</span>
                  <span className="Right-Content-Edit">Action</span>
                </div>
              </div>

              <div className="OrderBodyContainer">
                {items.map((item) => {
                  const cost =
                    item.is_protected === 1
                      ? (item.total - 99) / item.quantity
                      : item.total / item.quantity;

                  return (
                    <div key={item._id} className="CartSection-Row">
                      <div className="ImgSection-Edit">
                        <img
                          src={`${Url + item.image}`}
                          alt={item.name}
                          className="ImageStyle-Order"
                        />
                      </div>

                      <div className="CartDescription-Edit">
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

                        {/* Protection Plan Checkbox */}
                        <label className="ItemStyling-1st">
                          <input
                            type="checkbox"
                            checked={isProtected[item._id] === 1}
                            onChange={() => handleProtectedChange(item._id)}
                            style={{
                              marginRight: "5px",
                              accentColor: isProtected[item._id] === 1 ? "green" : "gray",
                            }}
                            disabled={!isEditingState[item._id]}
                          />

                          {console.log(`Item ${item._id} is_protected:`, item.is_protected)}
                          Protected (+$99)
                        </label>
                      </div>

                      <div className="AmountHandling-Edit">
                        <div className="Cost">${cost.toFixed(2)}</div>

                        {/* Quantity Counter */}
                        {isEditingState[item._id] ? (
                          <div className="Counter">
                            <Counter
                              initialValue={item.quantity}
                              onCounterChange={(newQuantity) =>
                                handleItemChange(item._id, "quantity", newQuantity)
                              }
                            />
                          </div>
                        ) : (
                          <div className="Qty">{item.quantity}</div>
                        )}

                        <div className="Total">${item.total}</div>
                        <div className="Tax">${OrdeR.tax.toFixed(2)}</div>

                        {/* Edit Button */}
                        <div className="EditSpan" onClick={() => handleEditClick(item._id)}>
                          {isEditingState[item._id] ? <RiDeleteBin6Line className="deleteIcon" /> : "Edit"}
                        </div>

                      </div>
                    </div>
                  );
                })}

                {/* Order Summary */}
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

                      {/* Protection Plan Selection */}
                      <div className="items-Description-Summary">
                        <label className="Label-Summary">
                          <input
                            type="checkbox"
                            checked={cartProtected === 1}
                            onChange={(e) => handleOrderSummaryChange("cart_protected", e.target.checked ? 1 : 0)}
                            style={{ marginRight: 5 }}
                          />
                          Protection Plan (+$199)
                        </label>
                        <span>${cartProtected ? ppValue : 0}</span>
                      </div>

                      {/* Professional Assembly Selection */}
                      <div className="items-Description-Summary">
                        <label className="Label-Summary">
                          <input
                            type="checkbox"
                            checked={professionalAssembled === 1}
                            onChange={(e) => handleOrderSummaryChange("professional_assembled", e.target.checked ? 1 : 0)}
                            style={{ marginRight: 5 }}
                          />
                          Professional Assembly (+$210)
                        </label>
                        <span>${professionalAssembled ? paValue : 0}</span>
                      </div>

                      {/* Discount */}
                      <div className="items-Description">
                        <span>Discount:</span>
                        <span>${OrdeR.discount.toFixed(2)}</span>
                      </div>

                      {/* Tax */}
                      <div className="items-Description">
                        <span>Tax:</span>
                        <span>${OrdeR.tax.toFixed(2)}</span>
                      </div>

                      <div className="RowSeparator-Total"></div>

                      {/* Grand Total */}
                      <div className="items-TotalDescription">
                        <span className="TotalDescription">Grand Total:</span>
                        <span className="TotalDescription">${calculateTotal()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="Order-Total-Btn">
                    <CustomBtn
                      label={summaryloading ? <div className="btn-loader-Order"></div> : "Save"}
                      type="button"
                      onClick={updateCartDetails}
                      className="ActionDetailsUpdateBtn"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Order Edit Page - RightSide */}
          <div className="RightSection">

            {/* --- Customer History Section --- */}
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

            {/* --- Order Attribution Sectio --- */}
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
                  {/* <span className="History-Heading">Session Page Views</span>
                  <span className="History-Value">12</span> */}
                </div>
              </div>
            </div>

            {/* --- Order Status Section --- */}
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

export default EditOrders;
