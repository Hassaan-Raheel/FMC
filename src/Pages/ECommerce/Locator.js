import React from "react";
import "./ECommerce.css";
import "../Page.css";
import CustomBtn from "../../Components/UI-Controls/Buttons/Btn";
import actionIcon from "../../Assets/Images/ActionBtn 30 x 30.png";
import { Url } from "../../Services/Api";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import MainLoader from "../../Components/UI-Controls/MainLoader/MainLoader";
import CustomPagination from "../../Components/UI-Controls/Pagination/Pagination";

const StoreLocator = () => {
  const rowsPerPage = 5;
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchTableData();
  }, []);

  const handlePageChange = (page) => {
    console.log("Changing to page:", page);
    setCurrentPage(page);
  };

  async function fetchTableData() {
    setLoading(true);
    try {
      const URL = `${Url}/api/v1/stores/get`;
      const response = await fetch(URL);
      const result = await response.json();
      setData(result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

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
    const button = document.querySelector(".AddBtn"); // Get the button
    button.classList.add("animate"); // Add animation class

    setTimeout(() => {
      navigate("/fm-dashboard/add-product");
    }, 500);
  };

  const customStyles = {
    headCells: {
      style: {
        height: "52px",
        borderRadius: "5px 5px 0px 0px",
        background: "#FDFDFD",
        opacity: "1",
        textAlign: "center",
        justifyContent: "center",
        border: "none",
        color: "var(--text-color)",
        fontFamily: "poppins",
        fontWeight: "500",
        fontSize: "14px",
      },
    },
    cells: {
      style: {
        height: "66px",
        justifyContent: "center",
        textAlign: "center",
        background: "#FFFFFF",
        borderTop: "1px solid #F0F0F0",
        borderRight: "none",
        color: "#858585",
        fontFamily: "poppins",
        fontWeight: "400",
        fontSize: "12px",
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
      cell: (row) => (
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
      name: "Store_Id",
      selector: (row) => row.store_id,
      width: "100px",
    },
    {
      name: "Name",
      selector: (row) => row.name, // Assuming you want the price
      width: "140px",
    },
    {
      name: "Manager",
      selector: (row) => row.manager,
      width: "170px",
    },
    {
      name: "Phone #",
      selector: (row) => row.phone,
      width: "120px",
    },
    {
      name: "City",
      selector: (row) => row.city,
      width: "125px",
    },
    {
      name: "State",
      selector: (row) => row.state,
      width: "125px",
    },
    {
      name: "Postal Code",
      selector: (row) => row.postal_code,
      width: "125px",
    },
    {
      name: "Action",
      cell: (row) => (
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

  return (
    <div className="StoreLocatorPage">
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

      {loading && (
        <div className="backdrop">
          {/* <Loader /> */}
          <MainLoader />
        </div>
      )}

      <div className="Locator-Table-Data">
        <DataTable
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
        />
        {/* <DataTable columns={columns} data={data} progressPending={loading} customStyles={customStyles} /> */}
      </div>
    </div>
  );
};

export default StoreLocator;
