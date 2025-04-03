import React, { useEffect, useState } from 'react'
import './SubCategories.css'
import CMSHead from '../../UI-Controls/CMSHead/CMSHead';
import CategoryDropdown from '../../UI-Controls/CategoryDropdown/CategoryDropdown';
import InfoPopUp from '../../InfoPopUp/InfoPopUp';
import axios from 'axios';
import { Url } from '../../../Services/Api';
import Loader from '../../UI-Controls/Loader/Loader';
import MainLoader from '../../UI-Controls/MainLoader/MainLoader';
import { useLocation } from 'react-router-dom';
import SectionLoader from '../../UI-Controls/MainLoader/SectionLoader';

export default function SubCategories({ handleOpen }) {

    const pathSegments = window.location.pathname.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];
    // All States and variables
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [combinedState, setCombinedState] = useState([])
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [infoModal, setInfoModal] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);
    const [subCategoryPayload, setSubCategoryPayload] = useState({
        "slugName": '',
        "sub_categories": [],
    });
    const [dataAvailable, setDataAvailable] = useState(false);

    const [selectCategoryData, setSelectedCategoryData] = useState([])
    const location = useLocation()
    const categoryData = location.state

    useEffect(() => {
        const fetchCategoryData = async () => {
            const api = `/api/v1/productCategory/get?parent=${categoryData?.id}`;
            try {
                const response = await axios.get(`${Url + api}`)
                setSelectedCategoryData(response.data.categories);
                console.log("sub categores data", response)
                setDataAvailable(true)
            } catch (error) {
                console.error("error fetching categories", error);
                setDataAvailable(false)
            }
        }
        fetchCategoryData()
    }, [])

    // Modal open and close functions
    const handleShowInfoModal = () => {
        setInfoModal(true)
    }
    const handleCloseInfoModal = () => {
        setInfoModal(false);
    }

    // Multi Select
    const toggleDropdown = (index) => {
        setDropdownOpen((prev) => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const [categoryUid, setCategoryUid] = useState([]);

    useEffect(() => {
        const getSelectedCategories = async () => {
            const api = `/api/v1/sub-category/get/${categoryData.slug}`
            try {
                const response = await axios.get(`${Url + api}`);
                console.log("response ", response)
                if (response.data.slugName === lastSegment) {
                    setIsEmpty(false);
                }
                if (response.status === 404) {
                    console.log("response status", response.status)

                }
                setSelectedCategories(response.data.sub_categories)
                setCombinedState(response.data)
                console.log("sub categories response", response)
            } catch (error) {
                console.log('Error geting selected categories', error);
            }
        }
        getSelectedCategories()
    }, [])

    useEffect(() => {console.log("is  Empty state", isEmpty)}, [isEmpty])

    const handleSelect = (index, category) => {

        const newCategories = selectedCategories.map((item, i) =>
            i === index ? category : item
        );
        console.log("new Categories", newCategories)
        setSelectedCategories(newCategories);

        setCategoryUid(newCategories.map((item) => item.uid));

        setDropdownOpen(false);
    };

    useEffect(() => {
        const initialUids = selectedCategories.map((cat) => cat.uid).filter(Boolean);

        setCategoryUid((prevCategoryUid) => {
            const updatedUids = new Set([...prevCategoryUid, ...initialUids]); // Merge existing and initial
            return Array.from(updatedUids);
        });
    }, [selectedCategories]);

    const addDropdown = () => {
        setSelectedCategories((prev) => [...prev, ''])
    }

    const deleteDropdown = (index, categoryId) => {

        setSelectedCategories((prev) => {
            const updatedCategories = prev.filter((_, i) => i !== index);
            return updatedCategories;
        });

        setCategoryUid((prevCategory) => {
            const updatedUids = prevCategory.filter((uid) => uid !== categoryId);
            return updatedUids;
        });
    }

    const [loading, setLoading] = useState(false);

    const updateCategoryUid = async () => {

        const updatedPayload = {
            slugName: categoryData.slug,
            sub_categories: categoryUid,
            content: combinedState?.content || '',
            content_images: combinedState?.content_images
        };

        const api = `/api/v1/sub-category/edit`
        try {
            setLoading(true);
            await axios.put(`${Url + api}`, updatedPayload)
                .then(response => {
                    handleOpen('Categories Update Successfully')
                })
                .catch(error => {
                    console.log("error category updating", error);
                    handleOpen("Error Updating Sub Categories")
                })

        } catch (error) {
            console.error("error updating categories", error);
        } finally {
            setLoading(false)
        }
    }


    const addCategoryUid = async () => {

        const updatedPayload = {
            slugName: categoryData.slug,
            sub_categories: categoryUid,
            content: 'test test',
            content_images: []
        };


        const api = `/api/v1/sub-category/add`
        try {
            setLoading(true);
            await axios.post(`${Url + api}`, updatedPayload)
                .then(response => {
                    handleOpen('Categories Added Successfully')
                })
                .catch(error => {
                    console.log("error category updating", error);
                    handleOpen("Error Adding Sub Categories")
                })
        } catch (error) {
            console.error("error updating categories", error);
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className='CategoryMainSection'>

                <CMSHead
                    heading={'Sub Category'}
                    buttonText={'Save'}
                    isButtonVissible={true}
                    // dataAvailable ? updateCategoryUid: addCategoryUid
                    sendImagesHomeSlider={!isEmpty ? updateCategoryUid : addCategoryUid}
                    handleShowInfoModal={handleShowInfoModal}
                />
                <div className='CategoryBody'>
                    {loading && <SectionLoader />}
                    <p className='category-heading'>Select Category</p>
                    <div className='category-fropdown-and-button'>
                        <CategoryDropdown
                            selectCategoryData={selectCategoryData}
                            selectedCategories={selectedCategories}
                            toggleDropdown={toggleDropdown}
                            dropdownOpen={dropdownOpen}
                            handleSelect={handleSelect}
                            deleteDropdown={deleteDropdown}
                        // selectedCategoriesFromApi={selectedCategoriesApiData}
                        />
                        <div className='add-category-btn-div'>
                            <button onClick={addDropdown}>
                                + Add
                            </button>
                        </div>
                    </div>
                </div>
                <InfoPopUp
                    showInfoModal={infoModal}
                    handleCloseInfoModal={handleCloseInfoModal}
                />
            </div>
        </>
    )
}

// export default SubCategories
