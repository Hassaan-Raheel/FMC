import React, { useState, useEffect } from 'react'
import './BestSellerSection.css'
import CMSHead from '../../UI-Controls/CMSHead/CMSHead'
import arrowDown from '../../../Assets/Images/dropdown 20 x 20.png';
import uploadImageIcon from '../../../Assets/Images/uploadImg 48 x 48.png'
import CategoryDropdown from '../../UI-Controls/CategoryDropdown/CategoryDropdown';
import ImageGalleryPopup from '../../UI-Controls/PopUp/ImageGalleryPapup/ImageGalleryPopup';
import InfoPopUp from '../../InfoPopUp/InfoPopUp';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { Url } from '../../../Services/Api';
import { uploadImage } from '../../../Services/functions';
import deleteIcon from '../../../Assets/Images/delete-red-icon.png'
import crossBtn from '../../../Assets/Images/cross-button-32-X-32.png'
import AddButton from '../../UI-Controls/AddButton/AddButton';
import { LuPlus } from 'react-icons/lu';
import SectionLoader from '../../UI-Controls/MainLoader/SectionLoader';
import { IoIosArrowDown } from "react-icons/io";    
import { FiTrash2 } from "react-icons/fi";

const BestSellerHomeSection = ({ handleOpen, galleryApi, addMediaApi, categoryApi, subCategoryApi, editBulkApi, bestSellerHeading }) => {

    // For Modal States and variables and Functions
    const [modalView, setModalView] = useState(false);
    const [mediaData, setMediaData] = useState([]);

    const [imageSendPayload, setImageSendPayload] = useState({
        file: null,
        alt_text: '',
        title: '',
        description: '',
        usedIn: [],
        link_url: '',
    });


    // get images in gallery modal
    const getApi = async () => {
        try {
            // const response = await axios.get(`${Url}/api/v1/media/pages/global/bestseller/get`);
            const response = await axios.get(`${Url}${galleryApi}`);
            setMediaData(response.data.media);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getApi();
    }, []);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        // const api = `${Url}/api/v1/media/pages/global/bestseller/add`
        const api = `${Url}${addMediaApi}`

        if (file) {
            setImageSendPayload((prevData) => ({
                ...prevData,
                file: file,
            }));
            setUploadedStates('loading');
            const imagePayloadToSend = new FormData();
            imagePayloadToSend.append('image', file);
            imagePayloadToSend.append('alt_text', imageSendPayload.alt_text);
            imagePayloadToSend.append('title', imageSendPayload.title);
            imagePayloadToSend.append('description', imageSendPayload.description);
            imagePayloadToSend.append('image_url', imageSendPayload.image_url);
            imagePayloadToSend.append('link_url', imageSendPayload.link_url);

            try {
                await uploadImage(imagePayloadToSend, api, setUploadedStates);
                setUploadedStates('success');
                getApi()
            } catch (error) {
                console.error("Image upload failed:", error);
                setUploadedStates('error');
            }

        }
    }

    // For component states and variables
    const [singleCategory, setSingleCategory] = useState()
    const [isCategoryOpen, setIsCategoryOpen] = useState(false)
    const [selectedCategories, setSelectedCategories] = useState(['']);
    const [clickType, setClickType] = useState('');
    const [selectCategoryData, setSelectedCategoryData] = useState([])

    const [showCategory, setShowCategory] = useState(null);
    // const [selectedImage, setSelectedImage] = useState([])
    const [inputTitle, setInputTitle] = useState('');
    const [combinedData, setCombinedData] = useState([]);
    const [infoModal, setInfoModal] = useState(false);
    const [uploadedStatus, setUploadedStates] = useState('');
    const [loading, setLoading] = useState(false)

    // GEt Updated Sub Categories Data To show on Ui
    useEffect(() => {
        const fetchData = async () => {
            // const api = `/api/v1/best-seller-home/get`
            try {
                const response = await axios.get(`${Url + categoryApi}`);
                const apiResponse = response.data;
                setCombinedData(apiResponse)
            } catch (error) {
                console.error("error", error)
            }
        }
        fetchData()
    }, [])


    // Modal open and close functions
    const handleShowInfoModal = () => {
        setInfoModal(true)
    }

    const handleCloseInfoModal = () => {
        setInfoModal(false);
    }

    const handleModalOpen = (type) => {
        setModalView(true)
        setClickType(type)
    }

    const handleModalClose = () => {
        setModalView(false)
    }

    // Sub Categories Main Dropdown
    const handleCategoryDropDown = (index) => {
        setShowCategory((prevIndex) => prevIndex === index ? null : index)
    }

    const handleImageSelect = (image) => {
        setCombinedData((prevState) => {
            const updatedData = [...prevState];
            updatedData[showCategory] = {
                ...updatedData[showCategory],
                image: {
                    ...updatedData[showCategory].image,
                    image_url: image.image_url,
                }
            };
            return updatedData
        });
        setModalView(false);
    };

    const handleInputChange = (e, index) => {
        const newSlugName = e.target.value;
        setInputTitle(newSlugName);

        setCombinedData((prevState) => {
            const updatedData = [...prevState]; // Create a copy of the previous state
            updatedData[index] = {
                ...updatedData[index],
                Heading: newSlugName // Set the Heading to the new value
            };
            return updatedData;
        })
    };

    // Get sub category data
    useEffect(() => {
        const fetchCategoryData = async () => {
            // const api = `/api/v1/productCategory/get?parent=0`;
            try {
                const response = await axios.get(`${Url+subCategoryApi}`)
                setSelectedCategoryData(response.data.categories);
                setSelectedCategories(response.data.categories)
                // console.log("categories fetched", response)
            } catch (error) {
                console.error("error fetching categories", error);
            }
        }
        fetchCategoryData()
    }, [])

    // Sub categories dropdown to select category
    const handleShowCategoryDropdown = () => {
        setIsCategoryOpen((prevState) => prevState === true ? false : true);
    }

    const handleCategoryData = (item, index) => {
        setSingleCategory(item);
        setIsCategoryOpen(false);

        setCombinedData((prevState) => {
            const updatedData = [...prevState];
            updatedData[index] = {
                ...updatedData[index],
                slug: item.slug,
            }
            return updatedData
        })
    };

    // useEffect(() => {

    // }, [combinedData])


    // add new category object
    const addCategory = () => {
        const newCategory = {
            Heading: "",
            image: {
                image_url: "",
            },
            slug: ''
        };

        setCombinedData((prevState) => ([
            ...prevState,
            newCategory
        ]));
    };

    const deleteCategory = (item) => {
        setCombinedData((prevState) =>
            prevState.filter((category) => category.slug !== item.slug)
        )
    }


    const deleteCategoryImage = (index) => {

        setCombinedData((prevState) => {
            const updatedData = [...prevState];
            updatedData[index] = {
                ...updatedData[index],
                image: {
                    ...updatedData[index].image,
                    image_url: ''
                }
            };
            return updatedData
        });
    }

    // Update new data into Sub Categories
    const handleSaveBestSeller = async () => {
        // const api = `/api/v1/best-seller-home/edit-bulk`
        
        try {
            setLoading(true)
            const response = await axios.put(`${Url+editBulkApi}`, combinedData)
            if(response.status === 200) {
                handleOpen("Best Seller Categories Update Successfully")
            }
          //  console.log("response best seller", response)
        } catch (error) {
            setLoading(false);
            handleOpen("error sending best seller", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <CMSHead
                heading={bestSellerHeading}
                buttonText={"Save"}
                isButtonVissible={true}
                sendImagesHomeSlider={handleSaveBestSeller}
                handleShowInfoModal={handleShowInfoModal}
            />

            <div className='best-seller-category'>
                {loading && <SectionLoader />}
                <div className='best-seller-inner-section'>
                    {combinedData && combinedData.map((item, index) => (
                        <div className='best-seller-dropdown-main'>
                            <div className='best-seller-dropdown-head-and-delete-button'>
                                <div className='best-seller-drop-down-head' onClick={() => handleCategoryDropDown(index)}>
                                    <p>{combinedData[index].Heading ?? 'Add Category'}</p>
                                    <img src={arrowDown} alt='arrow-down' />
                                </div>
                                {combinedData.length > 1 && (
                                    <button className='drop-down-delete-btn' onClick={() => deleteCategory(item)}>
                                        <FiTrash2 size={20} color='var(--delete-color)' />
                                    </button>
                                )}
                            </div>
                            <div className={`best-seller-dropdown-body ${showCategory === index ? 'show-category' : ''}`}>
                                <div className='best-seller-dropdown-containt'>
                                    {combinedData?.[index]?.image?.image_url === '' ? (
                                        <div className='best-seller-category-image-upload-div' onClick={() => handleModalOpen('category-image')}>
                                            <img src={uploadImageIcon} alt='upload' />
                                        </div>
                                    ) : (
                                        <div className='best-seller-product-main-image-container'>
                                            <button className='best-seller-img-delete-btn' onClick={() => deleteCategoryImage(index)}>
                                                <img src={crossBtn} alt='delete' />
                                            </button>
                                            <img src={`${Url+combinedData?.[index]?.image?.image_url}`} alt='text' className='best-seller-selected-image' />
                                        </div>
                                    )}

                                    <div className='best-seller-dropdown-inputs-div'>
                                        <input
                                            type='text'
                                            placeholder='Text'
                                            className='best-seller-category-title-input'
                                            value={combinedData?.[index]?.Heading}
                                            onChange={(e) => handleInputChange(e, index)} // Update title state 
                                        />
                                        <div className='category-dropdown' >
                                            <div className='category-drop-down-head' onClick={handleShowCategoryDropdown}>
                                                <p className='select-category-heading'>{combinedData?.[index]?.slug !== '' ? combinedData?.[index]?.slug : 'Select Category'}</p>
                                                <IoIosArrowDown size={15} color='#595959' />
                                            </div>
                                            <div className={`categor-drop-down-items ${isCategoryOpen ? 'show-drop-down-items' : ''}`}>
                                                {selectCategoryData.map((item, innerIndex) => (
                                                    <p key={innerIndex} onClick={() => handleCategoryData(item, index)}>
                                                        {item.name}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className='best-seller-category-btn'>
                        {/* <button onClick={addCategory}>
                            + add
                        </button> */}
                        <AddButton
                            iconShow={true}
                            handleClick={addCategory}
                            text={'Add'}
                            icon={<LuPlus color='#4487C5' size={20} />}
                        />
                    </div>
                </div>
            </div>

            <ImageGalleryPopup
                showImageGalleryPopUp={modalView}
                handleModalView={handleModalClose}
                onImageSelect={handleImageSelect}
                imageSendPayload={imageSendPayload}
                setImageSendPayload={setImageSendPayload}
                alt_text={imageSendPayload.alt_text}
                title={imageSendPayload.title}
                handleFileChange={handleFileChange}
                data={mediaData}
            />
            <InfoPopUp
                showInfoModal={infoModal}
                handleCloseInfoModal={handleCloseInfoModal}
            />
        </div>
    )
}

export default BestSellerHomeSection
