import React, { useEffect, useState } from 'react'
import './ActiveSaleCategory.css'
import InfoPopUp from '../../InfoPopUp/InfoPopUp';
import axios from 'axios';
import { parentUid, Url } from '../../../Services/Api';
import { useActiveSale } from '../../../Context/active-sale-context/ActiveSaleContext';
import arrowDown from '../../../Assets/Images/dropdown 20 x 20.png'
import CMSHead from '../../UI-Controls/CMSHead/CMSHead';

const ActiveSaleCategory = () => {
    // All States and variables
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categoryOpen, setCategoryOpen] = useState(false)
    const [infoModal, setInfoModal] = useState(false);
    const { activeSalePayload, setActiveSalePayload } = useActiveSale()
    const [categoryUid, setCategoryUid] = useState([]);

    const [selectCategoryData, setSelectedCategoryData] = useState([])
    const [selectedCategoryName, setSelectedCategoryName] = useState()

    // Parent Category Get
    useEffect(() => {
        const fetchCategoryData = async () => {
            const api = `/api/v1/productCategory/get?parent=${parentUid}`;
            try {
                const response = await axios.get(`${Url + api}`)
                setSelectedCategoryData(response.data.categories)
                const categoryObj = response.data.categories.filter((cat) => cat?.uid === activeSalePayload.subCategory)
                setSelectedCategoryName(categoryObj[0]?.name)
            } catch (error) {
                console.error("error fetching categories", error);
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

    const handleCategoryDropdown = () => {
        setCategoryOpen(!categoryOpen);
    }

    const handleCategoryData = (item) => {
        setActiveSalePayload((prevState) => {
            const updatedPayload = {
                ...prevState,
                subCategory: item.uid,
            };
            return updatedPayload
        })
        setCategoryOpen(false)
    }

    useEffect(() => {
        const categoryObj = selectCategoryData.filter((cat) => cat?.uid === activeSalePayload.subCategory)
        setSelectedCategoryName(categoryObj[0]?.name)
    }, [activeSalePayload])

    useEffect(() => {
        const getSelectedCategories = async () => {
            const api = `/api/v1/content1/get`
            try {
                const response = await axios.get(`${Url + api}`);
                setSelectedCategories(response.data.landingPageContent.sectional_schema.shop_by_category)
            } catch (error) {
                console.log('Error geting selected categories', error);
            }
        }
        getSelectedCategories()
    }, [])

    useEffect(() => {
        const initialUids = selectedCategories.map((cat) => cat.uid).filter(Boolean);

        setCategoryUid((prevCategoryUid) => {
            const updatedUids = new Set([...prevCategoryUid, ...initialUids]); // Merge existing and initial
            return Array.from(updatedUids);
        });
    }, [selectedCategories]);

    return (
        <>
            <div className='CategoryMainSection'>
                <CMSHead
                    heading={'Sale Category'}
                    showIcons={false}
                    isButtonVissible={false}
                    handleShowInfoModal={handleShowInfoModal}
                />

                <div className='CategoryBody'>
                    <p className='category-heading'>Select Category</p>
                    <div className='category-fropdown-and-button'>
                        <div className='category-dropdown'>
                            <div className='category-drop-down-head' onClick={handleCategoryDropdown}>
                                <p className='select-category-heading'>{activeSalePayload?.subCategory !== 0 && selectedCategoryName !== undefined ? selectedCategoryName : 'Select Category'}</p>
                                <img src={arrowDown} alt='arrow down' />
                            </div>
                            <div className={`categor-drop-down-items ${categoryOpen ? 'show-drop-down-items' : ''}`}>
                                {selectCategoryData.map((item, index) => (
                                    <p key={index} onClick={() => handleCategoryData(item)}>
                                        {item.name}
                                    </p>
                                ))}
                            </div>
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

export default ActiveSaleCategory
