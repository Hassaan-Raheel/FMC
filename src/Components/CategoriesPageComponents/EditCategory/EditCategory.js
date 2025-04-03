import React from 'react';
import '../../../Pages/ECommerce/ECommerce.css';
// import '../../../Page.css';
import './EditCategory.css';
import 'react-accessible-accordion/dist/fancy-example.css'; // Default styles
import DataTable from 'react-data-table-component';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import actionIcon from '../../../Assets/Images/ActionBtn 30 x 30.png'
import editIcon from '../../../Assets/Images/edit.png'
import deleteIcon from '../../../Assets/Images/delete-black.png';
import documentIcon from '../../../Assets/Images/document.png'
import eyeIcon from '../../../Assets/Images/eye-black.png'
import crossBtn from '../../../Assets/Images/cross-button-32-X-32.png'
import arrowDown from '../../../Assets/Images/dropdown 20 x 20.png'
import axios from 'axios';
import { Url } from '../../../Services/Api';
// import MainLoader from '../../UI-Controls/MainLoader/MainLoader';
import ShimmerLoader from '../../UI-Controls/Loader/ShimmerLoader';
import Pagination from '../../UI-Controls/Pagination/PaginationRashid';
import { formatDate } from "../../UI-Controls/DateFormat/DateFormat1";

const EditCategory = () => {
  const navigate = useNavigate();
  const location = useLocation()
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAction, setShowAction] = useState(false)
  const [currentId, setCurrentId] = useState(null)
  const [showQuickEdit, setShowQuickEdit] = useState(false)
  const [quickParentDropdown, setQuickParentDropdown] = useState(false)
  const [quickAuthorDropdown, setQuickAuthorDropdown] = useState(false)
  const [quickStatusDropdown, setQuickStatusDropdown] = useState(false)
  const [navSlug, setNAvSlug] = useState()
  const [selectedCategoryData, setSelectedCategoryData] = useState()
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  // navigate()
  const currentLocation = location.pathname

  const handleShowAction = (slug, row, id) => {
    setShowAction((prev) => (prev === id ? null : id));
    setCurrentId(id);
    // const linkSlug = title.toLowerCase().replace(/\s+/g, '-');
    // console.log("row Data", slug)
    // console.log("row Data", row)
    setNAvSlug(slug)
    setSelectedCategoryData(row)
    // console.log("row Data", selectedCategoryData)
  }

  const redirectToEditFullSection = () => {
    navigate(`/Pages/Categories/${navSlug}`, { state: selectedCategoryData })
    // console.log("navigate", selectedCategoryData)
  }


  const handleQuickEdit = () => {
    setShowQuickEdit(true)
    //  console.log(showQuickEdit)
    // console.log("clicked")
  }

  const handleQuickEditClose = () => {
    setShowQuickEdit(false)
    // console.log("quick edit show", showQuickEdit)
  }

  const handleParentCategoryDropdown = () => {
    setQuickParentDropdown(!quickParentDropdown)
  }

  const handleAuthorDropdown = () => {
    setQuickAuthorDropdown(!quickAuthorDropdown)
  }

  const handleStatusDropdown = () => {
    setQuickStatusDropdown(!quickStatusDropdown)
  }

  const actionStates = [
    { name: 'Edit', icon: editIcon, Link: '#', onclick: redirectToEditFullSection },
    { name: 'Quick Edit', icon: editIcon, Link: '#', onclick: handleQuickEdit },
    { name: 'Delete', icon: deleteIcon, Link: '#' },
    { name: 'View', icon: eyeIcon, Link: '#' },
    { name: 'Duplicate', icon: documentIcon, Link: '#' },
  ]

  // all states to hold data from backend
  const [categories, setCategories] = useState()

  // category api response
  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     const api = `/api/v1/productCategory/get?parent=0`
  //     try {
  //       const response = await axios.get(`${Url+api}`);
  //       setCategories(response.data.categories)
  //     } catch (error) {
  //       console.error("error geting categories", error);
  //     }
  //   }
  //   fetchCategories()
  // }, [])

  // category api response
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setTimeout(async () => {
        const api = `/api/v1/productCategory/get?parent=0`;
        try {
          const response = await axios.get(`${Url + api}`);
          setCategories(response.data.categories);
          // console.log("categories response", response.data.categories);
        } catch (error) {
          console.error("Error getting categories", error);
        } finally {
          setLoading(false);
        }
      }, 2000); // 2-second delay before execution
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    // Set static data instead of fetching from API
    const tempData = categories?.map((item, index) => ({
      id: item.uid,
      title: item.name,
      slug: item.slug,
      date: item.createdAt,
      // date: new Date(item.createdAt).toLocaleDateString('en-US', {
      //   year: 'numeric',
      //   month: 'short',
      //   day: 'numeric',
      // }),
    }))
    // const staticData = [
    //   {
    //     id: 1,
    //     title: 'Living Room',
    //     author: 'Rashid.Zelle-Solutions',
    //     date: 'Published 10/10/2024 at 1: 36 PM',
    //   },
    //   {
    //     id: 2,
    //     title: 'Living Room',
    //     author: 'Rashid.Zelle-Solutions',
    //     date: 'Published 10/10/2024 at 1: 36 PM',
    //   },
    //   {
    //     id: 3,
    //     title: 'Living Room',
    //     author: 'Rashid.Zelle-Solutions',
    //     date: 'Published 10/10/2024 at 1: 36 PM',
    //   },
    //   {
    //     id: 4,
    //     title: 'Living Room',
    //     author: 'Rashid.Zelle-Solutions',
    //     date: 'Published 10/10/2024 at 1: 36 PM',
    //   },
    //   {
    //     id: 5,
    //     title: 'Living Room',
    //     author: 'Rashid.Zelle-Solutions',
    //     date: 'Published 10/10/2024 at 1: 36 PM',
    //   },
    //   {
    //     id: 6,
    //     title: 'Living Room',
    //     author: 'Rashid.Zelle-Solutions',
    //     date: 'Published 10/10/2024 at 1: 36 PM',
    //   },
    //   {
    //     id: 7,
    //     title: 'Living Room',
    //     author: 'Rashid.Zelle-Solutions',
    //     date: 'Published 10/10/2024 at 1: 36 PM',
    //   },
    //   {
    //     id: 8,
    //     title: 'Living Room',
    //     author: 'Rashid.Zelle-Solutions',
    //     date: 'Published 10/10/2024 at 1: 36 PM',
    //   },
    //   {
    //     id: 9,
    //     title: 'Living Room',
    //     author: 'Rashid.Zelle-Solutions',
    //     date: 'Published 10/10/2024 at 1: 36 PM',
    //   },
    //   {
    //     id: 10,
    //     title: 'Living Room',
    //     author: 'Rashid.Zelle-Solutions',
    //     date: 'Published 10/10/2024 at 1: 36 PM',
    //   },
    // ];

    setData(tempData); // Use static data directly
  }, [categories]);

  const customStyles = {
    headCells: {
      style: {
        height: '52px',
        // background: '#FDFDFD',
        background: 'transparent',
        opacity: '1',
        textAlign: 'center',
        justifyContent: 'center',
        border: 'none',
        color: 'var(--text-color-1)',
        fontFamily: 'var(--font-family)',
        fontWeight: 'var(--font-weight-medium)',
        fontSize: 'var(--font-size-medium)',
        padding: '10px',
      },
    },
    cells: {
      style: {
        height: '66px',
        justifyContent: 'center',
        textAlign: 'center',
        // background: '#FFFFFF',
        background: 'transparent',
        borderTop: 'var(--standered-border)',
        // borderTop: '1px solid #F0F0F0',
        borderRight: 'none',
        color: 'var(--text-color-1)',
        fontFamily: 'var(--font-family)',
        fontWeight: 'var(--font-weight-regular)',
        fontSize: 'var(--font-size-small)',
      },
    },
  };

  const columns = [
    {
      name: (
        <input
          type="checkbox"
          style={{ margin: 0 }}
          onChange={(e) => console.log('All selected:', e.target.checked)}
        />
      ),
      cell: (row) => (loading ? <ShimmerLoader width="20px" height="20px" /> :
        <input
          type="checkbox"
          style={{ margin: 0 }}
          onChange={(e) => console.log('Selected:', row, e.target.checked)}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: 'Title',
      selector: (row) => (loading ? <ShimmerLoader width="180px" height="22.5px" borderRadius='20px' /> : row.title),
    },
    {
      name: 'Slug',
      selector: (row) => (loading ? <ShimmerLoader width="150px" height="22.5px" borderRadius='20px' /> : row.slug),
    },
    // {
    //   name: 'Date',
    //   selector: (row) => (loading ? <ShimmerLoader width="120px" height="22.5px" borderRadius='20px' /> : row.date ),
    // },
    {
      name: "Date",
      selector: (row) => {
        if (loading) {
          return <ShimmerLoader width="120px" height="22.5px" borderRadius="20px" />;
        }

        // Get formatted date using the formatDate function
        const { hoursAgo, showYesterday, formattedDate } = formatDate(row.date);

        // Render the formatted date or "Yesterday" depending on the time difference
        if (showYesterday) {
          return "Yesterday";
        } else if (hoursAgo) {
          return hoursAgo;
        } else if (formattedDate) {
          return formattedDate;
        } else {
          return new Date(row.date).toLocaleDateString(); // Fallback if the function doesn't provide a result
        }
      },
      width: "150px",
    },
    {
      name: 'Action',
      cell: (row) => (loading ? <ShimmerLoader width="60px" height="22.5px" /> :
        <div className='action-bar-main-section'>
          <img
            src={actionIcon}
            alt="Action Icon"
            width="30"
            height="30"
            style={{ cursor: 'pointer' }}
            onClick={() => handleShowAction(row.slug, row, row.id)}
          />
          <div className={`action-select ${showAction === row.id ? 'show-action' : ''}`}>
            {actionStates.map((items, index) => (
              <div

                key={index}
                className='action-single-action-spacify'
                onClick={items.onclick}
              >
                <img src={items.icon} alt='edit' />
                <p>{items.name}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  // const handlePageChange = (page) => {
  //   setCurrentPage(page);
  // };

  // Calculate total pages
  const totalPages = Math.ceil(data?.length / rowsPerPage);

  // Slice data for current page
  const paginatedData = data?.slice(
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
    <div className="AllProductCatPage">
      {/* {loading && <MainLoader />} */}
      <div className="sectionall_3">
        {/* <DataTable columns={columns} data={data} progressPending={loading} customStyles={customStyles} /> */}
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
      <div className={`quick-edit-modal-main-div ${showQuickEdit ? 'show-quick-edit-modal' : ''}`}>
        <div className='quick-view-inner-section'>
          <div className='quick-edit-head'>
            <h3>Quick Edit</h3>
            <button className='quick-edit-close-btn'>
              <img src={crossBtn} alt='cross-btn' onClick={handleQuickEditClose} />
            </button>
          </div>
          <div className='quick-edit-body'>
            <div className='quick-input-inputs'>
              <div className='quick-edit-title-and-input'>
                <p>Title</p>
                <input type='text' placeholder='Dining Room' />
              </div>
              <div className='quick-edit-title-and-input'>
                <p>Slug</p>
                <input type='text' placeholder='dining-room' />
              </div>
              <div className='quick-edit-title-and-input'>
                <p>Parent Category</p>
                <div className='quick-view-select'>
                  <div className='quick-view-select-click' onClick={handleParentCategoryDropdown}>
                    <p>Select Parent</p>
                    <img src={arrowDown} alt='arrow-down' />
                  </div>
                  <div className={`quick-view-select-click-dropdown ${quickParentDropdown ? 'show-quick-view-select-click-dropdown' : ''}`}>
                    <div className='quick-view-dropdown-inner'>
                      <p>Living Room</p>
                      <p>Dining Room</p>
                      <p>Bedroom</p>
                      <p>Kids Room</p>
                      <p>Small Spaces</p>
                      <p>Rugs</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='quick-edit-title-and-input'>
                <p>Author</p>
                <div className='quick-view-select'>
                  <div className='quick-view-select-click' onClick={handleAuthorDropdown}>
                    <p>Author</p>
                    <img src={arrowDown} alt='arrow-down' />
                  </div>
                  <div className={`quick-view-select-click-dropdown ${quickAuthorDropdown ? 'show-quick-view-select-click-dropdown' : ''}`}>
                    <div className='quick-view-dropdown-inner'>
                      <p>Osama.admin</p>
                      <p>Noman.Zelle</p>
                      <p>Muzafar Shah</p>
                      <p>Rashid.Zelle</p>
                      <p>Abdul Sami.Zelle</p>
                      <p>M.Faraz.Zelle</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='quick-edit-title-and-input'>
                <p>Status</p>
                <div className='quick-view-select'>
                  <div className='quick-view-select-click' onClick={handleStatusDropdown}>
                    <p>Status</p>
                    <img src={arrowDown} alt='arrow-down' />
                  </div>
                  <div className={`quick-view-select-click-dropdown ${quickStatusDropdown ? 'show-quick-view-select-click-dropdown' : ''}`}>
                    <div className='quick-view-dropdown-inner'>
                      <p>Osama.admin</p>
                      <p>Noman.Zelle</p>
                      <p>Muzafar Shah</p>
                      <p>Rashid.Zelle</p>
                      <p>Abdul Sami.Zelle</p>
                      <p>M.Faraz.Zelle</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='quick-edit-button'>
              <button>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCategory;