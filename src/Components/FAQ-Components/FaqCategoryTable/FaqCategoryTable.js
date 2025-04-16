import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import Pagination from '../../UI-Controls/Pagination/PaginationRashid'
import ShimmerLoader from '../../UI-Controls/Loader/ShimmerLoader';
import actionIcon from '../../../Assets/Images/ActionBtn 30 x 30.png'
import { formatDate } from '../../UI-Controls/DateFormat/DateFormat1';
import editIcon from '../../../Assets/Images/edit.png'
import deleteIcon from '../../../Assets/Images/delete-black.png';
import { useNavigate } from 'react-router-dom';
import documentIcon from '../../../Assets/Images/document.png'
import eyeIcon from '../../../Assets/Images/eye-black.png'
import axios from 'axios';
import { Url } from '../../../Services/Api';

const FaqCategoryTable = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [showAction, setShowAction] = useState(false)
    const [data, setData] = useState([]);
    const [categories, setCategories] = useState()
    const [currentPage, setCurrentPage] = useState(1);
    const [currentId, setCurrentId] = useState(null)
      const [navSlug, setNAvSlug] = useState()
      const [selectedCategoryData, setSelectedCategoryData] = useState()
    const rowsPerPage = 6;

    const handleShowAction = (slug, row, id) => {
        
        setShowAction((prev) => (prev === id ? null : id));
        setCurrentId(id);
        setNAvSlug(slug)
        setSelectedCategoryData(row)
    }

    const handleQuickEdit = () => {
        // setShowQuickEdit(true)
    }


    // category api response
    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            setTimeout(async () => {
                const api = `/api/v1/productCategory/get?excludeParentZero=1`;
                try {
                    const response = await axios.get(`${Url + api}`);
                    setCategories(response.data.categories);
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

        }))

        setData(tempData); // Use static data directly
    }, [categories]);

    const redirectToEditFullSection = () => {
        navigate(`/Pages/faq-edit`, { state: selectedCategoryData })
    }
    const actionStates = [
        { name: 'Edit', icon: editIcon, Link: '#', onclick: redirectToEditFullSection },
        { name: 'Quick Edit', icon: editIcon, Link: '#', onclick: handleQuickEdit },
        { name: 'Delete', icon: deleteIcon, Link: '#' },
        { name: 'View', icon: eyeIcon, Link: '#' },
        { name: 'Duplicate', icon: documentIcon, Link: '#' },
    ]

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


    const totalPages = Math.ceil(data?.length / rowsPerPage);

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
            <div className="sectionall_3">
                <div>
                    <DataTable
                        columns={columns}
                        // data={paginatedData}
                        data={displayedData}
                        // data={data}
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
    )
}

export default FaqCategoryTable