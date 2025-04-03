import React, { useState, useEffect } from "react";
import axios from "axios";
import "./GeneralPage.css";
import DataTable from "react-data-table-component";
// import CustomPagination from '../../Components/UI-Controls/Pagination/Pagination';
import Pagination from "../../Components/UI-Controls/Pagination/PaginationRashid";
import ShimmerLoader from "../../Components/UI-Controls/Loader/ShimmerLoader";

const Careers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;

  // Function to fetch data from API
  // const fetchData = async () => {
  //   setLoading(true);
  //   try {
  //     // Replace with your API endpoint if available
  //     const response = await axios.get('/api/your-endpoint');
  //     setData(response.data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     // If API fails, fallback to hardcoded data
  //     setData([
  //       {
  //         uid: 1,
  //         name: "Abdul Saboor",
  //         contact: "0317-xxx-yyyy",
  //         email: "a.saboor.zellesolutions@gmail.com",
  //         city: "karachi",
  //         state: "Sindh",
  //         resume: null
  //       },
  //       {
  //         uid: 2,
  //         name: "Rashid Ali",
  //         contact: "0317-yyy-xxxx",
  //         email: "rashid.zellesolutions@gmail.com",
  //         city: "Lahore",
  //         state: "Punjab",
  //         Resume: null,
  //       },
  //       {
  //         uid: 3,
  //         name: "Abdul Sami",
  //         contact: "0317-xxy-xxyy",
  //         email: "abdulsami.zellesolutions@gmail.com",
  //         city: "Lahore",
  //         state: "Punjab",
  //         Resume: null,
  //       },
  //       {
  //         uid: 4,
  //         name: "Muhammad Faraz",
  //         contact: "0317-yyx-yyxx",
  //         email: "faraz.zellesolutions@gmail.com",
  //         city: "Karachi",
  //         state: "Sindh",
  //         Resume: null,
  //       },
  //       {
  //         uid: 5,
  //         name: "Sajid",
  //         contact: "0317-xyx-yyyy",
  //         email: "sajid.zellesolutions@gmail.com",
  //         city: "karachi",
  //         state: "Sindh",
  //         Resume: null
  //       },
  //       {
  //         uid: 6,
  //         name: "Noman",
  //         contact: "0317-yxy-xxxx",
  //         email: "noman.zellesolutions@gmail.com",
  //         city: "Lahore",
  //         state: "Punjab",
  //         Resume: null,
  //       },
  //       {
  //         uid: 7,
  //         name: "Faizan Shamsi",
  //         contact: "0317-xyx-xyxy",
  //         email: "faizan.zellesolutions@gmail.com",
  //         city: "Karachi",
  //         state: "Sindh",
  //         Resume: null,
  //       },
  //       {
  //         uid: 8,
  //         name: "Muhammad Shehroz",
  //         contact: "0317-yyy-xxyx",
  //         email: "shehroz.zellesolutions@gmail.com",
  //         city: "Karachi",
  //         state: "Sindh",
  //         Resume: null,
  //       },
  //     ]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchData = async () => {
    setLoading(true);
    setTimeout(async () => {
      try {
        // Replace with your API endpoint if available
        const response = await axios.get("/api/your-endpoint");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        // If API fails, fallback to hardcoded data
        setData([
          {
            uid: 1,
            name: "Abdul Saboor",
            contact: "0317-xxx-yyyy",
            email: "a.saboor.zellesolutions@gmail.com",
            city: "karachi",
            state: "Sindh",
            resume: null,
          },
          {
            uid: 2,
            name: "Rashid Ali",
            contact: "0317-yyy-xxxx",
            email: "rashid.zellesolutions@gmail.com",
            city: "Lahore",
            state: "Punjab",
            Resume: null,
          },
          {
            uid: 3,
            name: "Abdul Sami",
            contact: "0317-xxy-xxyy",
            email: "abdulsami.zellesolutions@gmail.com",
            city: "Lahore",
            state: "Punjab",
            Resume: null,
          },
          {
            uid: 4,
            name: "Muhammad Faraz",
            contact: "0317-yyx-yyxx",
            email: "faraz.zellesolutions@gmail.com",
            city: "Karachi",
            state: "Sindh",
            Resume: null,
          },
          {
            uid: 5,
            name: "Sajid",
            contact: "0317-xyx-yyyy",
            email: "sajid.zellesolutions@gmail.com",
            city: "karachi",
            state: "Sindh",
            Resume: null,
          },
          {
            uid: 6,
            name: "Noman",
            contact: "0317-yxy-xxxx",
            email: "noman.zellesolutions@gmail.com",
            city: "Lahore",
            state: "Punjab",
            Resume: null,
          },
          {
            uid: 7,
            name: "Faizan Shamsi",
            contact: "0317-xyx-xyxy",
            email: "faizan.zellesolutions@gmail.com",
            city: "Karachi",
            state: "Sindh",
            Resume: null,
          },
          {
            uid: 8,
            name: "Muhammad Shehroz",
            contact: "0317-yyy-xxyx",
            email: "shehroz.zellesolutions@gmail.com",
            city: "Karachi",
            state: "Sindh",
            Resume: null,
          },
        ]);
      } finally {
        setLoading(false);
      }
    }, 2000); // 2-second delay before execution
  };

  useEffect(() => {
    fetchData();
  }, []);

  const customStyles = {
    headCells: {
      style: {
        height: "52px",
        // background: '#FDFDFD',
        background: "transparent",
        opacity: "1",
        textAlign: "center",
        justifyContent: "center",
        border: "none",
        color: "var(--text-color-1)",
        fontFamily: "var(--font-family)",
        fontWeight: "var(--font-weight-medium)",
        fontSize: "var(--font-size-medium)",
        overflow: "wrap", // Prevents content overflow in headers
        textOverflow: "ellipsis",
        whiteSpace: "normal", // Allows wrapping in header cells
      },
    },
    cells: {
      style: {
        height: "51px",
        justifyContent: "center",
        textAlign: "center",
        // background: '#FFFFFF',
        // borderTop: '1px solid #F0F0F0',
        background: "transparent",
        borderTop: "var(--standered-border)",
        borderRight: "none",
        color: "var(--text-color-1)",
        fontFamily: "var(--font-family)",
        fontWeight: "var(--font-weight-regular)",
        fontSize: "var(--font-size-small)",
        whiteSpace: "normal", // Allows text to wrap in cells
        wordBreak: "break-word", // Breaks long words if necessary
        overflow: "wrap", // Prevents content overflow
        textOverflow: "ellipsis", // Shows ellipsis for long content
      },
    },
  };

  const handleSelectAll = (isSelected) => {
    setSelectedRows(isSelected ? data.map((row) => row.uid) : []);
  };

  const handleRowSelect = (rowId) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(rowId)
        ? prevSelected.filter((id) => id !== rowId)
        : [...prevSelected, rowId]
    );
  };

  const handleView = (row) => {
    console.log("View clicked for:", row);
  };

  const handleDownload = (row) => {
    console.log("Download clicked for:", row);
  };

  const columns = [
    {
      name: (
        <input
          type="checkbox"
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
      ),
      cell: (row) => (loading ? <ShimmerLoader width="20px" height="20px" /> :
        <input
          type="checkbox"
          onChange={() => handleRowSelect(row.uid)}
          checked={selectedRows.includes(row.uid)}
        />
      ),
      width: "50px",
    },
    { name: "Name", selector: (row) => (loading ? <ShimmerLoader width="110px" height="22.5px" borderRadius="20px" /> : row.name ), width: "150px" },
    { name: "Contact", selector: (row) => (loading ? <ShimmerLoader width="90px" height="22.5px" borderRadius="20px" /> : row.contact ), width: "140px" },
    { name: "Email", selector: (row) => (loading ? <ShimmerLoader width="90px" height="22.5px" borderRadius="20px" /> : row.email ), width: "250px" },
    { name: "City", selector: (row) => (loading ? <ShimmerLoader width="90px" height="22.5px" borderRadius="20px" /> : row.city ), width: "125px" },
    { name: "State", selector: (row) => (loading ? <ShimmerLoader width="90px" height="22.5px" borderRadius="20px" /> : row.state ), width: "125px" },
    {
      name: "Resume",
      cell: (row) => (loading ? <ShimmerLoader width="60px" height="22.5px" /> :
        <div className="ResumeBtn">
          <button onClick={() => handleView(row)}>View</button>
          <button onClick={() => handleDownload(row)}>Download</button>
        </div>
      ),
      width: "203px",
    },
    // Additional columns if needed
  ];

  // const handlePageChange = (page) => {
  //   setCurrentPage(page);
  // };

  // Calculate total pages
  const totalPages = Math.ceil(data.length / rowsPerPage);

  // Slice data for current page
  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Page change handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const placeholderRows = Array(7).fill({ uid: "", name: "", image: "" });

  const displayedData = loading ? placeholderRows : paginatedData;

  return (
    <div className="CareersMainPage">
      <div className="Careers-Section">
        {/* {loading ? (
          <p>Loading...</p>
        ) : ( */}
          {/* <DataTable
          //   columns={columns}
          //   data={data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)}
          //   pagination
          //   paginationComponent={() => (
          //     <CustomPagination
          //       rowsPerPage={rowsPerPage}
          //       rowCount={data.length}
          //       currentPage={currentPage}
          //       onChangePage={handlePageChange}
          //     />
          //   )}
          //   customStyles={customStyles}
          // />
        {/* )} */}
        <div>
            <DataTable
              columns={columns}
              // data={paginatedData}
              data={displayedData}
              customStyles={customStyles}
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
  );
};

export default Careers;
