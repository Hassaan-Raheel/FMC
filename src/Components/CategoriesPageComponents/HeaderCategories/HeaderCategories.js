import React, { useEffect, useState } from 'react'
import './HeaderCategories.css'
import CMSHead from '../../UI-Controls/CMSHead/CMSHead'
import InfoPopUp from '../../InfoPopUp/InfoPopUp';
import crossBtn from '../../../Assets/Images/cross-button-32-X-32.png'
import uploadImageIcon from '../../../Assets/Images/uploadImg 48 x 48.png';
import axios from 'axios';
import { Url } from '../../../Services/Api';
import MainLoader from '../../UI-Controls/MainLoader/MainLoader';
import productSearchLoader from '../../../Assets/Images/loader-check-three.gif';
import { IoCloseOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import BottomToust from '../../BottomToust/BottomToust';

const HeaderCategories = ({ parentCategories, title }) => {
    const [infoModal, setInfoModal] = useState(false);

    const categoriesImageUploadOption = [
        { title: 'Select Product 1', icon: uploadImageIcon },
        { title: 'Select Product 2', icon: uploadImageIcon },
        { title: 'Select Product 3', icon: uploadImageIcon },
    ]

    // Modal open and close functions

    const handleShowInfoModal = () => {
        setInfoModal(true)
    }
    const handleCloseInfoModal = () => {
        setInfoModal(false);
    }

    // payload to send and store data
    const [headCategoriesPayload, setHeadCategoryPayload] = useState(
        {
            categories: []
        }
    );

    const [parentIndex, setParentIndex] = useState(null)
    const [loadSubCategories, setLoadSubCategories] = useState(false);
    const [subCategories, setSubCategories] = useState([]);
    const [isShowSubCategories, setIsShowSubCategories] = useState(null)

    // Get Head Categories from Database
    useEffect(() => {
        const fetchHeadCAtegories = async () => {
            const api = `/api/v1/header-payloads/get`
            try {
                const response = await axios.get(`${Url + api}`)
                if (response.status === 200) {
                    // console.log("Fetching Head Categories Successfully", response.data.data[0].categories)
                    // setHeadCategoryPayload(response.data.data[0].categories)
                    setHeadCategoryPayload({
                        categories: response.data.data[0].categories || []
                    });
                } else {
                    console.error(`UnExpected: Response Status ${response.status}`);
                    throw new Error('Failed to fetch categories')
                }
            } catch (error) {
                console.error("Error Fetching Had Categories", error);
                return {
                    error: true,
                    message: 'An error occurred while fetching the categories. Please try again later.'
                }
            }
        }
        fetchHeadCAtegories()
    }, [])

    const [updateProductSelectIndex, setUpdateProductSelectIndex] = useState(1)
    // Store Parent Category Function
    const [parentSlug, setParentSlug] = useState('')

    const handleParentCategorySelect = (item, index) => {

        setParentIndex((ind) => ind === index ? null : index)
        setIsShowSubCategories((ind) => ind === index ? null : index)
        setParentSlug(item.slug)

        setHeadCategoryPayload((prevCat) => {
            // Check if category exist or not
            const categoryExist = prevCat?.categories?.some(
                (cat) => cat?.category_slug === item.slug
            )

            // is yes return same category no update
            if (categoryExist) {
                return prevCat
            }

            // if no then store category on parent 
            return {
                ...prevCat,
                categories: [
                    ...prevCat?.categories.filter(
                        (cat) => cat.category_slug !== "" // Remove the initial empty object if present
                    ),
                    {
                        category: item.name,
                        category_slug: item.slug,
                        category_uid: item.uid,
                        subCategories: [],
                        products: []
                    }
                ]
            }
        })

        // Call sub categories and send parent object to find parent id
        fetchChildCategories(item)
        // console.log("head cat select", headCategoriesPayload.categories.filter((cat) => cat.category_slug === parentSlug)[0]?.products?.[0]?.name)
    }

    // Fetch Sub Categories
    const fetchChildCategories = async (item) => {
        const api = `/api/v1/productCategory/get?parent=${item.uid}`;
        try {
            setLoadSubCategories(true);
            const response = await axios.get(`${Url + api}`);
            if (response.status === 200) {
                // console.log("Child Categories Fetched Successfully", response.data.categories);
                setSubCategories(response.data.categories)
            } else {
                console.error(`Error: Unexpected response status ${response.status}`);
                throw new Error('Failed to fetch child categories');
            }
        } catch (error) {
            console.error("Error Fetching Child CAtegories", error);
            setLoadSubCategories(false);
            return {
                error: true,
                message: 'An error occurred while fetching the categories. Please try again later.'
            }
        } finally {
            setLoadSubCategories(false)

        }
    }


    // Store and remove sub cateroy from head category payload
    const handleCheckboxChange = (subcategory, subcategoryIndex) => {
        setHeadCategoryPayload((prevSubCat) => {
            // Check if subcategory already exists in any category
            const subcategoryExist = prevSubCat.categories.some(
                (cat) => cat.subCategories.some(
                    (subCat) => subCat.slug === subcategory.slug
                )
            );

            // If the subcategory exists, remove it
            if (subcategoryExist) {
                const updatedCategories = prevSubCat.categories.map((cat) => {
                    const updatedSubCategories = cat.subCategories.filter(
                        (subCat) => subCat.slug !== subcategory.slug
                    );
                    return {
                        ...cat,
                        subCategories: updatedSubCategories
                    };
                });
                return {
                    ...prevSubCat,
                    categories: updatedCategories
                };
            }

            // If the subcategory doesn't exist, update it
            const updatedCategories = prevSubCat.categories.map((cat) => {
                if (cat.category_uid === subcategory.parent) {
                    // Find the correct position of subcategory (or add it at the end)
                    const newSubCategory = {
                        name: subcategory.name,
                        slug: subcategory.slug
                    };

                    return {
                        ...cat,
                        subCategories: [...cat.subCategories, newSubCategory] // Adding the new subcategory
                    };
                }
                return cat; // No change for categories that don't match the parent
            });

            return {
                ...prevSubCat,
                categories: updatedCategories
            };
        });
    };

    // Remove Parent Category From HeadCategory Payload
    const handleParentDeselect = (slug) => {
        setHeadCategoryPayload((prevCat) => {
            const updatedCategories = prevCat.categories.filter(
                (category) => category.category_slug !== slug.slug
            )
            return {
                ...prevCat,
                categories: updatedCategories
            }
        })
    }

    const [isProductSearch, setIsProductSearch] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchedProducts, setSearchedProducts] = useState([])
    const [isSearching, setIsSearching] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedProducts, setSelectedProducts] = useState([])


    const handleProductSearchOpen = () => {
        setIsProductSearch(true)

    }
    const handleCloseProductSearch = (e) => {
        setIsProductSearch(false)
        setUpdateProductSelectIndex((prevInd) => prevInd < 3 ? prevInd + 1 : 3)
        setSearchQuery('')
        setSearchedProducts([])
    }


    const searchForProducts = async (text) => {
        const api = `/api/v1/products/by-name?name`;
        try {
            setIsSearching(true)
            setIsLoading(true);
            const response = await axios.get(`${Url + api}=${text}`)
            // console.log("searched products response ", response.data.products)
            setSearchedProducts(response.data.products)
        } catch (error) {
            console.error("error fething data", error);
            setIsLoading(false)
        } finally {
            setIsSearching(false)
            setIsLoading(false)
        }
    }


    const handleSearchInput = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (value.length > 2) {
            searchForProducts(value);
        } else {
            setSearchedProducts([]);
        }
    }

    const maxLength = 15;
    const truncateTitle = (title, maxLength) => {
        if (!title) return '';
        return title.length > maxLength ? title.slice(0, maxLength) + '...' : title
    };

    const formatePrice = (price) => {
        return new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    }


    const handleSelectSearchedProduct = (item) => {
        // console.log("selected searched product", item)

        setSelectedProducts((prevSelected) => [...prevSelected, item]);

        setHeadCategoryPayload((prevPayload) => {
            const categoryIndex = prevPayload.categories.findIndex(
                (cat) => cat.category_slug === parentSlug
            )

            if (categoryIndex === -1) {
                // If no matching category is found, log a warning and return the previous state
                console.warn("Parent category not found for product:", item);
                return prevPayload;
            }

            const updatedCategories = prevPayload.categories.map((cat, idx) =>
                idx === categoryIndex
                    ? {
                        ...cat,
                        products: cat.products.length < 3
                            ? [
                                ...cat.products,
                                {
                                    name: item.name,
                                    image: item.image.image_url,
                                    slug: item.slug,
                                    uid: item.uid,
                                    sale_price: item.sale_price,
                                    regular_price: item.regular_price
                                }
                            ]
                            : cat.products // If there are already 3 products, don't add more
                    }
                    : cat // No change for other categories
            );

            return {
                ...prevPayload,
                categories: updatedCategories,
            };
        })
        handleCloseProductSearch()
    }



    const handleDeleteProduct = (parentSlug, index) => {
       // console.log("Deleting product from category", parentSlug, "at index", index);

        setHeadCategoryPayload((prevPayload) => {
            const updatedCategories = prevPayload.categories.map((cat) => {
                // Check if the category matches the parentSlug
                if (cat.category_slug === parentSlug) {
                    // Check if the index exists in the products array
                    if (cat.products && cat.products[index]) {
                        const updatedProducts = [...cat.products];
                        updatedProducts.splice(index, 1); // Remove the product at the given index

                        return {
                            ...cat,
                            products: updatedProducts, // Update the products array
                        };
                    }
                }
                return cat; // No change for categories that don't match the parentSlug
            });

            // Return the updated payload
            return {
                ...prevPayload,
                categories: updatedCategories,
            };
        });
    };



    const [loading, setLoading] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [statusMessage, setStatusMessage] = useState(false);
    const updateHeadCategories = async () => {
        const api = `/api/v1/header-payloads/edit`;
        try {
            setLoading(true);
            const response = await axios.put(`${Url + api}`, headCategoriesPayload);
            if (response.status === 200) {
                setShowMessage(true)
                setStatusMessage("Data Update Successfully")
               // console.log("Head Categories Update Successfully", response.status);
            } else {
                console.error(`UnExpected: Response Status ${response.data}`);
                setStatusMessage("Data Update Failed")
                throw new Error('Failed to update categories')
            }
        } catch (error) {
            setLoading(false);
            console.error("Error Updating Had Categories", error);
            return {
                error: true,
                message: 'An error occurred while updating the categories. Please try again later.'
            }

        } finally {
            setLoading(false)
        }
    }

    const handleCloseMessageModal = () => {
        setShowMessage(false);
    }

    useEffect(() => {

        if (showMessage === true) {
            const timeOut = setTimeout(() => {
                setShowMessage(false);
            }, 3000);

            // Cleanup function to clear the timeout if needed
            return () => clearTimeout(timeOut);
        }
    }, [showMessage])

    // useEffect(() => {
    // }, [headCategoriesPayload, selectedProducts])


    return (
        <div className='header-categories-main-section'>
            {loading && <MainLoader />}
            <CMSHead
                heading={title}
                buttonText={'Save'}
                isButtonVissible={true}
                sendImagesHomeSlider={updateHeadCategories}
                handleShowInfoModal={handleShowInfoModal}
            />
            <div className='header-categories-body-section'>
                <div className='header-categories-items'>
                    {parentCategories && parentCategories.map((items, index) => (

                        <div
                            key={index}
                            className={`parent-single-category ${headCategoriesPayload?.categories?.some((cat) => cat?.category_slug === items.slug) ? 'select-parent' : ''}`}
                            onClick={() => handleParentCategorySelect(items, index)}
                        >
                            <button
                                className='parent-category-delete-button'
                                style={
                                    {
                                        border: `${headCategoriesPayload?.categories?.some((cat) => cat?.category_slug === items.slug) ? '1px solid transparent' : '1px solid #595959'}`,
                                        display: `${headCategoriesPayload?.categories?.some((cat) => cat?.category_slug === items.slug) ? 'flex' : 'none'}`
                                    }
                                }
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleParentDeselect(items)
                                }}
                            >
                                <IoCloseOutline
                                    size={15}
                                    color='#FFFFFF' />
                            </button>
                            <p className='parent-category-name'>{items.name}</p>
                        </div>
                    ))}

                </div>
                {
                    loadSubCategories ? (
                        <div className='head-categories-shimmer-main-container'>
                            <div className='head-category-checkboxes-container-shimmer'>
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <div className='head-category-single-category-shimmer'>
                                        <div className='head-category-checkbox-shimmer'></div>
                                        <div className='head-category-name-shimmer'></div>
                                    </div>
                                ))}
                            </div>
                            <div className='head-category-upload-image-main-container-shimmer'>
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div className='head-category-single-image-upload-image-container'>
                                        <div className='head-category-image-upload-title-shimmer'></div>
                                        <div className='head-category-image-upload-icon-shimmer'></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className={`category-nav-item-dropdown ${isShowSubCategories === parentIndex && isShowSubCategories !== null ? 'show-sub-categories' : ''}`}>
                            <div className="nav-items-section">

                                {subCategories.map((item, index) => (
                                    <div key={index} className="nav-item-li-and-checkbox">
                                        <input
                                            type="checkbox"
                                            id={`customCheckbox-${index}`}
                                            onChange={() => handleCheckboxChange(item, index)}

                                            checked={headCategoriesPayload?.categories.some((cat) =>
                                                cat.subCategories.some((subCat) => subCat.slug === item.slug)
                                            )}
                                        />
                                        <label htmlFor={`customCheckbox-${index}`}>{item.name}</label>
                                    </div>
                                ))}
                            </div>

                            <div className='nav-images-section'>
                                {categoriesImageUploadOption.map((items, index) => (
                                    headCategoriesPayload.categories.filter((cat) => cat.category_slug === parentSlug)[0]?.products.length > 0 &&
                                        headCategoriesPayload.categories.filter((cat) => cat.category_slug === parentSlug)[0]?.products?.[index]?.name !== undefined ? (
                                        <div key={index} className='header-categories-upload-image' onClick={() => handleDeleteProduct(parentSlug, index)}>
                                            <button className='delete-searched-product-btn'>
                                                <img src={crossBtn} alt='cross btn' />
                                            </button>
                                            <p>
                                                {
                                                    truncateTitle(
                                                        headCategoriesPayload?.categories
                                                            .find((cat) => cat?.category_slug === parentSlug)?.products?.[index]?.name,
                                                        maxLength
                                                    )
                                                }
                                            </p>
                                            <img src={`${Url + headCategoriesPayload?.categories?.find((cat) => cat?.category_slug === parentSlug)?.products?.[index]?.image}`} alt='upload-image' />
                                        </div>
                                    ) : (
                                        <div key={index} className='header-categories-upload-image' onClick={handleProductSearchOpen}>
                                            <p>{items.title}</p>
                                            <img src={items.icon} alt='upload-image' />
                                        </div>
                                    )
                                ))}
                            </div>

                        </div>
                    )
                }

            </div>
            <InfoPopUp
                showInfoModal={infoModal}
                handleCloseInfoModal={handleCloseInfoModal}
            />
            <div
                className={`head-product-search-modal-main-container 
                ${isProductSearch ? 'show-head-product-search-modal' : ''}`}
            >
                <div className='head-product-search-modal-inner-container'>
                    <button className='head-product-search-modal-close-btn' onClick={handleCloseProductSearch}>
                        <img src={crossBtn} alt='close modal' />
                    </button>
                    <div className='head-product-search-input-head'>
                        <div className='head-product-search-input-and-loader'>
                            <input type='search' placeholder='Search Product' value={searchQuery} onChange={handleSearchInput} className='head-product-search-input' />
                            {isLoading ? <div className='input-loader'></div> : <></>}
                        </div>
                    </div>
                    <div className='head-category-searched-products-list'>
                        {searchedProducts && searchedProducts.map((items, index) => (
                            <div className='searched-single-product' onClick={() => handleSelectSearchedProduct(items)}>
                                <img src={`${Url + items.image.image_url}`} alt='product' className='searched-product-image' />
                                <div className='searched-product-content'>
                                    <p>{truncateTitle(items.name, maxLength)}</p>
                                    <p>SKU: {items.sku}</p>
                                    {items.sale_price === '' ? <p>{formatePrice(items.regular_price)}</p> : <spn className='searched-product-prices'>
                                        <del>{formatePrice(items.regular_price)}</del>
                                        <p>{formatePrice(items.sale_price)}</p>
                                    </spn>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <BottomToust 
                showMessage={showMessage}
                message={statusMessage}
                handleCloseMessageModal={handleCloseMessageModal}
            />
        </div >
    )
}

export default HeaderCategories
