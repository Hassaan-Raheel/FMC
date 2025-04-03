import React from "react";
// import "../../Pages/ECommerce/ECommerce.css";
// import "../../Pages/Page.css";
import "./ECommerceComponents.css";
import CustomBtn from "../../Components/UI-Controls/Buttons/Btn";
import actionIcon from "../../Assets/Images/ActionBtn 30 x 30.png";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
// import MainLoader from "../../Components/UI-Controls/MainLoader/MainLoader";
// import CustomPagination from "../../Components/UI-Controls/Pagination/Pagination";
import ShimmerLoader from "../../Components/UI-Controls/Loader/ShimmerLoader";
import Pagination from "../../Components/UI-Controls/Pagination/PaginationRashid";
import AddStore from "../ECommerceComponents/AddStore";
import { Url } from "../../Services/Api";

const StoreLocator = () => {
  const rowsPerPage = 5;
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddStore, setShowAddStore] = useState(false);

  useEffect(() => {
    fetchTableData();
  }, []);

  // const handlePageChange = (page) => {
  //   console.log("Changing to page:", page);
  //   setCurrentPage(page);
  // };

  async function fetchTableData() {
    setLoading(true);
    setTimeout(async () => {
      try {
        const URL = `${Url}/api/v1/stores/get`;
        const response = await fetch(URL);
        const result = await response.json();
        setData(result.data);
       // console.log("Store Data:", result.data);
      } catch (error) {
        console.error("Error fetching store data:", error);
      } finally {
        setLoading(false);
      }
    }, 2000);
  }

  // async function fetchTableData() {
  //   setLoading(true);
  //   try {
  //     const URL = `${Url}/api/v1/stores/get`;
  //     const response = await fetch(URL);
  //     const result = await response.json();
  //     setData(result.data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  const customSearchStyles = {
    indicatorSeparator: () => ({
      display: "none", // Hides the separator
    }),
    menu: (provided) => ({
      ...provided,
      position: "absolute", // Ensure dropdown is positioned correctly
      top: "100%", // Position below the select
      left: 0, // Align with the left edge of the select
      margin: 0, // Remove any margin
      padding: 0, // Remove any padding
      height: "auto", // Let the dropdown expand based on content
      overflowY: "visible", // Disable any vertical scrolling
      maxHeight: "none", // Remove max height restriction
      zIndex: 99999, // Adjust zIndex here
    }),
    menuList: (provided) => ({
      ...provided,
      padding: 0, // Remove any padding
      maxHeight: "none", // Ensure it expands fully
      overflowY: "visible", // Ensure no scrollbar
    }),
    control: (provided) => ({
      ...provided,
      minHeight: "40px", // Ensure the height of the control bar is consistent
      marginBottom: "0", // Ensure no margin below the control
    }),
  };

  const handleAddStore = () => {
    const button = document.querySelector(".AddStoreBtn"); // Update the selector if needed
    button.classList.add("animate"); // Add animation class

    // Update the URL dynamically
    window.history.pushState(
      null,
      "",
      "/E-Commerce/Settings/Location/Add-Store"
    );

    setTimeout(() => {
      setShowAddStore(true); // Toggle the AddStore component
    }, 500);
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
        // background: "#FDFDFD",
      },
    },
    cells: {
      style: {
        height: "66px",
        justifyContent: "center",
        textAlign: "center",
        background: "transparent",
        borderTop: "--standered-border",
        borderRight: "none",
        color: "var(--text-color-1)",
        fontFamily: "var(--font-family)",
        fontWeight: "var(--font-weight-regular)",
        fontSize: "var(--font-size-small)",
        // background: "#FFFFFF",
        // borderTop: "1px solid #F0F0F0",
      },
    },
  };

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
      width: "50px",
    },
    {
      name: "Store Id",
      selector: (row) => (loading ? <ShimmerLoader width="60px" height="20px" borderRadius="10px" /> : row.store_id ),
      width: "100px",
    },
    {
      name: "Name",
      selector: (row) => (loading ? <ShimmerLoader width="80px" height="20px" borderRadius="20px" /> : row.name ),
      width: "130px",
    },
    {
      name: "Manager",
      selector: (row) => (loading ? <ShimmerLoader width="100px" height="20px" borderRadius="20px" /> : row.manager ),
      width: "160px",
    },
    {
      name: "Phone #",
      selector: (row) => (loading ? <ShimmerLoader width="90px" height="20px" borderRadius="20px" /> : row.phone ),
      width: "120px",
    },
    {
      name: "City",
      selector: (row) => (loading ? <ShimmerLoader width="90px" height="20px" borderRadius="20px" /> : row.city ),
      width: "125px",
    },
    {
      name: "State",
      selector: (row) => (loading ? <ShimmerLoader width="90px" height="20px" borderRadius="20px" /> : row.state ),
      width: "125px",
    },
    {
      name: "Postal Code",
      selector: (row) => (loading ? <ShimmerLoader width="90px" height="20px" borderRadius="15px" /> : row.postal_code ),
      width: "125px",
    },
    {
      name: "Action",
      cell: (row) => (loading ? <ShimmerLoader width="50px" height="20px" /> :
        <img
          src={actionIcon}
          alt="Action Icon"
          width="30"
          height="30"
          style={{ cursor: "pointer" }}
          onClick={() => console.log("Action clicked for:", row)}
        />
      ),
      width: "110px",
    },
  ];

  // Page change handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Ensure data is an array
  const safeData = Array.isArray(data) ? data : [];

  // Calculate total pages
  const totalLocationPages = Math.ceil(safeData.length / rowsPerPage);

  // Slice data for current page
  const paginatedLocationData = safeData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleLocationPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleLocationNextPage = () => {
    if (currentPage < totalLocationPages) setCurrentPage(currentPage + 1);
  };

 const placeholderRows = Array(6).fill({ uid: "", name: "", image: "" });
 const displayedLocatorData = loading ? placeholderRows : paginatedLocationData;

  return (
    <div className="StoreLocatorPage">
      {showAddStore ? (
        <AddStore />
      ) : (
        <>
          <div className="Page_Row_01">
            <CustomBtn
              label="Add Store"
              withIcon={true}
              iconType="plus"
              className="AddStoreBtn"
              onClick={handleAddStore}
              type="submit"
            />
          </div>

          <div className="Locator-Table-Data">
            {/* <DataTable
              columns={columns}
              data={
                Array.isArray(data)
                  ? data.slice(
                      (currentPage - 1) * rowsPerPage,
                      currentPage * rowsPerPage
                    )
                  : []
              }
              pagination
              paginationComponent={() => (
                <CustomPagination
                  rowsPerPage={rowsPerPage}
                  rowCount={Array.isArray(data) ? data.length : 0}
                  currentPage={currentPage}
                  onChangePage={handlePageChange}
                />
              )}
              customStyles={customStyles}
            /> */}
            <div>
              <DataTable
                columns={columns}
                // data={paginatedLocationData}
                data={displayedLocatorData}
                customStyles={customStyles}
              />
              <Pagination
                activePageIndex={currentPage}
                totalPages={totalLocationPages}
                onPrevPage={handleLocationPrevPage}
                onNextPage={handleLocationNextPage}
                onPageChange={handlePageChange}
              />
            </div>
            {/* <DataTable columns={columns} data={data} progressPending={loading} customStyles={customStyles} /> */}
          </div>
        </>
      )}
    </div>
  );
};

export default StoreLocator;
