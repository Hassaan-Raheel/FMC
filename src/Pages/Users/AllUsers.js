import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import "./Users.css";
import "../ECommerce/ECommerce.css";
import "../Page.css";
import ShimmerLoader from "../../Components/UI-Controls/Loader/ShimmerLoader";
import CustomBtn from "../../Components/UI-Controls/Buttons/Btn";
import editIcon from "../../Assets/Images/edit.png";
import deleteIcon from "../../Assets/Images/delete-black.png";
import eyeIcon from "../../Assets/Images/eye-black.png";
import actionIcon from "../../Assets/Images/ActionBtn 30 x 30.png";
import DataTable from "react-data-table-component";
import Pagination from "../../Components/UI-Controls/Pagination/PaginationRashid";
import CustomDropdown from "../../Components/UI-Controls/Dropdown/dropdown";
import defaultImage from "../../Assets/Images/defaultBannerImage 128 x 128.png";
import { IoImageOutline } from "react-icons/io5";
import { Url } from "../../Services/Api";
// import SearchBar from "../../Components/UI-Controls/SearchBar/Search";
// import searchIcon from "../../Assets/Images/Search Bar 20 x 20.png";
// import uploadIcon from "../../Assets/Images/uploadImg 48 x 48.png";
// import Loader from "../../Components/UI-Controls/Loader/Loader";
// import MainLoader from "../../Components/UI-Controls/MainLoader/MainLoader";
// import CustomPagination from "../../Components/UI-Controls/Pagination/Pagination";

const AllUser = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [userData, setUserData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role: "",
    userNotification: false,
  });
  const [uploadImage, setUploadImage] = useState(null);
  // const [activeRowId, setActiveRowId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [filteredData, setFilteredData] = useState(data);
  const rowsPerPage = 10;

  // Calculate total pages based on your data
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle previous page
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Slice data for current page
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  useEffect(() => {
    console.log("Fetching data...");
    fetchTableData();
  }, []);

  // async function fetchTableData() {
  //   setLoading(true);
  //   const URL = `${Url}/api/v1/users/get`;
  //   const token = sessionStorage.getItem("authToken"); // Retrieve token from sessionStorage

  //   if (!token) {
  //     console.error("No auth token found. Please log in.");
  //     return;
  //   }

  //   try {
  //     const response = await fetch(URL, {
  //       headers: {
  //         Authorization: `${token}`, // Include token in Authorization header
  //       },
  //     });

  //     if (response.ok) {
  //       const users = await response.json();
  //       const Users = users.data;
  //       console.log(Users);
  //       const reversedCategories = Users.reverse();

  //       setData(reversedCategories); // Set data in state
  //       setFilteredData(reversedCategories);
  //       console.log(reversedCategories);
  //     } else if (response.status === 401) {
  //       console.error("Unauthorized: Invalid token.");
  //       handleLogout(); // Call logout if token is invalid
  //     } else {
  //       console.error("Error fetching data:", response.statusText);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  async function fetchTableData() {
    setLoading(true);
    setTimeout(async () => {
      const URL = `${Url}/api/v1/users/get`;
      const token = sessionStorage.getItem("authToken"); 
  
      if (!token) {
        console.error("No auth token found. Please log in.");
        setLoading(false); 
        return;
      }
  
      try {
        const response = await fetch(URL, {
          headers: {
            Authorization: `${token}`, 
          },
        });
  
        if (response.ok) {
          const users = await response.json();
          const Users = users.data;
          console.log(Users);
          const reversedCategories = Users.reverse();
  
          setData(reversedCategories); 
          setFilteredData(reversedCategories);
          console.log(reversedCategories);
        } else if (response.status === 401) {
          console.error("Unauthorized: Invalid token.");
          handleLogout(); 
        } else {
          console.error("Error fetching data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }, 2000); 
  }

  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    window.location.href = "/"; // Redirect to login page
  };

  const handleSearch = () => console.log("Search has been triggered");

  // const handlePageChange = (page) => {
  //   setCurrentPage(page);
  // };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      const allRowIds = data.map((row) => row._id);
      setSelectedRows(allRowIds);
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (rowId) => {
    setSelectedRows((prevSelected) => {
      if (prevSelected.includes(rowId)) {
        return prevSelected.filter((id) => id !== rowId);
      } else {
        return [...prevSelected, rowId];
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Update state for checkbox
    if (type === "checkbox") {
      setUserData((prevState) => ({
        ...prevState,
        [name]: checked, // Update checkbox value
      }));
    } else {
      setUserData((prevState) => ({
        ...prevState,
        [name]: value, // Update other input fields
      }));
    }
  };

  const handleuploadImage = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setUploadImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleAddUser = async () => {
    const formData = new FormData();

    // Append form fields to FormData
    formData.append("username", userData.username);
    formData.append("firstname", userData.firstname);
    formData.append("lastname", userData.lastname);
    formData.append("email", userData.email);
    formData.append("password", userData.password);
    formData.append("role", userData.role);
    formData.append("userNotification", userData.userNotification); // Checkbox value

    // Append uploaded image if exists
    const uploadImageInput = document.getElementById("uploadImage");
    if (uploadImageInput && uploadImageInput.files[0]) {
      formData.append("image", uploadImageInput.files[0]);
    }

    try {
      setLoading(true);
      console.log("Form submission started with data:", userData);

      const response = await axios.post(
        `${Url}/api/v1/productCategory`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Form submission successful:", response.data);

      // Optionally reset form and image
      setUserData({
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        role: "",
        userNotification: false,
      });
      setUploadImage(null);
      // Trigger any data refresh or updates needed (e.g., fetchTableData())
    } catch (error) {
      // Detailed error handling
      if (error.response) {
        console.error("Error submitting form:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });
        alert(
          `Error: ${
            error.response.data.message ||
            "An error occurred. Please try again."
          }`
        );
      } else if (error.request) {
        console.error("Error: No response received:", error.request);
        alert(
          "Error: No response from server. Please check your connection and try again."
        );
      } else {
        console.error("Error:", error.message);
        alert("Error: " + error.message);
      }
    } finally {
      setLoading(false);
      console.log("Form submission ended.");
    }
  };

  const customStyles = {
    headCells: {
      style: {
        height: "52px",
        background: "transparent",
        opacity: "1",
        textAlign: "center",
        justifyContent: "center",
        border: "none",
        color: "var(--text-color-1)",
        fontFamily: "var(--font-family)",
        fontWeight: "var(--font-weight-medium)",
        fontSize: "var(--font-size-medium)",
      },
    },
    cells: {
      style: {
        height: "66px",
        justifyContent: "center",
        textAlign: "center",
        background: "transparent",
        borderTop: "var(--standered-border)",
        borderRight: "none",
        color: "var(--text-color-1)",
        fontFamily: "var(--font-family)",
        fontWeight: "var(--font-weight-regular)",
        fontSize: "var(--font-size-small)",
      },
    },
  };

  const toggleDropdown = (_id) => {
    setOpenDropdownId((prevId) => (prevId === _id ? null : _id)); // Close if the same dropdown is clicked
  };

  const handleAction = (action, row) => {
    console.log(`Action: ${action} triggered for row:`, row);
    // Perform specific action based on the selected option
    switch (action) {
      case "edit":
        // handleEdit(row);
        setOpenDropdownId(null);
        break;
      case "delete":
        // handleDelete(row);
        setOpenDropdownId(null);
        break;
        case "cancel":
          // handleCancel(row);
          setOpenDropdownId(null);
          break;
      case "view":
        // handleView(row);
        setOpenDropdownId(null);
        break;
      default:
        break;
    }
  };

  const handleClickOutside = (event) => {
    if (
      !event.target.closest(".dropdown-menu") &&
      !event.target.closest(".bar-icon")
    ) {
      setOpenDropdownId(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // const columns = [
  //   {
  //     name: (
  //       <input
  //         type="checkbox"
  //         style={{ margin: 0 }}
  //         onChange={(e) => handleSelectAll(e.target.checked)}
  //         checked={selectedRows.length === data.length && data.length > 0}
  //       />
  //     ),
  //     cell: (row) => (
  //       <input
  //         type="checkbox"
  //         style={{ margin: 0 }}
  //         onChange={() => handleRowSelect(row._id)}
  //         checked={selectedRows.includes(row._id)}
  //       />
  //     ),
  //     ignoreRowClick: true,
  //     allowOverflow: true,
  //     button: true,
  //     width: "50px",
  //   },
  //   {
  //     name: "User Name",
  //     cell: (row) => (
  //       <div
  //         style={{
  //           display: "flex",
  //           alignItems: "center",
  //           justifyContent: "left",
  //         }}
  //       >
  //         <img
  //           src={row.image ? `http://fm.skyhub.pk${row.image}` : defaultImage}
  //           alt={row.username}
  //           width="40px"
  //           height="40px"
  //           style={{
  //             borderRadius: "50%",
  //             marginRight: "10px",
  //             objectFit: "cover",
  //           }}
  //         />
  //         <span>{row.username}</span>
  //       </div>
  //     ),
  //     width: "180px",
  //   },
  //   {
  //     name: "First Name",
  //     selector: (row) => row.first_name,
  //     width: "85px",
  //   },
  //   {
  //     name: "Last Name",
  //     selector: (row) => row.last_name,
  //     width: "85px",
  //   },
  //   {
  //     name: "Email",
  //     selector: (row) => row.email,
  //     width: "150px",
  //   },
  //   {
  //     name: "Role",
  //     selector: (row) => row.role,
  //     width: "50px",
  //   },
  //   {
  //     name: "Action",
  //     cell: (row) => (
  //       <div style={{ position: "relative" }}>
  //         <img
  //           src={actionIcon}
  //           alt="Action Icon"
  //           width="30"
  //           height="30"
  //           style={{ cursor: "pointer" }}
  //           className={`bar-icon ${
  //             openDropdownId === row._id ? "rotated" : ""
  //           }`}
  //           onClick={() => toggleDropdown(row._id)}
  //         />
  //         {openDropdownId === row._id && ( // Only show dropdown if its _id matches
  //           <div className={`dropdown-menu show`}>
  //             <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
  //               <li
  //                 style={{
  //                   display: "flex",
  //                   alignItems: "center",
  //                   cursor: "pointer",
  //                   padding: "5px 10px",
  //                   border: "none",
  //                 }}
  //                 onClick={() => handleAction("view", row)}
  //               >
  //                 <img
  //                   src={eyeIcon}
  //                   alt="View"
  //                   width="15"
  //                   height="15"
  //                   style={{ marginRight: "12px" }}
  //                 />
  //                 View
  //               </li>
  //               <li
  //                 style={{
  //                   display: "flex",
  //                   alignItems: "center",
  //                   cursor: "pointer",
  //                   padding: "5px 10px",
  //                   border: "none",
  //                 }}
  //                 onClick={() => handleAction("edit", row)}
  //               >
  //                 <img
  //                   src={editIcon}
  //                   alt="Edit"
  //                   width="15"
  //                   height="15"
  //                   style={{ marginRight: "12px" }}
  //                 />
  //                 Edit
  //               </li>
  //               <li
  //                 style={{
  //                   display: "flex",
  //                   alignItems: "center",
  //                   cursor: "pointer",
  //                   padding: "5px 10px",
  //                   border: "none",
  //                 }}
  //                 onClick={() => handleAction("quickEdit", row)}
  //               >
  //                 <img
  //                   src={editIcon}
  //                   alt="Edit"
  //                   width="15"
  //                   height="15"
  //                   style={{ marginRight: "12px" }}
  //                 />
  //                 Quick Edit
  //               </li>
  //               <li
  //                 style={{
  //                   display: "flex",
  //                   alignItems: "center",
  //                   cursor: "pointer",
  //                   padding: "5px 10px",
  //                   border: "none",
  //                 }}
  //                 onClick={() => handleAction("delete", row)}
  //               >
  //                 <img
  //                   src={deleteIcon}
  //                   alt="Delete"
  //                   width="15"
  //                   height="15"
  //                   style={{ marginRight: "12px" }}
  //                 />
  //                 Delete
  //               </li>
  //             </ul>
  //           </div>
  //         )}
  //       </div>
  //     ),
  //     width: "75px",
  //   },
  // ];

  // Options for the Selected Role Dropdown
  
  const columns = [
    {
      name: (
        <input
          type="checkbox"
          style={{ margin: 0 }}
          onChange={(e) => console.log("All selected:", e.target.checked)}
        />
      ),
      cell: (row) => (loading ? <ShimmerLoader width="20px" height="20px" /> :
        <input
          type="checkbox"
          style={{ margin: 0 }}
          onChange={(e) => console.log("Selected:", row, e.target.checked)}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "40px",
    },
    {
      name: "User Name",
      cell: (row) => (loading ? <ShimmerLoader width="120px" height="20px" borderRadius="20px" /> :
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "left",
          }}
        >
          <img
            src={row.image ? `${Url+row.image}` : defaultImage}
            alt={row.username}
            width="40px"
            height="40px"
            style={{
              borderRadius: "50%",
              marginRight: "10px",
              objectFit: "cover",
            }}
          />
          <span>{row.username}</span>
        </div>
      ),
      width: "165px",
    },
    {
      name: "First Name",
      selector: (row) => (loading ? <ShimmerLoader width="80px" height="22.5px" borderRadius="20px"/> : row.first_name ),
      width: "110px",
    },
    {
      name: "Last Name",
      selector: (row) => (loading ? <ShimmerLoader width="60px" height="22.5px" borderRadius="15px"/> : row.last_name ),
      width: "110px",
    },
    {
      name: "Email",
      selector: (row) => (loading ? <ShimmerLoader width="60px" height="22.5px" borderRadius="15px"/> : row.email ),
      width: "100px",
    },
    {
      name: "Role",
      selector: (row) => (loading ? <ShimmerLoader width="60px" height="22.5px" /> : row.role ),
      width: "65px",
    },
    {
      name: "Action",
      cell: (row) => (loading ? <ShimmerLoader width="60px" height="22.5px" /> :
        <div style={{ position: "relative" }}>
          <img
            src={actionIcon}
            alt="Action Icon"
            width="40"
            height="40"
            style={{ cursor: "pointer", margin: 0, padding: 0 }}
            className={`bar-icon ${
              openDropdownId === row._id ? "rotated" : ""
            }`}
            onClick={() => toggleDropdown(row._id)}
          />
          {openDropdownId === row._id && (
            <div className={`dropdown-menu show animate-dropdown-left`}>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    padding: "5px 10px",
                    border: "none",
                  }}
                  onClick={() => handleAction("view", row)}
                >
                  <img
                    src={eyeIcon}
                    alt="View"
                    width="15"
                    height="15"
                    style={{ marginRight: "12px", transition: "filter 0.05s ease", }}
                    className="icon-img"
                  />
                  View
                </li>
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    padding: "5px 10px",
                    border: "none",
                  }}
                  onClick={() => handleAction("edit", row)}
                >
                  <img
                    src={editIcon}
                    alt="Edit"
                    width="15"
                    height="15"
                    style={{ marginRight: "12px", transition: "filter 0.05s ease", }}
                    className="icon-img"
                  />
                  Edit
                </li>
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    padding: "5px 10px",
                    border: "none",
                  }}
                  onClick={() => handleAction("cancel", row)}
                >
                  <img
                    src={deleteIcon}
                    alt="Delete"
                    width="15"
                    height="15"
                    style={{ marginRight: "12px", transition: "filter 0.05s ease", }}
                    className="icon-img"
                  />
                  Cancel
                </li>
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    padding: "5px 10px",
                    border: "none",
                  }}
                  onClick={() => handleAction("delete", row)}
                >
                  <img
                    src={deleteIcon}
                    alt="Delete"
                    width="15"
                    height="15"
                    style={{ marginRight: "12px", transition: "filter 0.05s ease", }}
                    className="icon-img"
                  />
                  Delete
                </li>
              </ul>
            </div>
          )}
        </div>
      ),
      width: "85px",
    },
  ];

  const roleOptions = [
    { value: "Customer", label: "Customer" },
    { value: "Contributor", label: "Contributor" },
    { value: "Store Manager", label: "Store Manager" },
    { value: "Client Admin", label: "Client Admin" },
    { value: "Product Editor", label: "Product Editor" },
    { value: "Ads Manager", label: "Ads Manager" },
    { value: "Analyst", label: "Analyst" },
    { value: "Super Admin", label: "Super Admin" },
  ];

  // Handler for selected role dropdown change
  const handleSelectedRole = (selectedValue) => {
    setUserData((prevState) => ({
      ...prevState,
      role: selectedValue, // Update role value
    }));
  };

  const handlePasswordGen = () => {
    const generatedPassword = Math.random().toString(36).slice(-8); // Example password generator
    setUserData((prevState) => ({
      ...prevState,
      password: generatedPassword,
    }));
  };

  const placeholderRows = Array(7).fill({ uid: "", name: "", image: "" });

  const displayedData = loading ? placeholderRows : paginatedData;

  return (
    <div className="AllUserPage">
      {/* <div className="UserSection-01">
        <span className='Section1-Leftside'>
          All Users
        </span>
        <div className='Section1-Rightside'>
          <SearchBar onSearch={handleSearch} icon={searchIcon} placeholder="Search users by name" />
        </div>
      </div> */}

      <div className="UserSection-02">
        <div className="Section2-Leftside-User">
          <div className="Header">Add Users</div>
          <div className="NewUser-Add">
            {/* {loading && (
              <div className="backdrop">
                <MainLoader />
              </div>
            )} */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddUser();
              }}
            >
              <div className="formRow">
                <label htmlFor="username">
                  User Name<span className="superscript">*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter User Name..."
                  value={userData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="formRow-1">
                <div className="firstName">
                  <label htmlFor="firstname">
                    First Name<span className="superscript">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstname"
                    name="firstname"
                    placeholder="Enter First Name..."
                    value={userData.firstname}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="lastName">
                  <label htmlFor="lastname">
                    Last Name<span className="superscript">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    placeholder="Enter Last Name..."
                    value={userData.lastname}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="formRow">
                <label htmlFor="email">
                  Email<span className="superscript">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter Email..."
                  value={userData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="formRow">
                <label htmlFor="password">
                  Password<span className="superscript">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter Password..."
                  value={userData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="PasswordGenBtn">
                <CustomBtn
                  label="Generate Password"
                  className="GenPasswordBtn"
                  onClick={handlePasswordGen}
                  type="button"
                />
              </div>

              <div className="formRow custom-dropdown-wrapper-no-scroll">
                <label htmlFor="role">
                  Select Role<span className="superscript">*</span>
                </label>
                <div className="custom-dropdown-wrapper">
                  <CustomDropdown
                    options={roleOptions}
                    selectedOption={userData.role}
                    handleOptionChange={handleSelectedRole}
                    dropdownWidth={310}
                    dropdownMarginBottom="10px"
                    backgroundColor="var(--third-layer-bg)"
                    optionsWidth={308}
                    optionsBackgroundColor="var(--third-layer-bg)"
                    dropdownSelectedStyle="7px"
                  />
                </div>
              </div>

              <div
                className="form-group"
                style={{
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  paddingBottom: "2px",
                  marginTop: 10,
                  marginBottom: 10,
                }}
              >
                <input
                  type="checkbox"
                  name="userNotification"
                  id="userNotification"
                  checked={userData.userNotification}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="userNotification"
                  style={{ fontSize: "12px", marginLeft: 10 }}
                >
                  Send User Notification
                </label>
              </div>

              <div className="formRow">
                <label htmlFor="uploadImage">Upload Image</label>
                <div className="Image-upload">
                  <label htmlFor="uploadImage" className="upload-label">
                    <div className="upload-button">
                      {/* <img
                        src={uploadIcon}
                        alt=""
                        className="uploaded-image-User"
                        id="uploaded-image-1"
                      /> */}
                      <IoImageOutline size={45} color="#555" className="uploaded-image-User" />
                      <span className="upload-text">Click to Upload Image</span>
                    </div>
                  </label>
                  <input
                    type="file"
                    id="uploadImage"
                    name="uploadImage"
                    className="upload-input"
                    accept="image/*"
                    onChange={handleuploadImage}
                  />
                </div>
                {/* Optional: Display upload image */}
                {uploadImage && (
                  <img
                    src={uploadImage}
                    alt="Upload Image"
                    className="image-preview"
                  />
                )}
              </div>

              <div className="SubmitBtn-User">
                <CustomBtn
                  label="Add User"
                  className="AddUserBtn"
                  onClick={handleAddUser}
                  type="button"
                />
              </div>
            </form>
          </div>
        </div>
        <div className="Section2-Rightside-User">
        {/* <DataTable
          columns={columns}
          data={filteredData.slice(
            (currentPage - 1) * rowsPerPage,
            currentPage * rowsPerPage
          )}
          pagination
          paginationComponent={() => (
            <CustomPagination
              rowsPerPage={rowsPerPage}
              rowCount={filteredData.length}
              currentPage={currentPage}
              onChangePage={handlePageChange}
            />
          )}
          customStyles={customStyles}
        /> */}

        <div>
              <DataTable 
                columns={columns}
                // data={paginatedData}
                data={displayedData}
              />
              <Pagination
                activePageIndex={currentPage}
                totalPages={totalPages}
                onPrevPage={handlePrevPage}
                onNextPage={handleNextPage}
                onPageChange={handlePageChange}
              />
            </div>
        </div>
      </div>
    </div>
  );
};

export default AllUser;
