import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ECommerce.css";
import "../Page.css";
import { Url } from "../../Services/Api";
import AccordionItem from "../../Components/UI-Controls/Accordian/Accordian"; /* --- Used for Right Side Handling --- */
import AttributeAccordion from "../../Components/UI-Controls/Accordian/AttributeAccordion";
import { IoImageOutline } from "react-icons/io5";
import uploadIcon from "../../Assets/Images/UploadImg 24 x 24.png";
import CustomBtn from "../../Components/UI-Controls/Buttons/Btn";
import { PiNotePencil } from "react-icons/pi";
import imageStatus from "../../../src/Assets/Images/StatusImg 20 x 20.png";
import imageVisibility from "../../../src/Assets/Images/Visibility 20 x 20.png";
import imagePublish from "../../../src/Assets/Images/Publish 20 x 20.png";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import Logo from "../../../src/Assets/Images/Logo 29.44 X 5.12.png";
import Selector from "../../../src/Assets/Images/Selector 20 X 20.png";
import Dropdownresize from "../../Components/UI-Controls/Dropdown/dropdownadd";
import Dropdowncustom from "../../Components/UI-Controls/Dropdown/dropdownaddgeneral1";
import SearchInput from "../../Components/UI-Controls/InputSearch/InputSearch";
import SearchMultiple from "../../Components/UI-Controls/MultiSelect/Multiselect";
import VariationForm from "../../Components/UI-Controls/AttributesVariation/VariationForm";
import SwatchAccordion from "../../Components/UI-Controls/Accordian/SwatchAccordion";
import DropdownSwatch from "../../Components/UI-Controls/Dropdown/SwatchDropdown";
import { useSwatchContext } from "../../Context/ComponentContext/SwatchContext";
import { useVariationContext } from "../../Context/ComponentContext/VariationContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MainLoader from "../../Components/UI-Controls/MainLoader/MainLoader";
import JoditEditor from "jodit-react";
import "../../../src/JoditEditorStyle.css";
import { uploadImage } from "../../Services/functions";
import QuestionMarkCircle from '../../Components/UI-Controls/QuesitionMark/QuestionMark';
import AttributeSearch from "../../Components/UI-Controls/MultiSelect/AttributeSelect";
import VariationAccordion from "../../Components/UI-Controls/Accordian/VariationAccordion";
import ImageGalleryPopup from '../../Components/UI-Controls/PopUp/ImageGalleryPapup/ImageGalleryPopup';
import InputField from "../../Components/UI-Controls/InputField/InputField";
import BottomToust from "../../Components/BottomToust/BottomToust";
import featuresData from "../../Assets/Json/features_data.json";


const AddProduct = () => {

  // const baseURL = "https://www.myfurnituremecca.com/product/";
  const baseURL = "https://furnituremecca.zellesolutions.com/";
  const webURL = "https://myfurnituremecca.zellesolutions.com/";

  /* Variation Context */
  const {
    accordionsData,
    setAccordionsData,
    activeIndex,
    setActiveIndex,
    setImgSrc,
    activeIndexOpt,
    setActiveIndexOpt,
  } = useSwatchContext();

  const { id } = useParams();

  /* --- Data Get for Edit - View Purpose --- */
  const location = useLocation();
  const { productData, viewData } = location.state || {};
  const { variationData, setVariationData } = useVariationContext();
  
  /* State Management */
  const [productimage, setProductImage] = useState(null);
  const [dimensionalimage, setDimensionalImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [swatchimage, setSwatchImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [accordionsOpen, setAccordionsOpen] = useState({});
  const [selectedView, setSelectedView] = useState("Mobile");
  const [isMobileAnimating, setIsMobileAnimating] = useState(false);
  const [isWebAnimating, setIsWebAnimating] = useState(false);
  const [selectedItem, setSelectedItem] = useState("general");
  const [selectedProductType, setSelectedProductType] = useState("simple");
  const [selectedTaxStatus, setSelectedTaxStatus] = useState("");
  const [selectedSale, setSelectedSale] = useState("");
  const [selectedTaxClass, setSelectedTaxClass] = useState("");
  const [selectedShippingClass, setSelectedShippingClass] = useState("");
  const [selectedLocations, setSelectedLocations] = useState("");
  const [isStockManagementChecked, setIsStockManagementChecked] =
    useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedProductTags, setSelectedProductTags] = useState([]);
  const [selectedSaleTags, setSelectedSaleTags] = useState([]);
  const [tagselect, setTagSelect] = useState([]);
  const [productTagSelect, setProductTagSelect] = useState([]);
  const [saleTagSelect, setSaleTagSelect] = useState([]);
  const [selectedTagType, setSelectedTagType] = useState(null);
  const [selectedProductTagType, setSelectedProductTagType] = useState(null);
  const [selectedSaleTagType, setSelectedSaleTagType] = useState(null);
  const [variations, setVariations] = useState([]);
  const [selectedAttributeType, setSelectedAttributeType] = useState("default");
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedProductNames, setSelectedProductNames] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedProductNames, setRelatedProductNames] = useState([]);
  const [needProducts, setNeedProducts] = useState([]);
  const [needProductNames, setNeedProductNames] = useState([]);
  const [attributes, setGetAttributes] = useState([]);
  const [tags, setGetTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    permalink: "",
    type: "simple",
    status: "",
    featured: 0,
    description: "",
    weight_dimension: "",
    short_description: "",
    sku: "",
    regular_price: "",
    discount: {
      is_discountable: 0,
      discount_type: "",
      discount_value: "",
    },
    tax_status: "",
    tax_class: "",
    brand: "",
    manage_stock: {
      is_stock_manage: 0,
      location: "All Locations",
      quantity: "",
      stock_status: "",
    },
    sold_individually: 0,
    shipping_required: 0,
    shipping_taxable: 0,
    allow_back_order: 0,
    product_features: [],
    collection: [],
    related_product: [],
    may_also_need: [],
    attributes: [],
    default_attributes: [],
    purchase_note: "",
    menu_order: 1,
    enable_review: 1,
    categories: [],
    starredCategory: null,
    tags: tagselect,
    product_tag: productTagSelect,
    sale_tag: saleTagSelect,
    image: productimage,
    images: galleryImages,
    dimension_image: dimensionalimage,
    deal_of_month: 0,
    best_selling_product: 0,
    gtin: "",
    mpn: "",
    ean: "",
    variations: variationData,
  });
  const [defaultVariation, setDefaultVariation] = useState('');
  const [modalView, setModalView] = useState(false);
  const [data, setData] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState([]);
  const [uploadedStatus, setUploadedStates] = useState(null);
  const [imageType, setImageType] = useState("");
  const [imageSendPayload, setImageSendPayload] = useState({
    file: null,
    alt_text: "",
    title: "",
    description: "",
    link_url: "",
  });
  const [imageGalleryPopup, setImageGalleryPopup] = useState(false);
  const [singleImage, setSingleImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [defaultVariationIndex, setDefaultVariationIndex] = useState(null);
  const [isEdit, setIsEdit] = useState([]);
  const [isEditID, setIsEditID] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Visual"); /* Default tab */
  const [selectedDimensionTab, setSelectedDimensionTab] = useState("Visual"); /* Default tab */
  const [productStatus, setProductStatus] = useState("Select Product");
  const [productVisibility, setProductVisibility] = useState("Select Product");
  const [productPublishedStatus, setPublishedStatus] = useState("Select Product");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); /* For handling of Attribute Terms Selection Row */
  const [isViewMode, setIsViewMode] = useState(false); 
  const [isViewID, setIsViewID] = useState(null);
  const [isClicked, setIsClicked] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [hasSelectedAttributes, setHasSelectedAttributes] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);
  const [isSwatchBtn, setIsSwatchBtn] = useState(false);
  const [isVariationBtn, setIsVariationBtn] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(0); // Default to index 0
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [getFeatures, setGetFeatures] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [hasSelectedFeatures, setHasSelectedFeatures] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const rowRef = useRef(null);
    
  /* const isUpdating = useRef(false);*/
  const editor = useRef(null); // Reference for JoditEditor
  const collectionsList = ["Collection 1", "Collection 2", "Collection 3"];
  const navigate = useNavigate();

  const handleCloseMessageModal = () => {
    setShowMessage(false);
  };

  useEffect(() => {
    if (showMessage === true) {
      const timeOut = setTimeout(() => {
        setShowMessage(false);
      }, 3000);

      return () => clearTimeout(timeOut);
    }
  }, [showMessage]);

  /* const [accordionsData, setAccordionsData] = useState([]);
  const [attributeswatch, setAttributeSwatch] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [additionalImage, setAdditionalImage] = useState(null);
  const [selectedVariableTax, setSelectedVariableTax] = useState("");
  const [selectedVariableTaxClass, setSelectedVariableTaxClass] = useState("");*/

  /* --- Jodit Editor Handling --- */
  
  const handleEditorChange = (newContent) => {
    setFormData((prevState) => ({
      ...prevState,
      description: newContent,
    }));
  };

  const handleWeightDimensionChange = (newContent) => {
    setFormData((prevState) => ({
      ...prevState,
      weight_dimension: newContent,
    }));
  };

  useEffect(() => {
    if (featuresData && Array.isArray(featuresData) && featuresData.length > 0) {
      //console.log("Updating getFeatures:", featuresData);
      setGetFeatures(featuresData);
    }
  }, [featuresData]);      

  //console.log("Features Data:", getFeatures);

  // useEffect(() => {
  //   const currentPath = location.pathname; // Get the current URL path

  //   if (productData && currentPath.includes("Edit")) {
  //     console.log("The Data for Edit:", productData);
  //     handleEditOperation(productData);
  //     setIsEditMode(true);
  //     setIsViewMode(false); // Disable view mode in edit operation
  //   } else if (viewData && currentPath.includes("View")) {
  //     console.log("The Data for View:", viewData);
  //     handleViewOperation(viewData);
  //     setIsViewMode(true); // Enable view mode for view operation
  //     setIsEditMode(false);
  //   } else {
  //     console.log("Resetting Form");
  //     resetForm();
  //     setIsViewMode(false); // Default to non-view mode
  //     setIsEditMode(false);
  //   }
  // }, [productData, viewData, location.pathname]);

  //   // Logic to determine the status, visibility, and published date
  // let productstatus = 'Select Product...';
  // setProductStatus(productstatus);
  // let productvisibility = 'Select Product...';
  // setProductVisibility(productvisibility);
  // let productPublishedStatus = 'Select Product...';
  // setPublishedStatus(productPublishedStatus);

  // if (isViewMode && viewData) {
  //   // View Mode Logic
  //   productstatus = viewData.status;
  //   setProductStatus(productstatus);
  //   productvisibility = viewData.status === 'Draft' ? 'Private' : 'Public';
  //   setProductVisibility(productvisibility);
  //   productPublishedStatus = viewData.status === 'Draft' ? 'Not Published Yet' : viewData.updated_at;
  //   setPublishedStatus(productPublishedStatus);
  // } else if (isEditMode && productData) {
  //   // Edit Mode Logic
  //   productstatus = productData.status;
  //   setProductStatus(productstatus);
  //   productvisibility = productData.status === 'Draft' ? 'Private' : 'Public';
  //   setProductVisibility(productvisibility);
  //   productPublishedStatus = productData.status === 'Draft' ? 'Not Published Yet' : productData.updated_at;
  //   setPublishedStatus(productPublishedStatus);
  // }

  // Helper function to capitalize the first letter of a string
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not Published Yet";
    return new Date(dateString).toLocaleDateString();
  };

  useEffect(() => {
    // Default values
    let status = "Select Product...";
    let visibility = "Select Product...";
    let publishedDate = "Select Product...";

    const currentPath = location.pathname; // Get the current URL path

    if (productData && currentPath.includes("Edit")) {
      
      console.log("The Data for Edit:", productData);
      status = capitalizeFirstLetter(productData.status || status);
      visibility = productData.status === "draft" ? "Private" : "Public";
      publishedDate = productData.status === "draft" ? "Not Published Yet" : formatDate(productData.updatedAt);

      handleEditOperation(productData);
      setIsEditMode(true);
      setIsViewMode(false);
    } else if (viewData && currentPath.includes("View")) {
      // View Mode Logic
      console.log("The Data for View:", viewData);
      status = capitalizeFirstLetter(viewData.status || status);
      visibility = viewData.status === "draft" ? "Private" : "Public";
      publishedDate = viewData.status === "draft" ? "Not Published Yet" : formatDate(viewData.updatedAt);

      handleViewOperation(viewData);
      setIsViewMode(true);
      setIsEditMode(false);
    } else {
      // Add Mode Logic (Default)
      //console.log("Resetting Form");
      resetForm();
      setIsViewMode(false);
      setIsEditMode(false);
    }

    // Set state for all modes
    setProductStatus(status);
    setProductVisibility(visibility);
    setPublishedStatus(publishedDate);
  }, [productData, viewData, location.pathname]);

  /* --- Edit Hook --- */
  // useEffect(() => {
  //   if (productData) {
  //     console.log("The Data for Edit:", productData);
  //     handleEditOperation(productData);
  //   } else {
  //     console.log("The Data for Edit on Reset:", productData);
  //     resetForm();
  //   }
  // }, [productData]);

  /* --- View Hook --- */
  // useEffect(() => {
  //   if (viewData) {
  //     handleViewOperation(viewData);
  //     setIsViewMode(true); // Enable view mode when viewData is present
  //   } else {
  //     resetForm();
  //     setIsViewMode(false); // Disable view mode when no viewData
  //   }
  // }, [viewData]);

  /* --- Reset Form Function --- */
  const resetForm = () => {
    setIsEdit(false); // Ensure it is not in edit mode
    setIsEditID(null);
    setSelectedProductType("simple");
    setProductImage(null);
    setDimensionalImage(null);
    setGalleryImages([]);
    setIsStockManagementChecked("0");
    setSelectedProducts([]);
    setRelatedProducts([]);
    setNeedProducts([]);
    setSelectedProductNames([]);
    setRelatedProductNames([]);
    setNeedProductNames([]);
    setSelectedAttributes([]);
    setSelectedFeatures([]);
    setAccordionsData([]);
    setSelectedTags([]);
    setSelectedProductTags([]);
    setSelectedSaleTags([]);
    setSelectedTagType(null);
    setSelectedProductTagType(null);
    setSelectedSaleTagType(null);
    setVariations([]);
    setFormData({
      name: "",
      slug: "",
      permalink: "",
      type: "simple",
      status: "draft",
      featured: 0,
      description: "",
      weight_dimension: "",
      short_description: "",
      sku: "",
      regular_price: "",
      discount: {
        is_discountable: false,
        discount_type: "",
        discount_value: "",
      },
      deal_of_month: 0,
      best_selling_product: 0,
      categories: [],
      attributes: [],
      gtin: "",
      mpn: "",
      ean: "",
      brand: "",
      tags: [],
      tax_class: "",
      tax_status: "",
      sold_individually: false,
      manage_stock: {
        is_stock_manage: "0",
        location: "All Locations",
        quantity: 0,
        stock_status: "in_stock",
      },
    });
  };

  /* --- Edit Function --- */
  const handleEditOperation = async (productData) => {
    //console.log("initial product data", productData)
    try {
      // Set edit state
      //console.log("1st product data", productData)
      setIsEdit(productData);
      setIsEditID(productData._id);
      setIsVariationBtn(true);
      setIsSwatchBtn(true);
      //console.log("Product ID:", productData._id);

      // Product type and images
      setSelectedProductType(productData.type || "simple");
      setProductImage(productData.image || null);
      setDimensionalImage(productData.dimension_image || null);
      setGalleryImages(productData.images || []);
      setTagSelect(productData.tags || null);
      setProductTagSelect(productData.product_tag || null);
      setSaleTagSelect(productData.sale_tag || null)

      // Stock management
      const manageStockValue = productData.manage_stock?.is_stock_manage || "0";
      setIsStockManagementChecked(manageStockValue);

      // Map UIDs to product names
      const mappedSelectedProducts = mapProductNamesByUIDs(
        productData.collection,
        products
      );
      const mappedRelatedProducts = mapProductNamesByUIDs(
        productData.related_products,
        products
      );
      const mappedNeedProducts = mapProductNamesByUIDs(
        productData.may_also_need,
        products
      );

      setSelectedProducts(productData.collection || []);
      setRelatedProducts(productData.related_products || []);
      setNeedProducts(productData.may_also_need || []);
      setSelectedProductNames(mappedSelectedProducts);
      setRelatedProductNames(mappedRelatedProducts);
      setNeedProductNames(mappedNeedProducts);

      // Handle attributes
      const formattedAttributes =
        productData.attributes?.map((attr) => ({
          _id: attr._id,
          name: attr.name,
          type: attr.type,
          options: attr.options.map((option) => ({
            name: option.name,
            value: option.value,
          })),
          selectedOptions: attr.options.map((option) => option.name),
        })) || [];

      
      // Handle Features
      const formattedFeatures =
        productData.product_features?.map((feature) => ({
        id: feature.id,
        image: feature.image,
        name: feature.name,
        value: feature.value,
      })) || [];

      setSelectedAttributes(formattedAttributes);
      setSelectedFeatures(formattedFeatures);
      setAccordionsData(formattedAttributes);

      // Update the formData
      const manageStockData = productData?.manage_stock || {};
      setFormData((prevState) => ({
        ...prevState,
        name: productData.name ?? prevState.name,
        slug: productData.slug || prevState.slug,
        permalink: productData.permalink || prevState.permalink,
        type: productData.type || prevState.type,
        status: productData.status || prevState.status,
        featured: productData.featured || prevState.featured,
        description: productData.description || prevState.description,
        weight_dimension:
          productData.weight_dimension || prevState.weight_dimension,
        sku: productData.sku || prevState.sku,
        regular_price: productData.regular_price || prevState.regular_price,
        allow_back_order: productData.allow_back_order || prevState.allow_back_order,
        discount: {
          ...prevState.discount,
          is_discountable:
            productData.discount?.is_discountable ||
            prevState.discount.is_discountable,
          discount_type:
            productData.discount?.discount_type ||
            prevState.discount.discount_type,
          discount_value:
            productData.discount?.discount_value ||
            prevState.discount.discount_value,
        },
        deal_of_month: productData.deal_of_month || 0,
        best_selling_product: productData.best_selling_product || 0,
        categories: productData.categories || [],
        attributes: productData.attributes || [],
        product_features: productData.product_features || [],
        gtin: productData.gtin || prevState.gtin,
        mpn: productData.mpn || prevState.mpn,
        ean: productData.ean || prevState.ean,
        brand: productData.brand || prevState.brand,
        menu_order: productData.menu_order || prevState.menu_order,
        short_description: productData.short_description || prevState.short_description,
        purchase_note: productData.purchase_note || prevState.purchase_note,
        tags: productData.tags || [],
        product_tag: productData.product_tag || null,
        sale_tag: productData.sale_tag || null,
        tax_class: productData.tax_class || prevState.tax_class,
        tax_status: productData.tax_status || prevState.tax_status,
        sold_individually:
          productData.sold_individually || prevState.sold_individually,
        manage_stock: {
          ...prevState.manage_stock,
          is_stock_manage:
            manageStockData.is_stock_manage ||
            prevState.manage_stock.is_stock_manage,
          location: manageStockData.location || prevState.manage_stock.location,
          quantity: manageStockData.quantity || prevState.manage_stock.quantity,
          stock_status:
            manageStockData.stock_status || prevState.manage_stock.stock_status,
        },
      }));
      // console.log("Form Data:", formData);
      // console.log("Product Data After Setting State:", productData);

      // Handle tags
      setSelectedTags(productData.tags || []);
      const tagType = productData.tags?.find(
        (tag) => tag.type === "image" || tag.type === "Text"
      );
      setSelectedTagType(tagType || null);

      // Handle Product Tags (Deals in Array instead of handling in an Object)
      setSelectedProductTags(productData.product_tag ? [productData.product_tag] : []);
      const productTagType =
        productData.product_tag &&
        (productData.product_tag.type === "image" || productData.product_tag.type === "Text")
          ? productData.product_tag
          : null;
      setSelectedProductTagType(productTagType);

      // Handle Sale Tags
      setSelectedSaleTags(productData.sale_tag ? [productData.sale_tag] : []);
      const saleTagType =
        productData.sale_tag &&
        (productData.sale_tag.type === "image" || productData.sale_tag.type === "Text")
          ? productData.sale_tag
          : null;
      setSelectedSaleTagType(saleTagType);

      if (productData.type === "variable") {
        setDefaultVariation(productData.default_variation);
        // Generate variations
        const generatedVariations = generateVariations(formattedAttributes);
        setVariations(generatedVariations);

        const variationData = await Promise.all(
          productData.variations.map(async (variation) => {
            try {
              const response = await fetch(
                `${Url}/api/v1/products/get/${variation.uid}`
              );
              const data = await response.json();

              // Ensure complete data extraction, including all nested fields
              const product = data.products[0];
              return {
                uid: variation.uid,
                name: product?.name,
                sku: product?.sku,
                regular_price: product?.regular_price,
                sale_price: product?.sale_price,
                // description: product?.description,
                short_description: product?.short_description,
                weight_dimension: product?.weight_dimension,
                brand: product?.brand,
                collection: product?.collection || productData.collection,
                tags: product?.tags || productData.tags,
                may_also_need:
                  product?.may_also_need || productData.may_also_need,
                //is_default: product?.is_default_variation,
                defaultcheck: product?.is_default_variation,
                status: product?.status || productData.status,
                related_products:
                  product?.related_products || productData.related_products,
                menu_order: product?.menu_order || productData.menu_order,
                // purchase_note: product?.purchase_note || productData.purchase_note,
                enable_review: product?.enable_review,
                categories: product?.categories,
                image: product?.image,
                images: product?.images,
                feature: product?.feature,
                stock_status: product?.manage_stock?.stock_status,
                stock_quantity: product?.manage_stock?.quantity,
                discount: product?.discount,
                rating_count: product?.rating_count,
                average_rating: product?.average_rating,
                permalink: product?.permalink,
                type: product?.type,
                ...product,
              };
            } catch (error) {
              console.error(
                `Failed to fetch data for UID: ${variation.uid}`,
                error
              );
              return null;
            }
          })
        );

        // Filter out nulls and preserve order
        const validVariationData = variationData.filter(
          (data) => data !== null
        );

        // Set the data
        setVariationData(validVariationData);

        // Log for debugging
        console.log("Fetched Variation Data:", validVariationData);
      }
    } catch (error) {
      console.log("error in edit operation", error)
      console.error("Error in handleEditOperation:", error);
    }
  };

  /* --- View Function --- */
  const handleViewOperation = async (viewData) => {
      try {

        setIsViewMode(viewData);
        setIsViewID(viewData._id);

        setSelectedProductType(viewData.type || "simple");
        setProductImage(viewData.image || null);
        setDimensionalImage(viewData.dimension_image || null);
        setGalleryImages(viewData.images || []);
        setTagSelect(viewData.tags || null);
        setProductTagSelect(viewData.product_tag || null)
        setSaleTagSelect(viewData.sale_tag || null)
  
        const manageStockValue = viewData.manage_stock?.is_stock_manage || "0";
        setIsStockManagementChecked(manageStockValue);
  
        const mappedSelectedProducts = mapProductNamesByUIDs(
          viewData.collection,
          products
        );
        const mappedRelatedProducts = mapProductNamesByUIDs(
          viewData.related_products,
          products
        );
        const mappedNeedProducts = mapProductNamesByUIDs(
          viewData.may_also_need,
          products
        );
  
        setSelectedProducts(viewData.collection || []);
        setRelatedProducts(viewData.related_products || []);
        setNeedProducts(viewData.may_also_need || []);
        setSelectedProductNames(mappedSelectedProducts);
        setRelatedProductNames(mappedRelatedProducts);
        setNeedProductNames(mappedNeedProducts);

        const formattedAttributes =
          viewData.attributes?.map((attr) => ({
            _id: attr._id,
            name: attr.name,
            type: attr.type,
            options: attr.options.map((option) => ({
              name: option.name,
              value: option.value,
            })),
            selectedOptions: attr.options.map((option) => option.name),
          })) || [];
  
        const formattedFeatures =
          viewData.product_features?.map((feature) => ({
            id: feature.id,
            image: feature.image,
            name: feature.name,
            value: feature.value,
          })) || [];
          
        setSelectedAttributes(formattedAttributes);
        setSelectedFeatures(formattedFeatures);
        setAccordionsData(formattedAttributes);
        console.log("Formatted Attributes:", formattedAttributes);
        console.log("Formatted Features:", formattedFeatures);
  
        const manageStockData = viewData?.manage_stock || {};
        setFormData((prevState) => ({
          ...prevState,
          name: viewData.name || prevState.name,
          slug: viewData.slug || prevState.slug,
          permalink: viewData.permalink || prevState.permalink,
          type: viewData.type || prevState.type,
          status: viewData.status || prevState.status,
          featured: viewData.featured || prevState.featured,
          description: viewData.description || prevState.description,
          allow_back_order: viewData.allow_back_order || 0,
          weight_dimension:
            viewData.weight_dimension || prevState.weight_dimension,
          sku: viewData.sku || prevState.sku,
          regular_price: viewData.regular_price || prevState.regular_price,
          discount: {
            ...prevState.discount,
            is_discountable:
              viewData.discount?.is_discountable ||
              prevState.discount.is_discountable,
            discount_type:
              viewData.discount?.discount_type ||
              prevState.discount.discount_type,
            discount_value:
              viewData.discount?.discount_value ||
              prevState.discount.discount_value,
          },
          deal_of_month: viewData.deal_of_month || 0,
          best_selling_product: viewData.best_selling_product || 0,
          categories: viewData.categories || [],
          attributes: viewData.attributes || [],
          product_features: viewData.product_features || [],
          gtin: viewData.gtin || prevState.gtin,
          mpn: viewData.mpn || prevState.mpn,
          ean: viewData.ean || prevState.ean,
          brand: viewData.brand || prevState.brand,
          menu_order: viewData.menu_order || prevState.menu_order,
          short_description: viewData.short_description || prevState.short_description,
          purchase_note: viewData.purchase_note || prevState.purchase_note,
          tags: viewData.tags || [],
          tax_class: viewData.tax_class || prevState.tax_class,
          tax_status: viewData.tax_status || prevState.tax_status,
          sold_individually:
            viewData.sold_individually || prevState.sold_individually,
          manage_stock: {
            ...prevState.manage_stock,
            is_stock_manage:
              manageStockData.is_stock_manage ||
              prevState.manage_stock.is_stock_manage,
            location: manageStockData.location || prevState.manage_stock.location,
            quantity: manageStockData.quantity || prevState.manage_stock.quantity,
            stock_status:
              manageStockData.stock_status || prevState.manage_stock.stock_status,
          },
        }));

        setSelectedTags(viewData.tags || []);
        const tagType = viewData.tags?.find(
          (tag) => tag.type === "image" || tag.type === "Text"
        );
        setSelectedTagType(tagType || null);
  
        setSelectedProductTags(viewData.product_tag ? [viewData.product_tag] : []);
        const productTagType =
          viewData.product_tag &&
          (productData.product_tag.type === "image" || productData.product_tag.type === "Text")
            ? viewData.product_tag
            : null;
        setSelectedProductTagType(productTagType);

        setSelectedSaleTags(viewData.sale_tag ? [viewData.sale_tag] : []);
        const saleTagType =
          productData.sale_tag &&
          (viewData.sale_tag.type === "image" || viewData.sale_tag.type === "Text")
            ? viewData.sale_tag
            : null;
        setSelectedSaleTagType(saleTagType);

        if (viewData.type === "variable") {
          const generatedVariations = generateVariations(formattedAttributes);
          setVariations(generatedVariations);
  
          const variationData = await Promise.all(
            viewData.variations.map(async (variation) => {
              try {
                const response = await fetch(
                  `${Url}/api/v1/products/get/${variation.uid}`
                );
                const data = await response.json();
  
                const product = data.products[0];
                return {
                  uid: variation.uid,
                  name: product?.name,
                  sku: product?.sku,
                  regular_price: product?.regular_price,
                  sale_price: product?.sale_price,
                  short_description: product?.short_description,
                  weight_dimension: product?.weight_dimension,
                  brand: product?.brand,
                  collection: product?.collection || viewData.collection,
                  tags: product?.tags || viewData.tags,
                  may_also_need:
                    product?.may_also_need || viewData.may_also_need,
                  defaultcheck: product?.is_default_variation,
                  allow_back_order: product?.allow_back_order || viewData.allow_back_order, 
                  status: product?.status || viewData.status,
                  related_products:
                    product?.related_products || viewData.related_products,
                  menu_order: product?.menu_order || viewData.menu_order,
                  enable_review: product?.enable_review,
                  categories: product?.categories,
                  image: product?.image,
                  images: product?.images,
                  feature: product?.feature,
                  stock_status: product?.manage_stock?.stock_status,
                  stock_quantity: product?.manage_stock?.quantity,
                  discount: product?.discount,
                  rating_count: product?.rating_count,
                  average_rating: product?.average_rating,
                  permalink: product?.permalink,
                  type: product?.type,
                  ...product,
                };
              } catch (error) {
                console.error(
                  `Failed to fetch data for UID: ${variation.uid}`,
                  error
                );
                return null;
              }
            })
          );

          console.log("Fetched Variation Data:", variationData);
  
          const validVariationData = variationData.filter(
            (data) => data !== null
          );
  
          setVariationData(validVariationData);

          console.log("Fetched Valid Variation Data:", validVariationData);
        }
      } catch (error) {
        console.error("Error in handleEditOperation:", error);
      }
  };

  console.log("The Product View Data:", formData.product_features);

  useEffect(() => {
    if (formData.product_features && formData.product_features.length > 0) {
      setSelectedFeatures(formData.product_features.map(feature => ({
        ...feature,
        inputValue: feature.value || "",
      })));
      setHasSelectedFeatures(formData.product_features.length > 0)
    }
  }, [formData.product_features]);

  /* --- Cancel Function for View / Edit Operation --- */
  const handleCancel = () => {
    resetForm();
    setIsEditMode(false);
    setIsViewMode(false);
    navigate("/E-Commerce/All-Products");
  };

  const handleEditNavigation = () => {
    navigate(`/E-Commerce/Edit-Product/${viewData._id}`, {
      state: { productData: viewData },
    });
  
  };

  /* --- Support Function of Edit Operation Collections / Related Product / May You Also Need --- */
  const mapProductNamesByUIDs = (uids, allProducts) => {
    if (!uids || !allProducts) return [];
    return uids.map((uid) => {
      const product = allProducts.find((p) => p.uid === uid);
      return product ? product.name : "";
    });
  };

  /* --- Function for Opening Gallery Modal (Rashid Ali Works) --- */
  const handleGalleryModalOpen = (clickType) => {
    setModalView(true);
    setImageType(clickType);
  };

  /* --- OnChange Function for Gallery Modal (Rashid Ali Works) --- */
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const api = `${Url}/api/v1/media/products/add`;

    if (file) {
      setImageSendPayload((prevData) => ({
        ...prevData,
        file: file,
      }));
      setUploadedStates("loading");
      alert("wait");
      const imagePayloadToSend = new FormData();
      imagePayloadToSend.append("image", file);
      imagePayloadToSend.append("alt_text", imageSendPayload.alt_text);
      imagePayloadToSend.append("title", imageSendPayload.title);
      imagePayloadToSend.append("description", imageSendPayload.description);
      imagePayloadToSend.append("image_url", imageSendPayload.image_url);
      imagePayloadToSend.append("link_url", imageSendPayload.link_url);
      await uploadImage(imagePayloadToSend, api, setUploadedStates);
    }
    setIsUploaded(true);
  };

  /* --- Get Image for Product Popup Media (Rashid Ali Works) --- */
  const getApi = async () => {
    try {
      const response = await axios.get(`${Url}/api/v1/media/products/get`);
      setData(response.data.media);
    } catch (error) {
      console.log(error);
    }
  };

  /* --- Hook Call GetApi (Rashid Ali Works) --- */
  
  useEffect(() => {
    getApi();
  }, []);

  useEffect(() => {
    if (isUploaded) {
      getApi();
      setIsUploaded(false);
    }
  }, [isUploaded]);

  /* --- Function to handle selecting images without allowing re-selection or deselection (Rashid Ali Works) --- */
  const handleImageSelect = (image, attributeIndex, optionIndex) => {

    if (imageType === "product-image") {
      setProductImage(image);
    } else if (imageType === "gallery-upload") {
      setGalleryImages((prevImages) => {
        const isImageSelected = prevImages.some(
          (img) => img.image_url === image.image_url
        );
        if (!isImageSelected) {
          return [...prevImages, image];
        }
        return prevImages;
      });
    } else if (imageType === "swatch-image") {
      const imageData = {
        image_url: image.image_url,
        title: image.title || "Default Title",
      };

      setSwatchImage(imageData);
      setImgSrc(imageData.image_url);
      setAccordionsData((prevList) => {
        const updatedList = [...prevList];
        updatedList[activeIndex].options[activeIndexOpt].value = imageData.image_url;
        updatedList[activeIndex].options[activeIndexOpt].title = imageData.title;

        return updatedList;
      });

      handleOptionValueChange(attributeIndex, optionIndex, imageData, "image");
    } else if (imageType === "dimensional-image") {
      setDimensionalImage(image); 
    } else {
      console.log("no section selected");
    }

    setModalView(false);
    setImageGalleryPopup(false);
  };

  useEffect(() => {
    if (productimage) {
      //console.log("Product Image Set:", productimage); // Log the selected image URL
    }
  }, [productimage]);

  useEffect(() => {
    if (dimensionalimage) {
      //console.log("Dimensional Image Set:", dimensionalimage);
    }
  }, [dimensionalimage]);

  /* --- For Fetching Attributes from API Call via Hook --- */
  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const response = await axios.get(
          `${Url}/api/v1/attributes/get`
        );
        const data = response.data.ProductsAttributes;

        const formattedAttributes = data.map((attribute) => {
          return {
            _id: attribute._id,
            name: attribute.name,
            type: attribute.type,
            options: attribute.terms.map((term) => ({
              _id: term._id,
              name: term.label,
              value: term.value,
            })),
          };
        });

        setGetAttributes(formattedAttributes);
      } catch (error) {
        console.error("Error fetching attributes:", error);
      }
    };
    fetchAttributes();
  }, []);

  /* --- For Fetching Tags from API Call via Hook --- */ 
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(
          `${Url}/api/v1/productTag/get`
        );
        const data = response.data.productTags;

        const formattedTags = data.map((tag) => ({
          _id: tag._id,
          uid: tag.uid,
          name: tag.name,
          slug: tag.slug,
          text: tag.text,
          type: tag.type,
          image: tag.image,
          bg_color: tag.bg_color,
          text_color: tag.text_color,
        }));

        setGetTags(formattedTags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, []);

  useEffect(() => {
    if (tagselect) {
      //console.log("Updated tagselect:", tagselect);
    }
  }, [tagselect]);

  useEffect(() => {
    if (productTagSelect) {
      //console.log("Updated product tag select:", productTagSelect);
    }
  }, [productTagSelect]);

  useEffect(() => {
    if (saleTagSelect) {
      //console.log("Updated sale tag select:", saleTagSelect);
    }
  }, [saleTagSelect]);

  /* --- Swatch Header Dropdown Handling --- */
  const handleTypeChange = (index, selectedValue) => {
    const updatedAccordionsData = [...accordionsData];
    updatedAccordionsData[index].type = selectedValue;
    setAccordionsData(updatedAccordionsData);
  };

  /* --- Function for Swatch Submission Handling --- */
  const handleSwatchSubmit = () => {
    setIsLoading(true);
    const updatedAttributes = accordionsData.map((attribute) => ({
      _id: attribute._id,
      name: attribute.name,
      type: attribute.type || "select",
      options: attribute.options.map((option) => {
        let value;
        switch (attribute.type) {
          case "color":
          case "image":
          case "select":
            value = option.value;
            break;
          default:
            value = option.value;
        }
        return {
          name: option.name,
          value: value,
        };
      }),
    }));

    console.log("Updated Attributes:", updatedAttributes);

    const updatedVariations = formData?.variations?.map((variation) => {
      const formattedAttributes = updatedAttributes.map((attribute) => ({
        _id: attribute._id,
        name: attribute.name,
        type: attribute.type,
        options: attribute.options.filter((option) =>
          variation.attributes.some((attr) =>
            attr.options.some((opt) => opt.name === option.name)
          )
        ),
      }));

      return {
        ...variation,
        attributes: formattedAttributes,
        default_attributes: formattedAttributes,
      };
    });

    setFormData((prevState) => ({
      ...prevState,
      attributes: updatedAttributes,
      variations: updatedVariations,
    }));

    console.log("Updated Variations Data:", updatedVariations);
    setIsActive(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsActive(false);
    }, 5000);
  };

  /* --- Closing Function for Image Gallery --- */
  function handleModalViewClose() {
    setImageGalleryPopup(false);
    setModalView(false);
  }

  /* --- Hook Call for Image Gallery --- */
  useEffect(() => {
    //console.log("Gallery Modal Status:", imageGalleryPopup);
  }, [imageGalleryPopup]);

  /* --- Function for Swatch Content Section Handling --- */
  
  const renderOptionContent = (
    attributeType,
    option,
    attributeIndex,
    optionIndex,
    isViewMode,
  ) => {
    switch (attributeType) {
      case "select":
        return (
          <>
            <label
              style={{
                lineHeight: "18px",
                color: "var(--text-color-1)",
                fontFamily: "var(--font-family)",
                fontWeight: "var(--font-weight-semi-bold)",
                fontSize: "var(--font-size-small)",
                display: "flex",
                alignItems: "center",
              }}
            >
              Label<span className="superscript"></span>
            </label>
            <input
              type="text"
              name="label"
              readOnly={isViewMode}
              placeholder="Enter label here ..."
              value={option.text}
              onChange={(e) => {
                if (!isViewMode) {
                  handleOptionValueChange(
                    attributeIndex,
                    optionIndex,
                    e.target.value,
                    "text"
                  );
                }
              }}
              style={{
                width: "190px",
                height: "32px",
                padding: "7px",
                borderRadius: "4px",
                border: "var(--standered-border)",
                outline: "none",
                fontFamily: "var(--font-family)",
                fontSize: "var(--font-size-avg)",
                color: "var(--text-color-1)",
                cursor: isViewMode ? "not-allowed" : "text", // Adds visual feedback
                backgroundColor: isViewMode ? "#f5f5f5" : "white", // Subtle style change
              }}
            />
          </>
        );

      case "color":
        return (
          <>
            <label
              style={{
                lineHeight: "18px",
                color: "var(--text-color-1)",
                fontFamily: "var(--font-family)",
                fontWeight: "var(--font-weight-semi-bold)",
                fontSize: "var(--font-size-small)",
                display: "flex",
                alignItems: "center",
              }}
            >
              Color<span className="superscript"></span>
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                // border: "1px solid #F0F0F0",
                border: "var(--standered-border)",
                borderRadius: "var(--secondry-radius)",
                height: "36px",
                width: "175px",
              }}
            >
              <input
                type="color"
                name="bg_color"
                disabled={isViewMode}
                value={option.value}
                onChange={(e) => {
                  if (!isViewMode) {
                    handleOptionValueChange(
                      attributeIndex,
                      optionIndex,
                      e.target.value,
                      "value"
                    );
                  }
                }}
                style={{
                  width: "44.5px",
                  height: "30px",
                  border: "none",
                  borderRadius: "3px",
                  margin: "5px",
                  padding: 0,
                  cursor: isViewMode ? "not-allowed" : "pointer",
                }}
              />
            </div>
          </>
        );

      // case "image":
      //   return (
      //     <>
      //       <label
      //         style={{
      //           lineHeight: "18px",
      //           color: "var(--text-color-1)",
      //           fontFamily: "var(--font-family)",
      //           fontWeight: "var(--font-weight-semi-bold)",
      //           fontSize: "var(--font-size-small)",
      //           display: "flex",
      //           alignItems: "center",
      //         }}
      //       >
      //         Image<span className="superscript"></span>
      //       </label>
      //       <div
      //         style={{
      //           display: "flex",
      //           alignItems: "center",
      //           // border: "1px solid #F0F0F0",
      //           border: "var(--standered-border)",
      //           borderRadius: "var(--secondry-radius)",
      //           height: "36px",
      //           width: "230px",
      //         }}
      //       >
      //         {option.value ? (
      //           <>
      //             <div
      //               className="image-preview-wrapper-swatch"
      //               onClick={() => {
      //                 setActiveIndexOpt(optionIndex);
      //                 handleGalleryModalOpen("swatch-image");
      //               }}
      //             >
      //               <input
      //                 type="text"
      //                 id={`image-upload-${attributeIndex}-${optionIndex}`}
      //                 name="image"
      //                 className="upload-input"
      //                 accept="image/*"
      //                 readonly={isViewMode}
      //                 onChange={(e) =>
      //                   handleOptionValueChange(
      //                     attributeIndex,
      //                     optionIndex,
      //                     e.target.files[0],
      //                     "image"
      //                   )
      //                 }
      //                 style={{ display: "none" }}
      //               />

      //               <span
      //                 style={{
      //                   marginLeft: "10px",
      //                   lineHeight: "19.5px",
      //                   color: "var(--text-color-1)",
      //                   fontFamily: "var(--font-family)",
      //                   fontWeight: "var(--font-weight-regular)",
      //                   fontSize: "var(--font-size-avg)",
      //                 }}
      //               >
      //                 {option.imageName || "Select Image..."}{" "}
      //                 {/* Display the image name */}
      //               </span>
      //               <label
      //                 htmlFor={`image-upload-${attributeIndex}-${optionIndex}`}
      //                 className="image-click-label"
      //               >
      //                 <img
      //                   src={option.value}
      //                   alt=""
      //                   style={{
      //                     height: "28px",
      //                     width: "28px",
      //                     objectFit: "cover",
      //                     borderRadius: "3px",
      //                     cursor: "pointer",
      //                     marginLeft: "7px",
      //                     marginTop: "7px",
      //                   }}
      //                 />
      //               </label>
      //             </div>
      //           </>
      //         ) : (
      //           <label
      //             htmlFor={`image-upload-${attributeIndex}-${optionIndex}`}
      //             className="image-upload-label"
      //             style={{
      //               cursor: "pointer",
      //               display: "flex",
      //               alignItems: "center",
      //             }}
      //           >
      //             <span
      //               style={{
      //                 marginLeft: "10px",
      //                 lineHeight: "19.5px",
      //                 color: "var(--text-color-1)",
      //                 fontFamily: "var(--font-family)",
      //                 fontWeight: "var(--font-weight-regular)",
      //                 fontSize: "var(--font-size-avg)",
      //               }}
      //             ></span>
      //             <img
      //               src={uploadIcon} // Replace with actual upload icon
      //               alt="Upload"
      //               style={{
      //                 height: "28px",
      //                 width: "28px",
      //                 objectFit: "cover",
      //                 borderRadius: "3px",
      //               }}
      //             />
      //           </label>
      //         )}
      //       </div>
      //     </>
      //   );
      //     case "image":
      //       return (
      //         <>
      //           <label
      //             style={{
      //               lineHeight: "18px",
      //               color: "var(--text-color-1)",
      //               fontFamily: "var(--font-family)",
      //               fontWeight: "var(--font-weight-semi-bold)",
      //               fontSize: "var(--font-size-small)",
      //               display: "flex",
      //               alignItems: "center",
      //             }}
      //           >
      //             Image<span className="superscript"></span>
      //           </label>
      //           <div
      //             style={{
      //               display: "flex",
      //               alignItems: "center",
      //               border: "var(--standered-border)",
      //               borderRadius: "var(--secondry-radius)",
      //               height: "36px",
      //               width: "175px",
      //             }}
      //           >
      //             {option.value && (option.value) ? (
      //               <>
      //                 <div
      //                   className="image-preview-wrapper-swatch"
      //                   onClick={() => {
      //                     setActiveIndexOpt(optionIndex);
      //                     handleGalleryModalOpen("swatch-image");
      //                   }}
      //                 >
      //                   <img
      //                     src={`http://fm.skyhub.pk${option.value}`}
      //                     alt={option.imageName || ""}
      //                     style={{
      //                       height: "30px",
      //                       width: "auto",
      //                       objectFit: "cover",
      //                       borderRadius: "3px",
      //                       cursor: "pointer",
      //                       marginLeft: "7px",
      //                     }}
      //                   />
      //                   <span
      //                     style={{
      //                       marginLeft: "10px",
      //                       lineHeight: "19.5px",
      //                       color: "var(--text-color-1)",
      //                       fontFamily: "var(--font-family)",
      //                       fontWeight: "var(--font-weight-regular)",
      //                       fontSize: "var(--font-size-avg)",
      //                     }}
      //                   >
      //                     {option.title || "Selected Image"}
      //                   </span>
      //                 </div>
      //               </>
      //             ) : (
      //               <label
      //                 htmlFor={`image-upload-${attributeIndex}-${optionIndex}`}
      //                 className="image-upload-label"
      //                 style={{
      //                   cursor: "pointer",
      //                   display: "flex",
      //                   alignItems: "center",
      //                 }}
      //               >
      //                 <img
      //                   src={uploadIcon} // Replace with your upload icon
      //                   alt="Upload"
      //                   style={{
      //                     height: "30px",
      //                     width: "auto",
      //                     objectFit: "cover",
      //                     borderRadius: "3px",
      //                     marginLeft: "3px",
      //                     marginTop: "2px",
      //                     filter: "brightness(0.8) contrast(0.35) grayscale(100%)",
      //                   }}
      //                 />
      //                 <span
      //                   style={{
      //                     marginLeft: "10px",
      //                     lineHeight: "19.5px",
      //                     color: "var(--text-color-1)",
      //                     fontFamily: "var(--font-family)",
      //                     fontWeight: "var(--font-weight-regular)",
      //                     fontSize: "var(--font-size-avg)",
      //                   }}
      //                 >
      //                   Select Image...
      //                 </span>
      //               </label>
      //             )}
      //           </div>
      //         </>
      //       );
      //     default:
      //       return null;
      //   }
      // };
        case "image":
        return (
          <>
            <label
              style={{
                lineHeight: "18px",
                color: "var(--text-color-1)",
                fontFamily: "var(--font-family)",
                fontWeight: "var(--font-weight-semi-bold)",
                fontSize: "var(--font-size-small)",
                display: "flex",
                alignItems: "center",
              }}
            >
              Image<span className="superscript"></span>
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: "var(--standered-border)",
                borderRadius: "var(--secondry-radius)",
                height: "36px",
                width: "175px",
              }}
            >
              {option.value ? (
                isImageURL(option.value) ? (
                  <div
                    className="image-preview-wrapper-swatch"
                    onClick={() => {
                      setActiveIndexOpt(optionIndex);
                      handleGalleryModalOpen("swatch-image");
                    }}
                  >
                    <img
                      src={`${Url+option.value}`}
                      alt={option.imageName || ""}
                      style={{
                        height: "30px",
                        width: "auto",
                        objectFit: "cover",
                        borderRadius: "3px",
                        cursor: "pointer",
                        marginLeft: "7px",
                      }}
                    />
                    <span
                      style={{
                        marginLeft: "10px",
                        lineHeight: "19.5px",
                        color: "var(--text-color-1)",
                        fontFamily: "var(--font-family)",
                        fontWeight: "var(--font-weight-regular)",
                        fontSize: "var(--font-size-avg)",
                      }}
                    >
                      {option.title || "Selected Image"}
                    </span>
                  </div>
                ) : (
                  // Render default icon for non-image values
                  <div
                    className="image-preview-wrapper-swatch"
                    onClick={() => {
                      setActiveIndexOpt(optionIndex);
                      handleGalleryModalOpen("swatch-image");
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={uploadIcon}
                      alt="Upload"
                      style={{
                        height: "30px",
                        width: "auto",
                        objectFit: "cover",
                        borderRadius: "3px",
                        marginLeft: "3px",
                        marginTop: "2px",
                        filter: "brightness(0.8) contrast(0.35) grayscale(100%)",
                      }}
                    />
                    <span
                      style={{
                        marginLeft: "10px",
                        lineHeight: "19.5px",
                        color: "var(--text-color-1)",
                        fontFamily: "var(--font-family)",
                        fontWeight: "var(--font-weight-regular)",
                        fontSize: "var(--font-size-avg)",
                      }}
                    >
                      {option.title || "Select an Image"}
                    </span>
                  </div>
                )
              ) : (
                <label
                  htmlFor={`image-upload-${attributeIndex}-${optionIndex}`}
                  className="image-upload-label"
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={uploadIcon}
                    alt="Upload"
                    style={{
                      height: "30px",
                      width: "auto",
                      objectFit: "cover",
                      borderRadius: "3px",
                      marginLeft: "3px",
                      marginTop: "2px",
                      filter: "brightness(0.8) contrast(0.35) grayscale(100%)",
                    }}
                  />
                  <span
                    style={{
                      marginLeft: "10px",
                      lineHeight: "19.5px",
                      color: "var(--text-color-1)",
                      fontFamily: "var(--font-family)",
                      fontWeight: "var(--font-weight-regular)",
                      fontSize: "var(--font-size-avg)",
                    }}
                  >
                    Select Image...
                  </span>
                </label>
              )}
            </div>
          </>
        );
        function isImageURL(value) {
          return /\.(jpeg|jpg|gif|png|webp)$/i.test(value);
        }
      }
  };

  const handleOptionValueChange = (
    attributeIndex,
    optionIndex,
    newValue,
    field = "value"
  ) => {
    const updatedAccordionsData = [...accordionsData];

    if (field === "value" || field === "select") {
      updatedAccordionsData[attributeIndex].options[optionIndex][field] =
        newValue;
    } else if (field === "image") {
      
    }

    setAccordionsData(updatedAccordionsData);
  };

  /* --- Function for Handling of Tag Selection in Product Data General Tab --- */
  /* --- For Single Selection --- */
  const handleTagSelect = (tagName) => {
    //console.log("Tag selected:", tagName);

    setSelectedTags((prevTags) => {
      // Find the selected tag from the tags list
      const selected = tags.find((tag) => tag.name === tagName);
      //console.log("Complete tag payload:", selected);

      if (selected) {
        // Update tagselect as an array with the selected tag object
        setTagSelect([selected]); // Wrap the single tag in an array
      }

      // If the tag is already selected, remove it
      if (prevTags.some((tag) => tag.name === tagName)) {
        //console.log("Removing tag:", tagName);
        const updatedTags = prevTags.filter((tag) => tag.name !== tagName);

        // Reset the selected tag state if no tags are left, else set the first selected tag
        setSelectedTagType(updatedTags.length === 0 ? null : updatedTags[0]);

        // Clear tagselect if there are no selected tags
        if (updatedTags.length === 0) {
          setTagSelect([]); // Clear the tagselect array
        }

        return updatedTags;
      } else {
        //console.log("Adding tag:", tagName);
        const updatedTags = [
          {
            ...selected,
            selectedOptions: [],
          },
        ];

        setSelectedTagType(selected); // Store the entire selected tag object for styling access
        return updatedTags;
      }
    });
  };

  const handleProductTagSelect = (tagName) => {
    //console.log("Tag selected:", tagName);
  
    setSelectedProductTags((prevTags) => {
      // Find the selected tag from the tags list
      const selected = tags.find((tag) => tag.name === tagName);
      //console.log("Complete tag payload:", selected);
  
      if (selected) {
        // Set productTagSelect to the selected tag object (not wrapped in an array)
        setProductTagSelect(selected); // Set the single tag object directly
      }
  
      // If the tag is already selected, remove it
      if (prevTags.some((tag) => tag.name === tagName)) {
        //console.log("Removing tag:", tagName);
        const updatedTags = prevTags.filter((tag) => tag.name !== tagName);
  
        // Reset the selected tag state if no tags are left, else set the first selected tag
        setSelectedProductTagType(updatedTags.length === 0 ? null : updatedTags[0]);
  
        // Clear producttagselect if there are no selected tags
        if (updatedTags.length === 0) {
          setProductTagSelect(null); // Clear the producttagselect object
        }
  
        return updatedTags;
      } else {
        //console.log("Adding tag:", tagName);
        const updatedTags = [
          {
            ...selected,
            selectedOptions: [],
          },
        ];
  
        setSelectedProductTagType(selected); // Store the entire selected tag object for styling access
        return updatedTags;
      }
    });
  };

  const handleSaleTagSelect = (tagName) => {
    //console.log("Tag selected:", tagName);
  
    setSelectedSaleTags((prevTags) => {
      // Find the selected tag from the tags list
      const selected = tags.find((tag) => tag.name === tagName);
      //console.log("Complete tag payload:", selected);
  
      if (selected) {
        // Set saleTagSelect to the selected tag object (not wrapped in an array)
        setSaleTagSelect(selected); // Set the single tag object directly
      }
  
      // If the tag is already selected, remove it
      if (prevTags.some((tag) => tag.name === tagName)) {
        //console.log("Removing tag:", tagName);
        const updatedTags = prevTags.filter((tag) => tag.name !== tagName);
  
        // Reset the selected tag state if no tags are left, else set the first selected tag
        setSelectedSaleTagType(updatedTags.length === 0 ? null : updatedTags[0]);
  
        // Clear saletagselect if there are no selected tags
        if (updatedTags.length === 0) {
          setSaleTagSelect(null); // Clear the saletagselect object
        }
  
        return updatedTags;
      } else {
        //console.log("Adding tag:", tagName);
        const updatedTags = [
          {
            ...selected,
            selectedOptions: [],
          },
        ];
  
        setSelectedSaleTagType(selected); // Store the entire selected tag object for styling access
        return updatedTags;
      }
    });
  };

  /* --- For Multiple Selection --- */
  // const handleTagSelect = (tagName) => {
  //   console.log("Tag selected:", tagName);
  
  //   setSelectedTags((prevTags) => {
  //     // Find the selected tag from the tags list
  //     const selected = tags.find((tag) => tag.name === tagName);
  //     console.log("Complete tag payload:", selected);
  
  //     if (!selected) {
  //       console.warn(`Tag "${tagName}" not found.`);
  //       return prevTags;
  //     }
  
  //     // Check if the tag is already selected
  //     if (prevTags.some((tag) => tag.name === tagName)) {
  //       console.log("Deselecting tag:", tagName);
  
  //       // Remove the tag from the selected list
  //       const updatedTags = prevTags.filter((tag) => tag.name !== tagName);
  
  //       // Update tagSelect to reflect the deselected tag
  //       setTagSelect((prevTagSelect) =>
  //         prevTagSelect.filter((tag) => tag.name !== tagName)
  //       );
  
  //       return updatedTags; // Update selectedTags state
  //     } else {
  //       console.log("Selecting tag:", tagName);
  
  //       // Add the tag to the selected list
  //       const updatedTags = [
  //         ...prevTags,
  //         {
  //           ...selected,
  //           selectedOptions: [], // Include additional properties if needed
  //         },
  //       ];
  
  //       // Update tagSelect with the new selection
  //       setTagSelect(updatedTags);
  
  //       return updatedTags; // Update selectedTags state
  //     }
  //   });
  // };
  
  /* --- Function for Handling of Feature Selection in Product Data Feature Tab --- */
  const handleFeatureSelect = (featurename) => {
    //console.log("Trying to select feature:", featurename);
    //console.log("Available features:", getFeatures);
  
    const selected = getFeatures.find((fet) => fet.name === featurename);
    //console.log("Selected feature:", selected);
  
    if (selected && !selectedFeatures.some((fet) => fet.name === featurename)) {
      setSelectedFeatures((prevFeatures) => [
        ...prevFeatures,
        { ...selected, inputValue: "" },
      ]);
    }
  };  

  /* --- Search & Select Field Function for Single-Attribute Selection --- */
  const handleSingleFeatureSelect = (featurename, value) => {
    setSelectedFeatures((prevFeatures) =>
      prevFeatures.map((feature) =>
        feature.name === featurename
          ? { ...feature, inputValue: value }
          : feature
      )
    );
  };

    /* --- Function for Delete Selected Feature --- */
  const handleDeleteFeature = (featurename) => {
      setSelectedFeatures((prev) =>
        prev.filter((feature) => feature.name !== featurename)
      );
  };

  // Update this state whenever an Feature is selected
  const handleFeatureSelectWithState = (selectedValue) => {
    handleFeatureSelect(selectedValue);
    setHasSelectedFeatures(selectedValue.length > 0); // Check if any feature is selected
  };

  /* --- Function for Handling Features Submission for Single Product --- */
  const handleSingleSaveFeatures = () => {
    setIsLoading(true);
  
    const formattedFeatures = selectedFeatures.map((feature) => ({
      id: feature.id,
      name: feature.name,
      value: feature.inputValue ? String(feature.inputValue) : "",
      image: feature.image || "", // Include image if available
    }));
  
    console.log("Formatted Features:", formattedFeatures);
  
    // Update formData with the selected features
    setFormData((prevState) => ({
      ...prevState,
      product_features: formattedFeatures,
    }));
  
    // Optionally, update accordions if needed for UI display
    // setAccordionsData(formattedFeatures);
  
    // Toggle button active state
    setIsActive(true);
  
    // Reset the button after 5 seconds
    setTimeout(() => {
      setIsLoading(false);
      setIsActive(false);
    }, 5000);
  };  

  /* --- Function for Handling of Attribute Selection in Product Data Attribute Tab --- */
  const handleAttributeSelect = (attributename) => {
    // Find the selected attribute from the attributes list
    const selected = attributes.find((attr) => attr.name === attributename);

    // Ensure the attribute is added only once
    if (!selectedAttributes.some((attr) => attr.name === attributename)) {
      setSelectedAttributes((prevAttributes) => [
        ...prevAttributes,
        {
          ...selected,
          selectedOptions: [], // Initialize selected options
        },
      ]);
    }
  };

  /* --- Search & Select Field Function for Single-Attribute Selection --- */
  const handleSingleSelect = (attributename, optionname) => {
    setSelectedAttributes((prevAttributes) =>
      prevAttributes.map((attribute) => {
        if (attribute.name === attributename) {
          if (attribute.selectedOptions.includes(optionname)) {
            // If the option is already selected, remove it
            return {
              ...attribute,
              selectedOptions: attribute.selectedOptions.filter(
                (opt) => opt !== optionname
              ), // Remove the option
            };
          } else {
            // If an option is selected, replace the previous selection with the new one
            return {
              ...attribute,
              selectedOptions: [optionname], // Ensure only one option is selected
            };
          }
        }
        return attribute; // Return attribute unchanged if it does not match
      })
    );
  };

  /* --- Search & Select Field Function for Multi-Attribute Selection --- */
  const handleMultiSelect = (attributename, optionname, isRemoving = false) => {
    setSelectedAttributes((prevAttributes) =>
      prevAttributes.map((attribute) => {
        if (attribute.name === attributename) {
          if (isRemoving) {
            // Remove the option
            return {
              ...attribute,
              selectedOptions: attribute.selectedOptions.filter(
                (item) => item !== optionname
              ),
            };
          } else {
            // Add the option
            return {
              ...attribute,
              selectedOptions: [...attribute.selectedOptions, optionname],
            };
          }
        }
        return attribute;
      })
    );
  };

  /* --- By-Default Selection of All Available Terms of Relevant Attribute --- */
  const handleSelectAll = (attributeName, allOptions) => {
    setSelectedAttributes((prevAttributes) =>
      prevAttributes.map((attribute) => {
        if (attribute.name === attributeName) {
          return {
            ...attribute,
            selectedOptions: allOptions, // Select all options
          };
        }
        return attribute;
      })
    );
  };  

  /* --- Select All Handling in Variable Product Section --- */
  const handleButtonClick = (attributeName, allOptions) => {
    setIsClicked(true); // Add clicked effect
    handleSelectAll(attributeName, allOptions); // Select all terms for the attribute
  
    setTimeout(() => {
      setIsClicked(false); // Reset clicked state after 2 seconds
    }, 2000);
  };  

  /* --- Function for Delete Selected Attribute --- */
  // const handleDeleteAttribute = (attributename) => {
  //   if (!isViewMode) {
  //   setSelectedAttributes((prev) =>
  //     prev.filter((attr) => attr.name !== attributename)
  //   );
  // }
  // setHasSelectedAttributes(false);
  // setIsSwatchBtn(false);
  // setIsVariationBtn(false);
  // // Update formData with the selected attributes
  // setFormData((prevState) => ({
  //   ...prevState,
  //   attributes: [],
  // }));

  // // Optionally, update accordions if you need it for UI display
  // setAccordionsData([]);
  // setVariationData({});
  // };

  const handleDeleteAttribute = (attributename) => {
    if (!isViewMode) {
      setSelectedAttributes((prev) => {
        // Filter out the attribute to be deleted
        const updatedAttributes = prev.filter((attr) => attr.name !== attributename);
  
        // Regenerate variations based on the updated attributes
        const updatedVariations = generateVariations(updatedAttributes);
  
        // Update the state for variations and accordions
        setVariationData({});
        setAccordionsData([]);
        setVariations([]);
        return updatedAttributes;
      });
    }
  
    // Reset any dependent UI states
    setHasSelectedAttributes(false);
    setIsSwatchBtn(false);
    setIsVariationBtn(false);
  };

  const handleAccordionToggle = (index) => {
    setActiveAccordion((prev) => (prev === index ? -1 : index)); // Close if already open
  };
  
  /* --- Function to create Variations according to Selected Attributes & Selected Product Type --- */
  const generateVariations = (attributes) => {
    if (attributes.length < 2) {
      return []; // Return an empty array if there's only one attribute
    }

    const options = attributes.map((attr) => attr.selectedOptions);

    const cartesian = (arr) => {
      return arr.reduce((a, b) =>
        a.flatMap((d) => b.map((e) => [d, e].flat()))
      );
    };

    return cartesian(options);
  };

  /* --- Function to Generate Serialized Variation Number --- */
  const generateVariationNumber = (index) => {
    // Generate a 5-digit variation number, padded with zeros
    return String(index + 1).padStart(5, "0");
  };

  // Update this state whenever an attribute is selected
  const handleAttributeSelectWithState = (selectedValue) => {
    handleAttributeSelect(selectedValue);
    setHasSelectedAttributes(selectedValue.length > 0); // Check if any attribute is selected
  };

  /* --- Function for Handling Attribute Submission for Single Product --- */
  const handleSingleSaveAttributes = () => {
    setIsLoading(true);
    const formattedAttributes = selectedAttributes.map((attribute) => ({
      _id: attribute._id,
      name: attribute.name,
      type: attribute.type,
      options: attribute.selectedOptions.map((optionName) => {
        const option = attribute.options.find((opt) => opt.name === optionName);
        return {
          // _id: option._id,
          name: option.name,
          value: option.value,
        };
      }),
    }));

    // Update formData with the selected attributes
    setFormData((prevState) => ({
      ...prevState,
      attributes: formattedAttributes,
    }));

    // Optionally, update accordions if you need it for UI display
    setAccordionsData(formattedAttributes);

    // Toggle button active state
    setIsActive(true);

    // Reset the button after 5 seconds
    setTimeout(() => {
      setIsLoading(false);
      setIsActive(false);
      setIsSwatchBtn(true);
      setIsVariationBtn(false);
    }, 5000);
  };

  useEffect(() => {
    return () => clearTimeout();
  }, []);

  /* --- Function for Handling Attribute Submission for Variable Product --- */
  const handleSaveAttributes = () => {
    setIsLoading(true);
    const formattedAttributes = selectedAttributes.map((attribute) => ({
      _id: attribute._id,
      name: attribute.name,
      type: attribute.type,
      options: attribute.selectedOptions.map((optionname) => {
        const option = attribute.options.find((opt) => opt.name === optionname);
        return {
          name: option.name,
          value: option.value,
        };
      }),
    }));

    // Update formData with the selected attributes
    setFormData((prevState) => ({
      ...prevState,
      attributes: formattedAttributes,
    }));

    console.log(formattedAttributes);

    // Generate variations and update the state
    const newVariations = generateVariations(selectedAttributes);
    setVariations(newVariations);

    // Initialize variationData with empty fields for each variation
    setVariationData(
      newVariations.map(() => ({
        name: "",
        slug: "",
        permalink: "",
        // description: "",
        short_description: "",
        // weight_dimension: "",
        menu_order: 1,
        sku: "",
        discount: {
          is_discountable: 0,
          discount_type: "",
          discount_value: "",
        },
        manage_stock: {
          is_stock_manage: 0,
          location: "All Locations",
          quantity: "",
          stock_status: "",
        },
        regular_price: "",
        tax_status: "",
        tax_class: "",
        brand: "",
        gtin: "",
        mpn: "",
        ean: "",
        allow_back_order: 0,
        is_default: 0,
        categories: [],
        attributes: [],
        default_attributes: [],
        image: {},
        images: [],
      }))
    );

    setAccordionsData(formattedAttributes);

    // Toggle button active state
    setIsActive(true);

    // Reset the button after 5 seconds
    setTimeout(() => {
      setIsLoading(false);
      setIsActive(false);
      setIsSwatchBtn(true);
      setIsVariationBtn(true);
    }, 5000);
  };

    useEffect(() => {
      return () => clearTimeout();
    }, []);

  /* --- OnChange Function for Variable Product Handling --- */
  const handleVariationChange = (index, field, valueOrEvent) => {
    let value;

    if (valueOrEvent.target) {
      const { name, checked, value: eventValue } = valueOrEvent.target;
      value =
        field === "defaultcheck" || field === "manageStock"
          ? checked
          : eventValue;
      field = name;
    } else {
      value = valueOrEvent; // For direct values
    }

    setVariationData((prevData) => {
      const updatedData = [...prevData];

      // Handle "defaultcheck" logic
      if (field === "defaultcheck") {
        // Reset all other variations' "defaultcheck"
        updatedData.forEach((variation, idx) => {
          if (idx !== index) {
            variation.defaultcheck = false;
            variation.is_default = 0;
          }
        });

        // Set the selected variation's "defaultcheck" to the current value
        updatedData[index].defaultcheck = value;
        updatedData[index].is_default = value ? 1 : 0;

        // Update formData attributes if checked
        if (value) {
          setDefaultVariationIndex(index);
          const selectedVariation = updatedData[index];
          setDefaultVariation(selectedVariation.uid);
          setFormData((prevFormData) => ({
            ...prevFormData,
            default_variation: selectedVariation.uid,
            sku: selectedVariation.sku || "",
            regular_price: selectedVariation.regular_price || "",
            gtin: selectedVariation.gtin || "",
            mpn: selectedVariation.mpn || "",
            ean: selectedVariation.ean || "",
            tax_class: selectedVariation.tax_class || "",
            tax_status: selectedVariation.tax_status || "",
            brand: selectedVariation.brand || "",
            short_description: selectedVariation.short_description || "",
            discount: selectedVariation.discount || [],
            manage_stock: selectedVariation.manage_stock || [],
            allow_back_order: selectedVariation.allow_back_order || 0,
            // Update image and images based on the selected variation
            image: selectedVariation.image || prevFormData.image,
            images: selectedVariation.images || prevFormData.images,
          }));
        }
      } else if (field === "allow_back_order") {
        // Handle allow_back_order field
        updatedData[index] = {
          ...updatedData[index],
          allow_back_order: value,
        };
      } else {
        // Handle other fields as before
        const currentVariation = updatedData[index];

        if (field === "manageStock") {
          const isStockManageChecked = value;
          updatedData[index] = {
            ...currentVariation,
            manage_stock: {
              ...currentVariation.manage_stock,
              is_stock_manage: isStockManageChecked,
            },
          };
          if (value) {
            updatedData[index].manage_stock = {
              ...updatedData[index].manage_stock,
              stock_status:
                currentVariation.manage_stock?.stock_status || "Out of Stock",
              location: currentVariation.manage_stock?.location || "All Locations",
              quantity: currentVariation.manage_stock?.quantity || 0,
            };
          }
        } else if (["stock_status", "location", "quantity"].includes(field)) {
          updatedData[index].manage_stock = {
            ...currentVariation.manage_stock,
            [field]: value,
          };
        } else if (
          ["discount_value", "discount_type", "is_discountable"].includes(field)
        ) {
          updatedData[index].discount = {
            ...currentVariation.discount,
            [field]: value,
          };
        } else if (field === "sale_selection") {
          updatedData[index].discount = {
            ...currentVariation.discount,
            is_discountable: value && value !== "None" ? 1 : 0,
            discount_type: value || "None",
          };
        } else {
          updatedData[index] = {
            ...currentVariation,
            [field]: value,
          };
        }
      }

      // Update `weight_dimension` from the latest `formData`
      updatedData[index].weight_dimension = formData.weight_dimension;

      return updatedData;
    });
  };

  /* --- Function for Handling of Formatted, Validated & Updated Variation Data --- */
  // const handleVariationSubmit = () => {
  //   setIsLoading(true);
  //   const baseURL = "https://myfurnituremecca.com/";

  //   // Format variations
  //   const formattedVariations = variations.map((variation, index) => {
  //     const variationName = [formData.name, ...variation].join(" ");
  //     const variationSlug = variationName
  //       .toLowerCase()
  //       .replace(/\s+/g, "-") // Replace spaces with hyphens
  //       .replace(/[^\w-]+/g, ""); // Remove special characters
  //     const variationPermalink = `${baseURL}${variationSlug}`;

  //     // Format attributes
  //     const formattedAttributes = selectedAttributes.map((attribute) => ({
  //       _id: attribute._id,
  //       name: attribute.name,
  //       type: attribute.type,
  //       options: attribute.selectedOptions
  //         .filter((optionName) => variation.includes(optionName)) // Include only options in the current variation
  //         .map((optionName) => {
  //           const option = attribute.options.find(
  //             (opt) => opt.name === optionName
  //           );
  //           return {
  //             name: option.name,
  //             value: option.value,
  //           };
  //         }),
  //     }));

  //     // Get the current variation from the data
  //     const { regular_price, discount } = variationData[index];

  //     let salePrice = regular_price; // Default sale price is the regular price

  //     if (discount && discount.is_discountable === 1) {
  //       const regularPrice = parseFloat(regular_price) || 0;
  //       const discountValue = parseFloat(discount.discount_value) || 0;

  //       // Calculate the sale price based on the discount type
  //       if (discount.discount_type === "percentage") {
  //         salePrice = regularPrice - regularPrice * (discountValue / 100);
  //       } else if (discount.discount_type === "currency") {
  //         salePrice = regularPrice - discountValue;
  //       }

  //       // Ensure sale price does not go below zero
  //       salePrice = Math.max(salePrice, 0);
  //     } else {
  //       salePrice = ""; // Clear sale price if no discount
  //     }

  //     // Update the variationData with the new sale_price
  //     variationData[index] = {
  //       ...variationData[index],
  //       sale_price: salePrice, // Assign calculated sale_price
  //     };

  //     // Return the formatted variation along with the calculated sale price
  //     return {
  //       variationDetails: variation,
  //       data: {
  //         ...variationData[index],
  //         name: variationName,
  //         slug: variationSlug,
  //         permalink: variationPermalink,
  //         attributes: formattedAttributes,
  //         default_attributes: formattedAttributes,
  //         menu_order: 1, // Add menu_order for each variation
  //         categories: formData.categories,
  //         status: formData.status,
  //         type: "simple",
  //       },
  //     };
  //   });

  //   console.log("Submitted Variations Data:", formattedVariations);

  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     variations: formattedVariations.map((variation) => variation.data), // Extract only the `data` property
  //   }));
  //   setIsLoading(false);
  // };

  const handleVariationSubmit = async () => {
    setIsLoading(true);
    const baseURL = "https://furnituremecca.zellesolutions.com/";
    const webURL = "https://myfurnituremecca.zellesolutions.com/"
  
    try {
      // Format variations
      const formattedVariations = variations.map((variation, index) => {
        const variationName = [formData.name, ...variation].join(" ");
        const variationSlug = variationName
          .toLowerCase()
          .replace(/\s+/g, "-") // Replace spaces with hyphens
          .replace(/[^\w-]+/g, ""); // Remove special characters
        const variationPermalink = `${baseURL}${variationSlug}`;
  
        const formattedAttributes = selectedAttributes.map((attribute) => ({
          _id: attribute._id,
          name: attribute.name,
          type: attribute.type,
          options: attribute.selectedOptions
            .filter((optionName) => variation.includes(optionName))
            .map((optionName) => {
              const option = attribute.options.find(
                (opt) => opt.name === optionName
              );
              return {
                name: option.name,
                value: option.value,
              };
            }),
        }));
  
        const { regular_price, discount } = variationData[index];
        let salePrice = regular_price;
  
        if (discount && discount.is_discountable === 1) {
          const regularPrice = parseFloat(regular_price) || 0;
          const discountValue = parseFloat(discount.discount_value) || 0;
  
          if (discount.discount_type === "percentage") {
            salePrice = regularPrice - regularPrice * (discountValue / 100);
          } else if (discount.discount_type === "currency") {
            salePrice = regularPrice - discountValue;
          }
  
          salePrice = Math.max(salePrice, 0);
        } else {
          salePrice = "";
        }
  
        variationData[index] = {
          ...variationData[index],
          sale_price: salePrice,
        };
  
        return {
          variationDetails: variation,
          data: {
            ...variationData[index],
            name: variationName,
            slug: variationSlug,
            permalink: variationPermalink,
            attributes: formattedAttributes,
            default_attributes: formattedAttributes,
            menu_order: 1,
            categories: formData.categories,
            status: formData.status,
            type: "simple",
          },
        };
      });
  
      console.log("Submitted Variations Data:", formattedVariations);
  
      setFormData((prevFormData) => ({
        ...prevFormData,
        variations: formattedVariations.map((variation) => variation.data),
      }));
  
      // Example: Simulating an async operation
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
    } catch (error) {
      console.error("Error submitting variations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /* --- Function for Handling of Stock Management in Facebook Sidebar Item --- */
  const handleStockManagementChange = (e) => {
    setIsStockManagementChecked(e.target.checked);
  };

  /* --- Function for Dynamically Handle OnChange Tax Status in General-(Single Product) & Variation-(Variable Product) Sidebar Item --- */
  const handleChangeTaxStatus = (selectedValue) => {
    setSelectedTaxStatus(selectedValue);
  };

  /* --- Function for handling of Location Change in Facebook Sidebar Item --- */
  const handleChangeLocations = (selectedValue) => {
    setSelectedLocations(selectedValue);
  };

  /* --- Function for Handling of Sale Price in Product Data - General:SideBar Item for Single Product --- */
  const handleChangeSale = (selectedValue) => {
    setSelectedSale(selectedValue);

    setFormData((prevState) => ({
      ...prevState,
      discount: {
        ...prevState.discount,
        is_discountable: selectedValue && selectedValue !== "None" ? 1 : 0,
        discount_type: selectedValue || "None",
      },
    }));
  };

  /* --- Function to Handle Selection of Shipping Class in Product Data */
  const handleChangeShippingClass = (selectedValue) => {
    setSelectedShippingClass(selectedValue);
  };

  /* --- Function to Toggle Between SEO Accordions --- */
  const toggleAccordion = (index) => {
    setAccordionsOpen((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  /* --- Function to Handle Selection of Product Data - Sidebar Items (For Single + Variable Product Type)--- */
  const handleMenuClick = (id) => {
    setSelectedItem(id);
  };

  /* --- Sale Discount Dropdown Options Selection --- */
  const SaleOptions = [
    { value: "percentage", label: "By %" },
    { value: "currency", label: "By $" },
  ];

  /* --- Single Product Tax Type Dropdown Options Selection --- */
  const taxTypeOptions = [
    { value: "taxable", label: "Taxable" },
    { value: "nonTaxable", label: "Non-Taxable" },
    { value: "exempt", label: "Exempt" },
  ];

  /* --- Variable Product Tax Type Dropdown Options Selection --- */
  const variableTaxTypeOptions = [
    { value: "taxable", label: "Taxable" },
    { value: "nonTaxable", label: "Non-Taxable" },
    { value: "exempt", label: "Exempt" },
  ];

  /* --- Single Product Tax Class Dropdown Options Selection --- */
  const taxClassOptions = [
    { value: "standard", label: "Standard" },
    { value: "reduced rate", label: "Reduced rate" },
    { value: "zero rate", label: "Zero rate" },
  ];

  /* --- Variable Product Tax Class Dropdown Options Selection --- */
  const variableTaxClassOptions = [
    { value: "standard", label: "Standard" },
    { value: "reduced rate", label: "Reduced rate" },
    { value: "zero rate", label: "Zero rate" },
  ];

  /* --- Shipping Class Dropdown Options Selection --- */
  const shippingClassOptions = [
    { value: "No Shipping Class", label: "No Shipping Class" },
    { value: "Free Shipping-All Rugs", label: "Free Shipping-All Rugs" },
  ];

  /* --- Store Location Dropdown Options Selection --- */
  const locationsOptions = [
    { value: "allLocations", label: "All Locations" },
    { value: "store-1", label: "Store-1" },
    { value: "store-2", label: "Store-2" },
  ];

  /* --- Function to Generate Slug According to Product Name Automatically --- */
  const generateSlug = (name) => {
    return name.trim().toLowerCase().replace(/\s+/g, "-");
  };

  // const handleInputChange = (event) => {
  //   const { name, value, type, checked } = event.target;

  //   setFormData((prevState) => ({
  //     ...prevState,
  //     [name]: type === "checkbox" ? (checked ? 1 : 0) : value, // Conditionally set value based on input type
  //     slug: name === "name" ? generateSlug(value) : prevState.slug, // Set slug based on product name
  //   }));

  //   const inputType = event.target.id;

  //   if (inputType === "productImage") {
  //     const file = event.target.files[0];
  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         setProductImage(reader.result);
  //       };
  //       reader.readAsDataURL(file);
  //       uploadImageToBackend([file], inputType);
  //     }
  //   } else if (inputType === "galleryImages") {
  //     const files = Array.from(event.target.files);
  //     if (files.length > 0) {
  //       const newImages = files.map((file) => ({
  //         url: URL.createObjectURL(file),
  //         file,
  //       }));

  //       setGalleryImages((prev) => [...prev, ...newImages]);

  //       // Clear the file input after selection
  //       event.target.value = ""; // <-- This ensures the input is cleared after each selection

  //       uploadImageToBackend(files, inputType);
  //     }
  //   }
  // };
  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
  
    setFormData((prevState) => {
      const updatedState = {
        ...prevState,
        [name]: type === "checkbox" ? (checked ? 1 : 0) : value, // Conditionally set value based on input type
      };
  
      // If the name field is updated, generate slug and permalink
      if (name === "name") {
        const generatedSlug = generateSlug(value);
        updatedState.slug = generatedSlug;
        updatedState.permalink = `${baseURL}${generatedSlug}`;
      }
  
      return updatedState;
    });
  
    const inputType = event.target.id;
  
    if (inputType === "productImage") {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProductImage(reader.result);
        };
        reader.readAsDataURL(file);
        uploadImageToBackend([file], inputType);
      }
    } else if (inputType === "galleryImages") {
      const files = Array.from(event.target.files);
      if (files.length > 0) {
        const newImages = files.map((file) => ({
          url: URL.createObjectURL(file),
          file,
        }));
  
        setGalleryImages((prev) => [...prev, ...newImages]);
  
        // Clear the file input after selection
        event.target.value = ""; // <-- This ensures the input is cleared after each selection
  
        uploadImageToBackend(files, inputType);
      }
    } else if (inputType === "dimensionalImage") {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setDimensionalImage(reader.result);
        };
        reader.readAsDataURL(file);
        uploadImageToBackend([file], inputType);
      }
    }
  };  
  
  const calculateSalePrice = () => {
    const { regular_price, discount } = formData;

    if (discount.is_discountable === 1) {
      // Convert values to integers or floats as needed
      const regularPrice = parseFloat(regular_price) || 0;
      //console.log("Regular Price:", regularPrice);
      const discountValue = parseFloat(discount.discount_value) || 0;
      //console.log("Discounted Value:", discountValue);

      let salePrice = regularPrice;

      // Calculate based on discount type
      if (discount.discount_type === "percentage") {
        salePrice = regularPrice - regularPrice * (discountValue / 100);
        //console.log("Calculated Sale Price (Percentage Discount):", salePrice);
      } else if (discount.discount_type === "currency") {
        salePrice = regularPrice - discountValue;
        //console.log("Calculated Sale Price (Currency Discount):", salePrice);
      }

      // Ensure sale price does not go below zero
      salePrice = Math.max(salePrice, 0);
      //console.log("Final Sale Price (After Zero Check):", salePrice);

      // Update formData with the calculated sale_price
      setFormData((prevData) => ({
        ...prevData,
        sale_price: salePrice,
      }));
    } else {
      //console.log("Discount not applicable. Clearing sale_price.");
      setFormData((prevData) => ({
        ...prevData,
        sale_price: "",
      }));
    }
  };

  useEffect(() => {
    calculateSalePrice();
  }, [
    formData.regular_price,
    formData.discount.is_discountable,
    formData.discount.discount_type,
    formData.discount.discount_value,
  ]);

  const handleDiscountValueChange = (field, e) => {
    const { value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      discount: {
        ...prevData.discount,
        [field]: value,
      },
    }));
  };

  const handleManageStockChange = (e) => {
    // Check if 'e.target' exists
    if (e.target) {
      const { name, value } = e.target;

      // Check if updating radio buttons for stock status
      if (name === "stock_status") {
        //console.log("The Stock_Status has been called");
        setFormData((prevState) => ({
          ...prevState,
          manage_stock: {
            ...prevState.manage_stock,
            stock_status: value,
          },
        }));
        //console.log("stock_status:", value);
      } else {
        setFormData((prevState) => ({
          ...prevState,
          manage_stock: {
            ...prevState.manage_stock,
            [name]: value,
          },
        }));
      }
    } else {
      // If 'e' does not have 'target', assume it’s directly the selected value from Dropdowncustom
      setFormData((prevState) => ({
        ...prevState,
        manage_stock: {
          ...prevState.manage_stock,
          location: e, // e is the selected value from Dropdowncustom
        },
      }));
    }
  };

  const handleStockCheckboxChange = (e) => {
    const { checked } = e.target; // Get the checkbox state
    const isStockManageValue = checked ? 1 : 0; // Convert to `1` or `0`

    setIsStockManagementChecked(checked); // Update local state

    setFormData((prevState) => ({
      ...prevState,
      manage_stock: {
        ...prevState.manage_stock,
        is_stock_manage: isStockManageValue, // Update `is_stock_manage`
        stock_status:
          isStockManageValue === 1
            ? "inStock"
            : prevState.manage_stock.stock_status,
      },
    }));
  };

  const handleCheckboxChange = (field, e) => {
    const { checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [field]: checked ? 1 : 0, // Set 1 for checked, 0 for unchecked
    }));
  };

  const handleProductTypeChange = (selectedValue) => {
    setSelectedProductType(selectedValue); // Update the selected dropdown option state
    setFormData((prevState) => ({
      ...prevState,
      type: selectedValue, // Update the `type` parameter in formData
    }));
  };

  /* --- Function for Handling Preparation of Product Data According to there Types & Status --- */
  // const handlePrdSubmit = (status) => {
  //   console.log("Submit button clicked...");

  //   const isVariableType = formData.type === "variable";

  //   // const defaultAttribute = isVariableType
  //   //   ? formData.variations.find((variation) => variation.defaultcheck)
  //   //       ?.attributes || []
  //   //   : formData.attributes;

  //   // const image = isVariableType
  //   //   ? formData.variations.find((variation) => variation.defaultcheck)
  //   //       ?.image || productimage
  //   //   : productimage;

  //   // const images = isVariableType
  //   //   ? formData.variations.find((variation) => variation.defaultcheck)
  //   //       ?.images || galleryImages
  //   //   : galleryImages;

  //   const defaultAttribute = isVariableType && Array.isArray(formData.variations)
  //     ? formData.variations.find((variation) => variation.defaultcheck)?.attributes || []
  //     : formData.attributes;

  //   const image = isVariableType && Array.isArray(formData.variations)
  //     ? formData.variations.find((variation) => variation.defaultcheck)?.image || productimage
  //     : productimage;

  //   const images = isVariableType && Array.isArray(formData.variations)
  //     ? formData.variations.find((variation) => variation.defaultcheck)?.images || galleryImages
  //     : galleryImages;

  //   const defaultVariation = isVariableType
  //     ? formData.variations.find((variation) => variation.defaultcheck)?.uid || null
  //     : null;
    
  //     // if (isVariableType) {
  //   //   formData.variations = formData.variations.map((variation) => ({
  //   //     ...variation,
  //   //     weight_dimension: formData.weight_dimension,
  //   //     collection: selectedProducts,
  //   //     tags: formData.tags,
  //   //     may_also_need: needProducts,
  //   //     related_products: relatedProducts,
  //   //     status: status,
  //   //     enable_review: formData.enable_review,
  //   //     featured: formData.featured,
  //   //     is_default_variation: variation.is_default === 1 ? 1 : 0,
  //   //     menu_order: formData.menu_order,
  //   //     purchase_note: formData.purchase_note,
  //   //     deal_of_month: formData.deal_of_month,
  //   //     best_selling_product: formData.best_selling_product,
  //   //     sold_individually: formData.sold_individually,
  //   //   }));
  //   // }

  //   if (isVariableType && Array.isArray(formData.variations)) {
  //     formData.variations = formData.variations.map((variation) => ({
  //       ...variation,
  //       // weight_dimension: formData.weight_dimension,
  //       collection: selectedProducts,
  //       tags: formData.tags,
  //       may_also_need: needProducts,
  //       related_products: relatedProducts,
  //       status: status,
  //       enable_review: formData.enable_review,
  //       featured: formData.featured,
  //       is_default_variation: variation.is_default === 1 ? 1 : 0,
  //       menu_order: formData.menu_order,
  //       purchase_note: formData.purchase_note,
  //       // short_description: formData.short_description,
  //       deal_of_month: formData.deal_of_month,
  //       best_selling_product: formData.best_selling_product,
  //       sold_individually: formData.sold_individually,
  //     }));
  //   }    

  //   const payload = {
  //     ...formData,
  //     default_variation: defaultVariation,
  //     tags: tagselect,
  //     status: status,
  //     collection: selectedProducts,
  //     related_products: relatedProducts,
  //     may_also_need: needProducts,
  //     default_attributes: defaultAttribute,
  //     image,
  //     images,
  //   };

  //   if (isVariableType) {
  //     payload.variations = formData.variations.map((variation) => ({
  //       ...variation,
  //       is_default_variation: variation.is_default === 1 ? 1 : 0,
  //     }));
  //   }

  //   if (isEdit) {
  //     console.log("Editing product...");
  //     payload.productId = isEditID;
  //     submitEditAPI(payload);
  //   } else {
  //     console.log("Adding new product...");
  //     submitToAPI(payload);
  //   }
    
  // };

  const handlePrdSubmit = async (status) => {
      console.log("Submit button clicked...");
      setIsLoading(true); // Start loading

      const isVariableType = formData.type === "variable";

      const defaultAttribute = isVariableType && Array.isArray(formData.variations)
        ? formData.variations.find((variation) => variation.defaultcheck)?.attributes || []
        : formData.attributes;

      const image = isVariableType && Array.isArray(formData.variations)
        ? formData.variations.find((variation) => variation.defaultcheck)?.image || productimage
        : productimage;

      const images = isVariableType && Array.isArray(formData.variations)
        ? formData.variations.find((variation) => variation.defaultcheck)?.images || galleryImages
        : galleryImages;

      const defaultVariation = isVariableType
        ? formData.variations.find((variation) => variation.defaultcheck)?.uid || null
        : null;

      if (isVariableType && Array.isArray(formData.variations)) {
        formData.variations = formData.variations.map((variation) => ({
          ...variation,
          collection: selectedProducts,
          tags: formData.tags,
          dimension_image: dimensionalimage,
          may_also_need: needProducts,
          related_products: relatedProducts,
          description: formData.description,
          status: status,
          enable_review: formData.enable_review,
          featured: formData.featured,
          is_default_variation: variation.is_default === 1 ? 1 : 0,
          menu_order: formData.menu_order,
          purchase_note: formData.purchase_note,
          deal_of_month: formData.deal_of_month,
          best_selling_product: formData.best_selling_product,
          sold_individually: formData.sold_individually,
        }));
      }

      const payload = {
        ...formData,
        default_variation: defaultVariation,
        tags: tagselect,
        product_tag: productTagSelect,
        sale_tag: saleTagSelect,
        status: status,
        collection: selectedProducts,
        product_features: formData.product_features,
        related_products: relatedProducts,
        may_also_need: needProducts,
        default_attributes: defaultAttribute,
        dimension_image: dimensionalimage,
        image,
        images,
      };

      if (isVariableType) {
        payload.variations = formData.variations.map((variation) => ({
          ...variation,
          is_default_variation: variation.is_default === 1 ? 1 : 0,
        }));
      }

      try {
        if (isEdit) {
          console.log("Editing product...");
          payload.productId = isEditID;
          await submitEditAPI(payload);
        } else {
          console.log("Adding new product...");
          await submitToAPI(payload);
        }
      } catch (error) {
        console.error("Error submitting product:", error);
      } finally {
        setIsLoading(false); // Stop loading after API call completes
      }
  };
  
  /* --- Function to Handle Product Addition via API Call --- */
  const submitToAPI = async (payload) => {
    try {
      let successMessage = "Data has been saved successfully!";
      console.log("Sending payload to API:", payload);

      const response = await axios.post(
        `${Url}/api/v1/products/add`,
        payload
      );

      console.log("Submission successful:", response.data);

      resetForm(); // Reset the form immediately

      setToastMessage(successMessage);
      setShowMessage(true);

      // toast.success("Data has been saved successfully!", {
      //   onClose: () => navigate("/E-Commerce/All-Products"), // Navigate after notification closes
      // });
    
      setTimeout(() => {
        navigate("/E-Commerce/All-Products");
      }, 4000);
    
    } catch (error) {
      let errorMessage = "Something went wrong. Kindly check it carefully.";
      console.error("Error submitting:", error);
      // toast.error("Something went wrong. Kindly check it carefully.");
      setToastMessage(errorMessage);
      setShowMessage(true);
    }
  };

  /* --- Function to Handle Product Updation via API Call --- */
  const submitEditAPI = async (changes) => {
    try {
      let updateMessage = "Product update successfully!";
      console.log("Sending edit payload to API:", changes);

      const response = await axios.put(
        `${Url}/api/v1/products/edit`,
        changes
      );

      console.log("Updated submission successful:", response.data);
      
      resetForm(); // Reset the form immediately

      // toast.success("Data has been updated successfully!", {
      //   onClose: () => navigate("/E-Commerce/All-Products"), // Navigate after notification closes
      // });
    
      setToastMessage(updateMessage);
      setShowMessage(true);

      setTimeout(() => {
        navigate("/E-Commerce/All-Products");
      }, 4000);

    } catch (error) {
      console.error("Error updating:", error);
      let errorMessage = "Something went wrong. Kindly check it carefully.";
      // toast.error("Something went wrong. Kindly check it carefully.");
      setToastMessage(errorMessage);
      setShowMessage(true);
    }
  };

  /* --- For Fetching All Products from API Call via Hook to Handle Collection, Related Products & Need Product Fields --- */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${Url}/api/v1/products/get`
        );
        const data = response.data.products; // Adjust based on actual API structure
        const formattedProducts = data.map((product) => ({
          uid: product.uid,
          name: product.name,
        }));
        setProducts(formattedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // Set loading to false in both success and error cases
      }
    };

    fetchProducts();
  }, []);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //       setIsLoading(true); // Start loading before API call
  //       try {
  //           const response = await axios.get(`${Url}/api/v1/products/get`);
  //           const data = response.data.products; // Adjust based on actual API structure
  //           const formattedProducts = data.map((product) => ({
  //               uid: product.uid,
  //               name: product.name,
  //           }));
  //           setProducts(formattedProducts);
  //       } catch (error) {
  //           console.error("Error fetching products:", error);
  //       } finally {
  //           setIsLoading(false); // Stop loading in both success and error cases
  //       }
  //   };

  //     fetchProducts();
  // }, []);
  
  /* --- Function to Handle Selection & De-Selection of Collection Search & Select MultiField in Product Data --- */
  const handleProductMultiSelect = (productName, isRemoving = false) => {
    setSelectedProducts((prevSelectedUids) => {
      // Find the selected product by name to get the corresponding uid
      const product = products.find((p) => p.name === productName);
      const productUid = product ? product.uid : null;

      if (!productUid) return prevSelectedUids; // If no uid found, return previous state

      if (isRemoving) {
        // Remove the product by uid
        const updatedUids = prevSelectedUids.filter(
          (uid) => uid !== productUid
        );
        //console.log("Removing product UID:", productUid);
        //console.log("Updated selected UIDs after removal:", updatedUids);
        return updatedUids;
      } else {
        // Add the product uid if it's not already selected
        if (!prevSelectedUids.includes(productUid)) {
          const updatedUids = [...prevSelectedUids, productUid];
          //console.log("Adding product UID:", productUid);
          //console.log("Updated selected UIDs after addition:", updatedUids);
          return updatedUids;
        }
        return prevSelectedUids; // If already selected, don't add it again
      }
    });
  };

  /* --- Function to Handle Selection & De-Selection of Related Products Search & Select MultiField in Product Data --- */
  const handleRelatedProduct = (productName, isRemoving = false) => {
    setRelatedProducts((prevSelectedUids) => {
      const product = products.find((p) => p.name === productName);
      const productUid = product ? product.uid : null;

      if (!productUid) return prevSelectedUids;

      if (isRemoving) {
        const updatedUids = prevSelectedUids.filter(
          (uid) => uid !== productUid
        );
        //console.log("Removing product UID:", productUid);
        return updatedUids;
      } else {
        if (!prevSelectedUids.includes(productUid)) {
          const updatedUids = [...prevSelectedUids, productUid];
          //console.log("Adding product UID:", productUid);
          return updatedUids;
        }
        return prevSelectedUids;
      }
    });
  };

  /* --- Function to Handle Selection & De-Selection of Need Products Search & Select MultiField in Product Data --- */
  const handleNeedProduct = (productName, isRemoving = false) => {
    setNeedProducts((prevSelectedUids) => {
      const product = products.find((p) => p.name === productName);
      const productUid = product ? product.uid : null;

      if (!productUid) return prevSelectedUids;

      if (isRemoving) {
        const updatedUids = prevSelectedUids.filter(
          (uid) => uid !== productUid
        );
        //console.log("Removing product UID:", productUid);
        return updatedUids;
      } else {
        if (!prevSelectedUids.includes(productUid)) {
          const updatedUids = [...prevSelectedUids, productUid];
          //console.log("Adding product UID:", productUid);
          return updatedUids;
        }
        return prevSelectedUids;
      }
    });
  };

  /* --- Attribute Type Dropdown Options Selection For Swatch Section --- */
  const attributeTypeOptions = [
    { value: "default", label: "Default" },
    { value: "color", label: "Color" },
    { value: "image", label: "Image" },
    { value: "select", label: "Label" },
  ];

    /* --- Function to Handle Back Order Change --- */
    const handleBackOrderChange = (value) => {
      setFormData((prevState) => ({
        ...prevState,
        allow_back_order: value, // Update the allow_back_order value
      }));
    };

    useEffect(() => {
      if (rowRef.current) {
        const rowElement = rowRef.current;
  
        if (isDropdownOpen) {
          const scrollHeight = rowElement.scrollHeight; // Get full height including dropdown
          //console.log("scroll Height:", scrollHeight);
          rowElement.style.height = `${scrollHeight}px`;
        } else {
          rowElement.style.height = `auto`; // Collapse to 0 when closed
        }
      }
    }, [isDropdownOpen]); // Recalculate height when dropdown state changes
  
    const handleDropdownToggle = (isOpen) => {
      setIsDropdownOpen(isOpen);
    };

  /* --- Product Data - SideBar Item List for Single Product --- */
  const sidebarItems = [
    {
      id: "general",
      name: "General",
      fields: (
        <GeneralFields
          tags={tags}
          selectedTagType={selectedTagType}
          selectedProductTagType={selectedProductTagType}
          selectedSaleTagType={selectedSaleTagType}
          selectedTags={selectedTags}
          selectedProductTags={selectedProductTags}
          selectedSaleTags={selectedSaleTags}
          SaleOptions={SaleOptions}
          taxTypeOptions={taxTypeOptions}
          taxClassOptions={taxClassOptions}
          handleChangeTaxStatus={handleChangeTaxStatus}
          handleMultiSelect={handleTagSelect}
          handleProductTagSelect={handleProductTagSelect}
          handleSaleTagSelect={handleSaleTagSelect}
          selectedSale={selectedSale}
          selectedTaxStatus={selectedTaxStatus}
          selectedTaxClass={selectedTaxClass}
          formData={formData}
          handleInputChange={handleInputChange}
          handleDiscountValueChange={handleDiscountValueChange}
          handleChangeSale={handleChangeSale}
          isEdit={isEdit}
          isViewMode={isViewMode}
        />
      ),
    },
    {
      id: "inventory",
      name: "Inventory",
      fields: (
        <InventoryFields
          locationsOptions={locationsOptions}
          isStockManagementChecked={isStockManagementChecked}
          formData={formData}
          handleInputChange={handleInputChange}
          handleManageStockChange={handleManageStockChange}
          handleStockCheckboxChange={handleStockCheckboxChange}
          handleBackOrderChange={handleBackOrderChange}
          isViewMode={isViewMode}
        />
      ),
    },
    // {
    //   id: "shipping",
    //   name: "Shipping",
    //   fields: (
    //     <ShippingFields
    //       shippingClassOptions={shippingClassOptions}
    //       handleChangeShippingClass={handleChangeShippingClass}
    //       selectedShippingClass={selectedShippingClass}
    //       isViewMode={isViewMode}
    //     />
    //   ),
    // },
    {
      id: "linkedproducts",
      name: "Linked Products",
      fields: (
        <LinkedProducts
          collectionsList={collectionsList}
          handleProductMultiSelect={handleProductMultiSelect}
          selectedProducts={selectedProducts}
          products={products}
          handleRelatedProduct={handleRelatedProduct}
          relatedProducts={relatedProducts}
          handleNeedProduct={handleNeedProduct}
          needProducts={needProducts}
          productData={productData}
          isEdit={isEdit}
          selectedProductNames={selectedProductNames}
          needProductNames={needProductNames}
          relatedProductNames={relatedProductNames}
          isViewMode={isViewMode}
        />
      ),
    },
    {
      id: "features",
      name: "Features",
      fields: (
        <FeaturesFields
          handleSingleSaveFeatures={handleSingleSaveFeatures}
          getFeatures={getFeatures}
          selectedFeatures={selectedFeatures}
          handleSingleFeatureSelect={handleSingleFeatureSelect}
          handleDeleteFeature={handleDeleteFeature}
          isViewMode={isViewMode}
          isEditMode={isEditMode}
          isActive={isActive}
          handleFeatureSelectWithState={handleFeatureSelectWithState} 
          hasSelectedFeatures={hasSelectedFeatures}
          isLoading={isLoading}
        />
      ),
    },
    {
      id: "attributes",
      name: "Attributes",
      fields: (
        <AttributesFields
          handleSingleSaveAttributes={handleSingleSaveAttributes}
          attributes={attributes}
          selectedAttributes={selectedAttributes}
          handleAttributeSelect={handleAttributeSelect}
          handleMultiSelect={handleSingleSelect}
          handleDeleteAttribute={handleDeleteAttribute}
          isViewMode={isViewMode}
          isActive={isActive}
          handleAttributeSelectWithState={handleAttributeSelectWithState}
          hasSelectedAttributes={hasSelectedAttributes}
          isLoading={isLoading}
        />
      ),
    },
    {
      id: "advanced",
      name: "Advanced",
      fields: (
        <Advanced handleInputChange={handleInputChange} formData={formData} isViewMode={isViewMode} />
      ),
    },
    // {
    //   id: "facebook",
    //   name: "Facebook",
    //   fields: (
    //     <InventoryFields
    //       locationsOptions={locationsOptions}
    //       handleChangeLocations={handleChangeLocations}
    //       selectedLocations={selectedLocations}
    //       isStockManagementChecked={isStockManagementChecked}
    //       setIsStockManagementChecked={setIsStockManagementChecked}
    //       handleStockManagementChange={handleStockManagementChange}
    //       formData={formData}
    //       handleInputChange={handleInputChange}
    //       handleManageStockChange={handleManageStockChange}
    //       handleStockCheckboxChange={handleStockCheckboxChange}
    //     />
    //   ),
    // },
    {
      id: "swatches",
      name: "Swatches",
      fields: (
        <SwatchFields
          setActiveIndex={setActiveIndex}
          activeIndex={activeIndex}
          handleOptionValueChange={handleOptionValueChange}
          renderOptionContent={renderOptionContent}
          handleSwatchSubmit={handleSwatchSubmit}
          handleInputChange={handleInputChange}
          selectedAttributeType={selectedAttributeType}
          setSelectedAttributeType={setSelectedAttributeType}
          attributeTypeOptions={attributeTypeOptions}
          handleTypeChange={handleTypeChange}
          accordionsData={accordionsData}
          // accordionsData={accordionsData || []}
          setAccordionsData={setAccordionsData}
          isViewMode={isViewMode}
          isActive={isActive}
          isLoading={isLoading}
          isSwatchBtn={isSwatchBtn}
        />
      ),
    },
  ];

  /* --- Product Data - SideBar Item List for Variable Product --- */
  const variableSidebarItems = [
    {
      id: "general",
      name: "General",
      fields: (
        <VariableGeneralFields
          taxTypeOptions={taxTypeOptions}
          taxClassOptions={taxClassOptions}
          formData={formData}
          handleInputChange={handleInputChange}
          tags={tags}
          selectedTagType={selectedTagType}
          selectedProductTagType={selectedProductTagType}
          selectedSaleTagType={selectedSaleTagType}
          selectedProductTags={selectedProductTags}
          selectedSaleTags={selectedSaleTags}
          selectedTags={selectedTags}
          handleMultiSelect={handleTagSelect}
          handleProductTagSelect={handleProductTagSelect}
          handleSaleTagSelect={handleSaleTagSelect}
          isEdit={isEdit}
          isViewMode={isViewMode}
        />
      ),
    },
    {
      id: "inventory",
      name: "Inventory",
      fields: (
        <VariableInventoryFields
          locationsOptions={locationsOptions}
          isStockManagementChecked={isStockManagementChecked}
          formData={formData}
          handleInputChange={handleInputChange}
          handleManageStockChange={handleManageStockChange}
          handleStockCheckboxChange={handleStockCheckboxChange}
          isViewMode={isViewMode}
        />
      ),
    },
    // {
    //   id: "shipping",
    //   name: "Shipping",
    //   fields: (
    //     <VariableShippingFields
    //       shippingClassOptions={shippingClassOptions}
    //       handleChangeShippingClass={handleChangeShippingClass}
    //       selectedShippingClass={selectedShippingClass}
    //       isViewMode={isViewMode}
    //     />
    //   ),
    // },
    {
      id: "linkedproducts",
      name: "Linked Products",
      fields: (
        <VariableLinkedProducts
          collectionsList={collectionsList}
          handleProductMultiSelect={handleProductMultiSelect}
          selectedProducts={selectedProducts}
          products={products}
          handleRelatedProduct={handleRelatedProduct}
          relatedProducts={relatedProducts}
          handleNeedProduct={handleNeedProduct}
          needProducts={needProducts}
          isViewMode={isViewMode}
        />
      ),
    },
    {
      id: "features",
      name: "Features",
      fields: (
        <FeaturesFields
          handleSingleSaveFeatures={handleSingleSaveFeatures}
          getFeatures={getFeatures}
          selectedFeatures={selectedFeatures}
          handleSingleFeatureSelect={handleSingleFeatureSelect}
          handleDeleteFeature={handleDeleteFeature}
          isViewMode={isViewMode}
          isEditMode={isEditMode}
          isActive={isActive}
          handleFeatureSelectWithState={handleFeatureSelectWithState}
          hasSelectedFeatures={hasSelectedFeatures}
          isLoading={isLoading}
        />
      ),
    },
    {
      id: "attributes",
      name: "Attributes",
      fields: (
        <VariableAttributesFields
          handleSaveAttributes={handleSaveAttributes}
          attributes={attributes}
          selectedAttributes={selectedAttributes}
          handleAttributeSelect={handleAttributeSelect}
          handleMultiSelect={handleMultiSelect}
          handleDeleteAttribute={handleDeleteAttribute}
          isViewMode={isViewMode}
          isClicked={isClicked}
          handleSelectAll={handleSelectAll}
          handleButtonClick={handleButtonClick}
          setIsDropdownOpen={setIsDropdownOpen}
          isDropdownOpen={isDropdownOpen}
          handleDropdownToggle={handleDropdownToggle}
          rowRef={rowRef}
          isActive={isActive}
          handleAttributeSelectWithState={handleAttributeSelectWithState}
          hasSelectedAttributes={hasSelectedAttributes}
          isLoading={isLoading}
        />
      ),
    },
    {
      id: "variations",
      name: "Variations",
      fields: (
        <VariableVariationsFields
          additionalImages={additionalImages}
          setAdditionalImages={setAdditionalImages}
          singleImage={singleImage}
          setSingleImage={setSingleImage}
          variableTaxTypeOptions={variableTaxTypeOptions}
          variableTaxClassOptions={variableTaxClassOptions}
          handleVariationSubmit={handleVariationSubmit}
          handleVariationChange={handleVariationChange}
          handleChangeTaxStatus={handleChangeTaxStatus}
          variations={variations}
          generateVariationNumber={generateVariationNumber}
          saleOptions={SaleOptions}
          selectedSale={selectedSale}
          selectedTaxStatus={selectedTaxStatus}
          selectedTaxClass={selectedTaxClass}
          shippingClassOptions={shippingClassOptions}
          handleChangeShippingClass={handleChangeShippingClass}
          selectedShippingClass={selectedShippingClass}
          isEdit={isEdit}
          isViewMode={isViewMode}
          isVariationBtn={isVariationBtn}
          isLoading={isLoading}
          isActive={isActive}
          handleAccordionToggle={handleAccordionToggle}
          activeAccordion={activeAccordion}
        />
      ),
    },
    {
      id: "advanced",
      name: "Advanced",
      fields: (
        <VariableAdvanceFields
          handleInputChange={handleInputChange}
          formData={formData}
          isViewMode={isViewMode}
        />
      ),
    },
    {
      id: "swatches",
      name: "Swatches",
      fields: (
        <VariableSwatchFields
          handleOptionValueChange={handleOptionValueChange}
          renderOptionContent={renderOptionContent}
          handleSwatchSubmit={handleSwatchSubmit}
          handleInputChange={handleInputChange}
          selectedAttributeType={selectedAttributeType}
          setSelectedAttributeType={setSelectedAttributeType}
          attributeTypeOptions={attributeTypeOptions}
          handleTypeChange={handleTypeChange}
          accordionsData={accordionsData}
          setAccordionsData={setAccordionsData}
          setActiveIndex={setActiveIndex}
          activeIndex={activeIndex}
          isViewMode={isViewMode}
          isActive={isActive}
          isLoading={isLoading}
          isSwatchBtn={isSwatchBtn}
        />
      ),
    },
  ];

  /* --- Function for Rendering Single Product in `Product Data - Body` Content Section --- */
  const renderFields = () => {
    const selected = sidebarItems.find((item) => item.id === selectedItem);
    return selected ? (
      selected.fields
    ) : (
      <>
        <div className="Empty-Swatch-Status">
          <div className="no-swatch-container">
            <div className="no-swatch-message-1">Please select an option from the menu</div>
          </div>
        </div>
      </>
    );
  };

  /* --- Function for Rendering Variable Product in `Product Data - Body` Content Section --- */
  const renderVariableFields = () => {
    const selected = variableSidebarItems.find(
      (item) => item.id === selectedItem
    );
    return selected ? (
      selected.fields
    ) : (
      <>
        <div className="Empty-Swatch-Status">
          <div className="no-swatch-container">
            <div className="no-swatch-message-1">Please select an option from the menu</div>
          </div>
        </div>
      </>
    );
  };

  /* --- Function to Handle Selection of View in SEO Section (Web or Desktop) --- */ 
  const handleChange = (view) => {
    if (view === "Mobile") {
      setIsMobileAnimating(true); // Trigger Mobile animation
      setTimeout(() => setIsMobileAnimating(false), 300); // Reset after 300ms
    } else if (view === "Web") {
      setIsWebAnimating(true); // Trigger Web animation
      setTimeout(() => setIsWebAnimating(false), 300); // Reset after 300ms
    }
    setSelectedView(view); // Set the selected view
  };

  /* --- Function to Get Categories via API Call and Update State By Using Hook --- */
  
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${Url}/api/v1/productCategory/get`
      );
      const data = await response.json();

      //console.log("Fetched Category Data:", data);

      if (!data || !data.categories) {
        console.error("No categories found in the response data");
        return;
      }

      // Organize categories into main and subcategories
      const mainCategories = [];
      const subCategories = {};

      data.categories.forEach((category) => {
        if (category.parent === 0) {
          mainCategories.push({
            ...category,
            subcategories: [], // Initialize empty subcategories array
          });
        } else {
          if (!subCategories[category.parent]) {
            subCategories[category.parent] = [];
          }
          subCategories[category.parent].push(category);
        }
      });

      // Attach subcategories to each main category
      mainCategories.forEach((mainCategory) => {
        if (subCategories[mainCategory.uid]) {
          mainCategory.subcategories = subCategories[mainCategory.uid];
        }
      });

      setCategories(mainCategories); // Store categories with UIDs in state
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* --- Function to Handle Selection & De-Selection of Categories in Category Accordion --- */
  const handleCategorySelect = (categoryName) => {
    setFormData((prevData) => {
      const updatedCategories = [...prevData.categories];
      const category = categories.find((cat) => cat.name === categoryName);
      const categoryIndex = updatedCategories.findIndex(
        (cat) => cat.name === categoryName
      );

      if (categoryIndex >= 0) {
        updatedCategories.splice(categoryIndex, 1); // Remove if selected
      } else if (category) {
        updatedCategories.push({
          uid: category.uid, // Use the UID from the fetched data
          name: category.name,
          slug: generateSlug(category.name),
          is_main: 0, // Default value
        });
      }

      return {
        ...prevData,
        categories: updatedCategories,
      };
    });
  };

  /* --- Function to Handle Selection & De-Selection of Sub-Categories in Category Accordion --- */
  const handleSubCategorySelect = (categoryName, subcategoryName) => {
    setFormData((prevData) => {
      const updatedCategories = [...prevData.categories];
      const category = categories.find((cat) => cat.name === categoryName);
      const subcategory = category?.subcategories?.find(
        (sub) => sub.name === subcategoryName
      );
      const subCategoryIndex = updatedCategories.findIndex(
        (cat) => cat.name === subcategoryName
      );

      if (subCategoryIndex >= 0) {
        updatedCategories.splice(subCategoryIndex, 1); // Remove if selected
      } else if (subcategory) {
        updatedCategories.push({
          uid: subcategory.uid, // Use the UID from the fetched data
          name: subcategory.name,
          slug: generateSlug(subcategory.name),
        });
      }

      return {
        ...prevData,
        categories: updatedCategories,
      };
    });
  };

  /* --- Function to Handle Rendering of Sub-Categories in Category Accordion --- */
  const renderSubcategories = (category) => {
    if (!category.subcategories || category.subcategories.length === 0)
      return null;

    return (
      <div className="subcategory-list">
        {category.subcategories.map((subcategory) => (
          <div className="subcategory-item">
            <input
              type="checkbox"
              disabled={isViewMode}
              id={`subcategory-${subcategory.uid}`}
              checked={formData.categories.some(
                (cat) => cat.name === subcategory.name
              )}
              onChange={() =>
                handleSubCategorySelect(category.name, subcategory.name)
              }
              className="AddCheckedBoxes"
            />
            <label htmlFor={`subcategory-${subcategory.uid}`}>{subcategory.name}</label>
          </div>
        ))}
      </div>
    );
  };

  /* --- Function to Remove an Image Based On Its Index in Product Gallery Accordion --- */
  const cancelGalleryImage = (index) => {
    setGalleryImages((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1); // Remove image at the specific index
      return newImages;
    });
  };

  /* --- Function to Allow Only 3-Images Per Row in Product Gallery Accordion  --- */
  const chunkArray = (array, chunkSize) => {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  };

  /* --- Function to Render Images in Product Gallery Accordion  --- */
  const renderGalleryImages = () => {
    const rows = chunkArray(galleryImages, 3);
    return rows.map((row, rowIndex) => (
      <div key={rowIndex} className="gallery-row">
        {row.map((image, colIndex) => {
          const originalIndex = rowIndex * 3 + colIndex; // Calculate the original index
          return (
            <div key={originalIndex} className="gallery-image-wrapper">
              <img
                src={`${Url+image.image_url}`}
                alt={`Gallery ${originalIndex}`}
                className="image-preview-gallery"
              />
              {!isViewMode && (
              <button
                onClick={() => cancelGalleryImage(originalIndex)} // Use original index here
                className="cancel-button"
              >
                X
              </button>
              )}
            </div>
          );
        })}
      </div>
    ));
  };

  const uploadImageToBackend = async (files, imageType) => {
    const formData = new FormData();

    if (imageType === "productImage") {
      formData.append("image", files[0]);
    } else if (imageType === "dimensionalImage") {
      formData.append("image", files[0]);
    } else if (imageType === "galleryImages") {
      files.forEach((file, index) => {
        formData.append(`galleryImage_${index}`, file);
      });
    }

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      //console.log(`${imageType} uploaded successfully:`, response.data);
    } catch (error) {
      console.error(`Error uploading ${imageType}:`, error);
    }
  };

  /* --- Function to Remove an Image in Product Image Accordion --- */
  const cancelProductImage = () => {
    setProductImage(null);
  };

  /* --- Function to Remove an Dimension Image --- */
  const cancelDimensionImage = () => {
    setDimensionalImage(null);
  };

  /* --- Function to Handle Main Category Starred Selection --- */
  const toggleMainCategory = (categoryName) => {
    setFormData((prevData) => {
      const updatedCategories = prevData.categories.map((cat) =>
        cat.name === categoryName
          ? { ...cat, is_main: cat.is_main === 1 ? 0 : 1 }
          : { ...cat, is_main: 0 } // Ensure only one `is_main` at a time
      );
  
      return {
        ...prevData,
        categories: updatedCategories,
      };
    });
  };

  /* --- Add Product Right Side Accordions --- */  
  const accordionItems = [
    {
      title: "Publish",
      content: (
        <div className="PublishContainer">
          {/* <div className="StartContainer">
            <div>
              <CustomBtn
                label="Save Draft"
                withIcon={false}
                disabled={false}
                className="DraftBtn"
                // onClick={handleImport}
                onClick={() => handlePrdSubmit("draft")}
                type="button"
              />
            </div>
            <div>
              <CustomBtn
                label="Preview"
                withIcon={false}
                disabled={false}
                className="PreviewBtn"
                // onClick={handleExport}
                type="button"
              />
            </div>
          </div> */}
          <div className="StartContainer">
            {/* Draft Button */}
              <div>
                {isViewMode ? (
                  <div>
                    <CustomBtn
                      label="Edit Product"
                      withIcon={false}
                      disabled={false}
                      className="ProductEditBtn"
                      onClick={() => handleEditNavigation()} 
                      type="button"
                    />
                  </div>
                ) : (
                  <div>
                    <CustomBtn
                      label={isLoading ? <div className="btn-loader-Draft"></div> : "Save Draft" }
                      withIcon={false}
                      disabled={isLoading} // Draft button is enabled when not in view mode
                      className="DraftBtn"
                      onClick={() => handlePrdSubmit("draft")}
                      type="button"
                    />
                  </div>
                )}
              </div>
            
            {/* Preview Button or Edit Product Button */}
            <div>
            {/* {!isViewMode && (
                <CustomBtn
                  label="Preview"
                  withIcon={false}
                  disabled={false} // Preview button is enabled when not in view mode
                  className="PreviewBtn"
                  // onClick={handlePreview}
                  type="button"
                />
            )} */}
            {!isEditMode && !isViewMode ? (
              <CustomBtn
                label="Preview"
                withIcon={false}
                disabled={false}
                className="PreviewBtn"
                // onClick={handlePreview}
                type="button"
              />
            ) : (
              <CustomBtn
                label={isViewMode ? "Cancel View" : "Cancel Edit"} // Dynamic label
                withIcon={false}
                disabled={false}
                className={isViewMode ? "CancelBtn-1" : "CancelBtn"}
                onClick={handleCancel}
                type="button"
              />
            )}
            </div>
          </div>
          <div className="MidContainer">
            <div className="MidRowsData">
              <div className="RowContent">
                <img
                  src={imageStatus}
                  alt="Description"
                  className="ImageStyle"
                />
                <span className="TextStyle1">Status:</span>
                <span className="TextStyle2">{productStatus}</span>
              </div>
              <div>
                <PiNotePencil className="NoteIcon" />
              </div>
            </div>
            <div className="MidRowsData">
              <div className="RowContent">
                <img
                  src={imageVisibility}
                  alt="Description"
                  className="ImageStyle"
                />
                <span className="TextStyle1">Visibility:</span>
                <span className="TextStyle2">{productVisibility}</span>
              </div>
              <div>
                <PiNotePencil className="NoteIcon" />
              </div>
            </div>
            <div className="MidRowsData">
              <div className="RowContent">
                <img
                  src={imagePublish}
                  alt="Description"
                  className="ImageStyle"
                />
                <span className="TextStyle1">Publish date:</span>
                <span className="TextStyle2">{productPublishedStatus}</span>
              </div>
              <div>
                <PiNotePencil className="NoteIcon" />
              </div>
            </div>
            {/* <div className="MidRowsData">
              <div className="RowContent">
                <img src={imageSEO} alt="Description" className="ImageStyle" />
                <span className="TextStyle1">SEO:</span>
                <span className="TextStyle2">Not Available</span>
              </div>
              <div>
                <PiNotePencil className="NoteIcon" />
              </div>
            </div>
            <div className="MidRowsData">
              <div className="RowContent">
                <img
                  src={imageVisibility}
                  alt="Description"
                  className="ImageStyle"
                />
                <span className="TextStyle1">Catalog visibility:</span>
                <span className="TextStyle2">Shop & Search</span>
              </div>
              <div>
                <PiNotePencil className="NoteIcon" />
              </div>
            </div> */}
          </div>
          
          {/* <div className="EndContainer">
            <div>
              <CustomBtn
                label="Copy to a new draft"
                withIcon={false}
                disabled={false}
                className="DraftCopyBtn"
                // onClick={handleImport}
                type="button"
              />
            </div>
            <div>
              <CustomBtn
                label="Publish"
                withIcon={false}
                disabled={false}
                className="PublishBtn"
                // onClick={handleExport}
                onClick={() => handlePrdSubmit("published")}
                type="button"
              />
            </div>
          </div> */}
          {/* <CodepenBtn type={3} label="Publish" onClick={() => handlePrdSubmit("published")} /> */}
        
          <div className="EndContainer">
            {/* Copy to a new draft button */}
              <div>
              {!isViewMode && (
                <CustomBtn
                  label="Copy to a new draft"
                  withIcon={false}
                  disabled={false} // Enable the button when not in view mode
                  className="DraftCopyBtn"
                  // onClick={handleImport} // Define onClick handler if needed
                  type="button"
                />
              )}
              </div>
            
            {/* Publish button */}
              <div>
                {!isViewMode && (
                    <CustomBtn
                      // label="Publish"
                      label={
                        isLoading ? <div className="btn-loader-Publish"></div> : isEditMode ? "Update Product" : "Publish"
                      }
                      //label={isEditMode ? "Update Product" : "Publish"}
                      withIcon={false}
                      disabled={isLoading} // Enable the button when not in view mode
                      // className="PublishBtn"
                      className={isEditMode ? "ProductUpdateBtn" : "PublishBtn"} // Dynamic className
                      onClick={() => handlePrdSubmit("published")}
                      type="button"
                    />
                )}
              </div>
          </div>
        </div>
      ),
    },
    // {
    //   title: "Select Categories",
    //   content: (
    //     <div className="category-list">
    //       {categories &&
    //         categories.map((category) => (
    //           <div key={category.uid} className="main-category">
    //             <div className="category-item-heading-update">
    //               <div className="category-main">
    //               <input
    //                 type="checkbox"
    //                 disabled={isViewMode}
    //                 id={`main-category-${category.uid}`}
    //                 checked={formData.categories.some(
    //                   (cat) => cat.name === category.name
    //                 )}
    //                 onChange={() => handleCategorySelect(category.name)}
    //               />
    //               <label htmlFor={`main-category-${category.uid}`}>
    //                 {category.name}
    //               </label>
    //               </div>
    //               <div className="category-star" style={{
    //                   color: formData.starredCategory === category.name ? "blue" : "white",
    //                   cursor: "pointer" }}
    //                 onClick={() => handleStarCategory(category.name)}
    //               >
    //                 *
    //               </div>
    //             </div>

    //             {/* Render the subcategories within the main category */}
    //             {renderSubcategories(category)}
    //           </div>
    //         ))}
    //     </div>
    //   ),
    // },
    {
      title: "Select Categories",
      content: (
        // <div className="category-list">
        //   {categories &&
        //     categories.map((category) => (
        //       <div key={category.uid} className="main-category">
        //         <div className="category-item-heading-update">
        //           <div className="category-main">
        //             <input
        //               type="checkbox"
        //               disabled={isViewMode}
        //               id={`main-category-${category.uid}`}
        //               checked={formData.categories.some(
        //                 (cat) => cat.name === category.name
        //               )}
        //               onChange={() => handleCategorySelect(category.name)}
        //             />
        //             <label htmlFor={`main-category-${category.uid}`}>
        //               {category.name}
        //             </label>
        //           </div>
        //           <div
        //             className="category-star"
        //             style={{
        //               color: formData.categories.some(
        //                 (cat) => cat.name === category.name && cat.is_main === 1
        //               )
        //                 ? "blue"
        //                 : "white",
        //               cursor: "pointer",
        //             }}
        //             onClick={!isViewMode ? () => toggleMainCategory(category.name) : undefined}
        //           >
        //             *
        //           </div>
        //         </div>

        //         {/* Render the subcategories within the main category */}
        //         {renderSubcategories(category)}
        //       </div>
        //     ))}
        // </div>
        <div className="category-list">
          {categories &&
            categories.map((category) => (
              <div key={category.uid} className="main-category">
                <div className="category-item-heading-update">
                  <div className="category-main">
                    <input
                      type="checkbox"
                      disabled={isViewMode}
                      id={`main-category-${category.uid}`}
                      checked={formData.categories.some(
                        (cat) => cat.name === category.name
                      )}
                      onChange={() => handleCategorySelect(category.name)}
                    />
                    <label htmlFor={`main-category-${category.uid}`}>
                      {category.name}
                    </label>
                  </div>
                  <div
                    className="category-star"
                    style={{
                      color: formData.categories.some(
                        (cat) => cat.name === category.name && cat.is_main === 1
                      )
                        ? "blue"
                        : "white",
                      cursor: "pointer",
                    }}
                    onClick={
                      !isViewMode
                        ? () => toggleMainCategory(category.name, category.subcategories)
                        : undefined
                    }
                  >
                    {formData.categories.some(
                      (cat) => cat.name === category.name && cat.is_main === 1
                    )
                      ? "★"
                      : "☆"}
                  </div>
                </div>

                {/* Render the subcategories within the main category */}
                {renderSubcategories(category)}
              </div>
            ))}
        </div>
        // <div className="category-list">
        //   {categories &&
        //     categories.map((category) => (
        //       <div key={category.uid} className="main-category">
        //         <div className="category-item-heading-update">
        //           <div className="category-main">
        //             <input
        //               type="checkbox"
        //               disabled={isViewMode}
        //               id={`main-category-${category.uid}`}
        //               checked={formData.categories.some(
        //                 (cat) => cat.name === category.name
        //               )}
        //               onChange={() => handleCategorySelect(category.name)}
        //             />
        //             <label htmlFor={`main-category-${category.uid}`}>
        //               {category.name}
        //             </label>
        //           </div>
        //           <div
        //             className="category-star"
        //             style={{
        //               color: formData.categories.some(
        //                 (cat) => cat.name === category.name && cat.is_main === 1
        //               )
        //                 ? "blue"
        //                 : "white",
        //               cursor: "pointer",
        //             }}
        //             onClick={!isViewMode ? () => toggleMainCategory(category.name) : undefined}
        //           >
        //             {formData.categories.some(
        //               (cat) => cat.name === category.name && cat.is_main === 1
        //             )
        //               ? "★" // Display a filled star when the category is marked as main
        //               : "☆"} {/* Empty star when not marked as main */}
        //           </div>
        //         </div>

        //         {/* Render the subcategories within the main category */}
        //         {renderSubcategories(category)}
        //       </div>
        //     ))}
        // </div>
      ),
    },
    // {
    //   title: "Selected Filters",
    //   content: (
    //     <div
    //       style={{
    //         fontFamily: "var(--font-family)",
    //         fontSize: "var(--font-size-small)",
    //       }}
    //     >
    //       This is the content of Selected Filters. The content can vary in size.
    //     </div>
    //   ),
    // },
    {
      title: "Product Image",
      content: (
        <div className="banner-upload">
          {productimage ? (
            <div className="image-preview-wrapper">
              <img
                src={`${Url+productimage.image_url}`} // Adjust path if necessary
                alt="Thumbnail"
                className="image-preview"
              />
              {!isViewMode && (
              <button onClick={cancelProductImage} className="cancel-button">
                X
              </button>
              )}
            </div>
          ) : (
            <label
              htmlFor="productImage"
              className="uploadAdd-label"
              onClick={() => handleGalleryModalOpen("product-image")}
            >
              <div className="Addupload-button">
                <IoImageOutline size={45} color="#555" className="uploaded-image" />
                <span className="uploadAdd-text">Click to Upload Image</span>
              </div>
            </label>
          )}
          <ImageGalleryPopup
            showImageGalleryPopUp={modalView}
            handleModalView={handleModalViewClose}
            handleFileChange={handleFileChange}
            onImageSelect={handleImageSelect}
            index={activeIndex}
            imageSendPayload={imageSendPayload}
            setImageSendPayload={setImageSendPayload}
            alt_text={imageSendPayload.alt_text}
            title={imageSendPayload.title}
            data={data}
          />
        </div>
      ),
    },
    {
      title: "Product Gallery",
      content: (
        <div className="Gallerybanner-uploadhorizontally">
          {galleryImages.length > 0 ? renderGalleryImages() : null}
          {!isViewMode && (
          <label htmlFor="galleryImages" className="uploadGallery-label">
            <div
              className="Galleryupload-button"
              onClick={() => handleGalleryModalOpen("gallery-upload")}
            >
              <IoImageOutline size={45} color="#555" className="Galleryuploaded-image" />
              <span className="uploadGallery-text">
                {galleryImages.length > 0
                  ? "Upload More Images"
                  : "Click to Upload Image"}
              </span>
            </div>
            <span className="uploadGallery-text-row">
              Note:
              <br />
              The aspect ratio of the image should be 3:2
            </span>
          </label>
          )}
        </div>
      ),
    },
    {
      title: "Dimensional Image",
      content: (
        <div className="banner-upload">
          {dimensionalimage ? (
                <div className="image-preview-wrapper">
                  {/*{console.log("Dimensional Image is:", dimensionalimage?.image_url)}*/}
                  <img
                    src={`${Url + dimensionalimage?.[0]?.image_url}`} // Adjust path if necessary
                    alt="Thumbnail"
                    className="dimensional-image-preview"
                  />
                  {!isViewMode && (
                  <button onClick={cancelDimensionImage} className="cancel-button">
                    X
                  </button>
                  )}
                </div>
          ) : (
                <label
                  htmlFor="dimensionalimage"
                  className="uploadAdd-label"
                  onClick={() => handleGalleryModalOpen("dimensional-image")}
                >
                  <div className="Addupload-button">
                    <IoImageOutline size={45} color="#555" className="uploaded-image" />
                    <span className="uploadAdd-text">Click to Upload Image</span>
                  </div>
                </label>
          )}
          <ImageGalleryPopup
          showImageGalleryPopUp={modalView}
                handleModalView={handleModalViewClose}
                handleFileChange={handleFileChange}
                onImageSelect={handleImageSelect}
                index={activeIndex}
                imageSendPayload={imageSendPayload}
                setImageSendPayload={setImageSendPayload}
                alt_text={imageSendPayload.alt_text}
                title={imageSendPayload.title}
          data={data}
          />
        </div>
      ),
    },
    {
      title: "Trending Products",
      content: (
        <div
          style={{
            fontFamily: "var(--font-family)",
            fontSize: "var(--font-size-small)",
          }}
        >
          <div className="checkbox-container-trending">
            <div className="MonthDeals">
              <label className={`checkbox-wrapper ${isViewMode && formData.deal_of_month === 1 ? "viewmode-checked" : ""}`}>
                <input
                  type="checkbox"
                  disabled={isViewMode}
                  checked={formData.deal_of_month === 1}
                  onChange={(e) => handleCheckboxChange("deal_of_month", e)}
                />
                <span className="custom-checkbox"></span>
                Deal of the Month
              </label>
            </div>
            <div className="BestSeller">
              <label className={`checkbox-wrapper ${isViewMode && formData.best_selling_product === 1 ? "viewmode-checked" : ""}`}>
                <input
                  type="checkbox"
                  disabled={isViewMode}
                  checked={formData.best_selling_product === 1}
                  onChange={(e) => handleCheckboxChange("best_selling_product", e)}
                />
                <span className="custom-checkbox"></span>
                Best Selling Product
              </label>
            </div>
            <div className="isFeatured">
              <label className={`checkbox-wrapper ${isViewMode && formData.featured === 1 ? "viewmode-checked" : ""}`}>
                <input
                  type="checkbox"
                  disabled={isViewMode}
                  checked={formData.featured === 1}
                  onChange={(e) => handleCheckboxChange("featured", e)}
                />
                <span className="custom-checkbox"></span>
                Featured Product
              </label>
            </div>
          </div>
        </div>
      ),
    },
  ];

  /* --- Product Type Selection Dropdown Item --- */
  const productTypeOptions = [
    { value: "simple", label: "Simple" },
    { value: "variable", label: "Variable" },
  ];

  /* --- Jodit Editor Configuration --- */
  const configEditor = {
    buttons: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "paragraph",
      "fontsize",
      "lineHeight",
      "|",
      "ul",
      "ol",
      "|",
      "link",
      "image",
      "|",
      "align",
      "undo",
      "redo",
    ],
    style: {
      fontFamily: "var(--font-family)",
      fontSize: "var(--font-size-small)",
      lineHeight: "1.6",
      color: "var(--text-color-1)",
    },
    toolbarAdaptive: false, // Disable toolbar adaptation
    toolbarSticky: false, // Disable sticky toolbar
  };

  return (
    <div className="AddProductPage">
      
      {/* --- Loader Implementation --- */}
      {(isLoading || loading) && (
        <div className="backdrop">
          <div className="loader-container">
            <MainLoader />
          </div>
        </div>
      )}

      {/* --- Body Left Side Content --- */}
      <div className="PageLeftSide">
        <div className="ProductDescription">
          <div className="Row-1">
            <div style={{ width: "96%" }}>
              <label htmlFor="ProductName" className="DescriptionLabels">
                Product Name
              </label>
              <textarea
                id="name"
                name="name"
                disabled={isViewMode}
                value={formData.name}
                onChange={handleInputChange}
                className="productInput-1"
                placeholder="Cypress Bedroom Set in Gray"
              />
            </div>
          </div>

          <div className="Row-11">
            <label htmlFor="ProductDescription" className="DescriptionLabels-11">
              Description
            </label>
            <div className="Editor-Container">
              <div className="Editor-Tabs">
                  <div
                      className={`Tab ${selectedTab === 'Visual' ? 'active' : ''}`}
                      onClick={() => setSelectedTab("Visual")}
                  >
                      Visual
                  </div>
                  <div
                      className={`Tab ${selectedTab === 'Text' ? 'active' : ''}`}
                      onClick={() => setSelectedTab("Text")}
                  >
                      Text
                  </div>
              </div>
              <div className="Editor-Content">
                  {selectedTab === 'Visual' ? (
                    <JoditEditor
                      ref={editor}
                      value={formData.description}
                      tabIndex={1}
                      onBlur={handleEditorChange}
                      config={{
                        ...configEditor,
                        readonly: isViewMode, // Set read-only mode based on the flag
                      }}
                    />
                  ) : (
                    <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    readOnly={isViewMode} // Make the textarea read-only
                    onChange={handleInputChange}
                    className="Editor-Text-Area"
                    placeholder="Product Description"
                  />
                  )}
              </div>
            </div>
          </div>
        </div>

        <div className="ProductData">
          <div className="ProductData-Header">
            <div className="Data-Title">
              <label htmlFor="editor">Product Data</label>
            </div>
            <div className="Product-Type">
              <div className="custom-dropdown-wrapper">
                <Dropdownresize
                  options={productTypeOptions}
                  // selectedOption={selectedProductType}
                  selectedOption={
                    selectedProductType.charAt(0).toUpperCase() + selectedProductType.slice(1)
                  }
                  handleOptionChange={handleProductTypeChange}
                  isViewMode={isViewMode}
                />
              </div>
            </div>
            {/* <div className="Check-Selection">
              <div className="checkbox-container">
                <label htmlFor="virtual">Virtual</label>
                <input
                  type="checkbox"
                  id="virtual"
                  name="virtual"
                  onChange={(e) => handleInputChange(e, "checkbox", "virtual")}
                />
              </div>
              <div className="checkbox-container">
                <label htmlFor="downloadable">Downloadable</label>
                <input
                  type="checkbox"
                  id="downloadable"
                  name="downloadable"
                  onChange={(e) =>
                    handleInputChange(e, "checkbox", "downloadable")
                  }
                />
              </div>
            </div> */}
          </div>
          {/* Conditionally render the correct ProductData-Body */}
          {selectedProductType === "simple" && (
            <div className="ProductData-Body">
              <div className="Body-Sidebar">
                {/* Map through sidebar items */}
                {sidebarItems.map((item) => (
                  <div
                    key={item.id}
                    className={`Sidebar-Block ${
                      selectedItem === item.id ? "active" : ""
                    }`}
                    onClick={() => handleMenuClick(item.id)}
                  >
                    <div className="sidebar-item">{item.name}</div>
                  </div>
                ))}
              </div>
              <div className="Body-Content">{renderFields()}</div>
            </div>
          )}

          {selectedProductType === "variable" && (
            <div className="ProductData-Body">
              <div className="Body-Sidebar">
                {variableSidebarItems.map((item) => (
                  <div
                    key={item.id}
                    className={`Sidebar-Block ${
                      selectedItem === item.id ? "active" : ""
                    }`}
                    onClick={() => handleMenuClick(item.id)}
                  >
                    <div className="sidebar-item">{item.name}</div>
                  </div>
                ))}
              </div>
              <div className="Body-Content">{renderVariableFields()}</div>
            </div>
          )}
        </div>

        <div className="ShortDescription">
          <div className="ShortDescription-Header">
            <label htmlFor="editor">Weight & Dimension</label>
          </div>
          {/* <div className="WeightDimension-Area">
            <div className="Editor-Container-Short">
              {!showImageUpload && (
                <div className="Editor-Tabs">
                  <div
                    className={`Tab ${selectedDimensionTab === "Visual" ? "active" : ""}`}
                    onClick={() => setSelectedDimensionTab("Visual")}
                  >
                    Visual
                  </div>
                  <div
                    className={`Tab ${selectedDimensionTab === "Text" ? "active" : ""}`}
                    onClick={() => setSelectedDimensionTab("Text")}
                  >
                    Text
                  </div>
                </div>
              )}

              <div className="Editor-Content">
                {showImageUpload ? (
                  // Image Upload Section
                  <div className="Dimensional-Image">
                    <div className="banner-upload">
                      {dimensionalimage ? (
                        <div className="image-preview-wrapper">
                          <img
                            src={`${Url + dimensionalimage.image_url}`}
                            alt="Thumbnail"
                            className="image-preview"
                          />
                          {!isViewMode && (
                            <button onClick={cancelDimensionImage} className="cancel-button">
                              X
                            </button>
                          )}
                        </div>
                      ) : (
                        <label
                          htmlFor="dimensionalimage"
                          className="uploadAdd-label"
                          onClick={() => handleGalleryModalOpen("dimensional-image")}
                        >
                          <div className="Addupload-button">
                            <IoImageOutline size={45} color="#555" className="uploaded-image" />
                            <span className="uploadAdd-text">Click to Upload Image</span>
                          </div>
                        </label>
                      )}
                      <ImageGalleryPopup
                        showImageGalleryPopUp={modalView}
                        handleModalView={handleModalViewClose}
                        handleFileChange={handleFileChange}
                        onImageSelect={handleImageSelect}
                        index={activeIndex}
                        imageSendPayload={imageSendPayload}
                        setImageSendPayload={setImageSendPayload}
                        alt_text={imageSendPayload.alt_text}
                        title={imageSendPayload.title}
                        data={data}
                      />
                    </div>
                    <div className="DimensionalImage-Heading">
                      <label>Dimensional Image</label>
                    </div>
                  </div>
                ) : (
                  // Description Section
                  selectedDimensionTab === "Visual" ? (
                    <JoditEditor
                      ref={editor}
                      value={formData.weight_dimension}
                      tabIndex={1}
                      onBlur={handleWeightDimensionChange}
                      config={{
                        ...configEditor,
                        readonly: isViewMode,
                      }}
                    />
                  ) : (
                    <textarea
                      id="weight_dimension"
                      name="weight_dimension"
                      value={formData.weight_dimension}
                      readOnly={isViewMode}
                      onChange={handleInputChange}
                      className="Editor-Text-Area"
                      placeholder="Product Dimensions"
                    />
                  )
                )}
              </div>
            </div>
            <div className="Toggle-Switch">
              <Switch checked={showImageUpload} onChange={() => setShowImageUpload(!showImageUpload)} />
            </div>
          </div>; */}
          {/* <div className="WeightDimension-Area">
          <div className="Editor-Container-Short">
            <div className="Editor-Tabs">
              <div
                className={`Tab ${selectedDimensionTab === 'Visual' ? 'active' : ''}`}
                onClick={() => setSelectedDimensionTab("Visual")}
              >
                Visual
              </div>
              <div
                className={`Tab ${selectedDimensionTab === 'Text' ? 'active' : ''}`}
                onClick={() => setSelectedDimensionTab("Text")}
              >
                Text
              </div>
            </div>
          <div className="Editor-Content">
            {selectedDimensionTab === 'Visual' ? (
              <JoditEditor
                ref={editor}
                value={formData.weight_dimension}
                tabIndex={1}
                onBlur={handleWeightDimensionChange}
                config={{
                  ...configEditor,
                  readonly: isViewMode, // Set read-only mode based on the flag
                }}
              />
            ) : (
              <textarea
              id="weight_dimension"
              name="weight_dimension"
              value={formData.weight_dimension}
              readOnly={isViewMode} // Make the textarea read-only
              onChange={handleInputChange}
              className="Editor-Text-Area"
              placeholder="Product Dimensions"
              />
            )}
          </div>
          </div>
          <div className="Dimensional-Image">
            <div className="banner-upload">
              {dimensionalimage ? (
                <div className="image-preview-wrapper">
                  <img
                    src={`${Url+dimensionalimage.image_url}`} // Adjust path if necessary
                    alt="Thumbnail"
                    className="image-preview"
                  />
                  {!isViewMode && (
                  <button onClick={cancelDimensionImage} className="cancel-button">
                    X
                  </button>
                  )}
                </div>
              ) : (
                <label
                  htmlFor="dimensionalimage"
                  className="uploadAdd-label"
                  onClick={() => handleGalleryModalOpen("dimensional-image")}
                >
                  <div className="Addupload-button">
                    <IoImageOutline size={45} color="#555" className="uploaded-image" />
                    <span className="uploadAdd-text">Click to Upload Image</span>
                  </div>
                </label>
              )}
              <ImageGalleryPopup
                showImageGalleryPopUp={modalView}
                handleModalView={handleModalViewClose}
                handleFileChange={handleFileChange}
                onImageSelect={handleImageSelect}
                index={activeIndex}
                imageSendPayload={imageSendPayload}
                setImageSendPayload={setImageSendPayload}
                alt_text={imageSendPayload.alt_text}
                title={imageSendPayload.title}
                data={data}
              />
            </div>
            <div className="DimensionalImage-Heading">
              <label>Dimensional Image</label>
            </div>
          </div>
          </div> */}
          <div className="Editor-Container-Short">
            <div className="Editor-Tabs">
              <div
                className={`Tab ${selectedDimensionTab === 'Visual' ? 'active' : ''}`}
                onClick={() => setSelectedDimensionTab("Visual")}
              >
                Visual
              </div>
              <div
                className={`Tab ${selectedDimensionTab === 'Text' ? 'active' : ''}`}
                onClick={() => setSelectedDimensionTab("Text")}
              >
                Text
              </div>
            </div>
            <div className="Editor-Content">
              {selectedDimensionTab === 'Visual' ? (
                <JoditEditor
                  ref={editor}
                  value={formData.weight_dimension}
                  tabIndex={1}
                  onBlur={handleWeightDimensionChange}
                  config={{
                    ...configEditor,
                    readonly: isViewMode, // Set read-only mode based on the flag
                  }}
                />
              ) : (
                <textarea
                id="weight_dimension"
                name="weight_dimension"
                value={formData.weight_dimension}
                readOnly={isViewMode} // Make the textarea read-only
                onChange={handleInputChange}
                className="Editor-Text-Area"
                placeholder="Product Dimensions"
                />
              )}
            </div>
          </div>
        </div>

        <div className="SEO">
          <div className="SEO-Header">
            <label htmlFor="editor">SEO</label>
          </div>
          <div className="SEO-Body">
            <div className="SEO-Row-1">
              <div className="Row-1-LeftSide">Focus Key Phrase</div>
              <div className="Row-1-RightSide">
                <textarea
                  id="FocusPhrase"
                  type="text"
                  className="SEOinput-01"
                  placeholder="Enter Key Phrase here..."
                />
              </div>
            </div>

            {/* Accordion for SEO Rows 2 to 6 */}
            {[
              "Search Appearance",
              "Add Related Keyphrases",
              "Internal Linking Suggestion",
              "Corner Stone Product",
              "Insights",
            ].map((title, index) => (
              <div key={index} className={`SEO-Row-${index + 2}`}>
                <div
                  onClick={() => toggleAccordion(index + 2)}
                  className="AccordionHeader"
                >
                  <span>{title}</span>
                  <div
                    className={`AccordionIcon ${
                      accordionsOpen[index + 2] ? "rotate" : ""
                    }`}
                  >
                    {accordionsOpen[index + 2] ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </div>
                </div>
                <div
                  className={`AccordionContent ${
                    accordionsOpen[index + 2] ? "open" : ""
                  }`}
                >
                  {/* Custom content for "Search Appearance" Accordion */}
                  {title === "Search Appearance" ? (
                    <>
                      {/* Radio Buttons for View Selection */}
                      <div className="ViewSelection">
                        <div className="CheckBtn">
                          <label
                            className={`MobileCheckLabel ${
                              isMobileAnimating && selectedView === "Mobile"
                                ? "MobileViewAnimate"
                                : ""
                            }`}
                          >
                            <input
                              type="radio"
                              name="viewOption"
                              value="Mobile"
                              checked={selectedView === "Mobile"}
                              onChange={() => handleChange("Mobile")}
                              className="MobileCheckBtn"
                            />
                            Mobile View
                          </label>

                          <label
                            className={`WebCheckLabel ${
                              isWebAnimating && selectedView === "Web"
                                ? "WebViewAnimate"
                                : ""
                            }`}
                          >
                            <input
                              type="radio"
                              name="viewOption"
                              value="Web"
                              checked={selectedView === "Web"}
                              onChange={() => handleChange("Web")}
                              className="WebCheckBtn"
                            />
                            Web View
                          </label>
                        </div>

                        {/* Conditional Rendering based on selected view */}
                        <div className="ViewContent">
                          {selectedView === "Mobile" ? (
                            <div className="MobileViewContent">
                              <div className="Mobile-FirstRow">
                                <div className="MobileLogo">
                                  <img src={Logo} alt="Logo" />
                                </div>
                                <div className="MobileHeader">
                                  <span className="Header-Top">
                                    Furniture Mecca
                                  </span>
                                  <span className="Header-Bottom">
                                    myfurnituremecca.com
                                  </span>
                                </div>
                                <div className="MobileSelector">
                                  <img src={Selector} alt="Selector" />
                                </div>
                              </div>
                              <div className="Mobile-SecondRow">
                                <span className="Header-Secondrow">
                                  -Furniture Mecca
                                </span>
                                <span className="Para-Secondrow">
                                  Please provide a meta description by editing
                                  the snippet below. if you don't, Google will
                                  try to find a relevant part of your post to
                                  show in the search result.
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="WebViewContent">
                              <div className="Web-FirstRow">
                                <div className="WebLogo">
                                  <img src={Logo} alt="Logo" />
                                </div>
                                <div className="WebHeader">
                                  <span className="Header-Top">
                                    Furniture Mecca
                                  </span>
                                  <span className="Header-Bottom">
                                    myfurnituremecca.com
                                  </span>
                                </div>
                                <div className="WebSelector">
                                  <img src={Selector} alt="Selector" />
                                </div>
                              </div>
                              <div className="Web-SecondRow">
                                <span className="Header2-Secondrow">
                                  -Furniture Mecca
                                </span>
                                <span className="Para2-Secondrow">
                                  Please provide a meta description by editing
                                  the snippet below. if you don't, Google will
                                  try to find a relevant part of your post to
                                  show in the search result.
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* SEO Title with border-bottom */}
                      <div className="SEO-SearchAppearance SEO-Bordered">
                        <div className="Row-2-LeftSide">SEO Title</div>
                        <div className="Row-2-RightSide">
                          <textarea
                            id="SEOtitle"
                            type="text"
                            className="SEOinput-02"
                            placeholder=""
                          />
                        </div>
                      </div>

                      {/* Slug with border-bottom */}
                      <div className="SEO-SearchAppearance SEO-Bordered">
                        <div className="Row-2-LeftSide">Slug</div>
                        <div className="Row-2-RightSide">
                          <textarea
                            id="Slug"
                            type="text"
                            className="SEOinput-03"
                            placeholder=""
                          />
                        </div>
                      </div>

                      {/* Meta Description */}
                      <div className="SEO-SearchAppearance">
                        <div className="Row-2-LeftSide">Meta Description</div>
                        <div className="Row-2-RightSide">
                          <textarea
                            id="MetaDescription-1"
                            type="text"
                            className="SEOinput-04"
                            placeholder=""
                          />
                        </div>
                      </div>
                    </>
                  ) : title === "Add Related Keyphrases" ? (
                    <div className="SEO-AddRelatedKeyphrase">
                      <div className="Row-1-LeftSide">Keyphrases</div>
                      <div className="Row-1-RightSide">
                        <textarea
                          id="MetaDescription-2"
                          type="text"
                          className="SEOinput-05"
                          placeholder=""
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="RestofAcord">Content for {title} Accordion</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Body Right Side Content --- */}
      <div className="PageRightSide">
        {accordionItems.map((item, index) => (
          <AccordionItem
            key={index}
            title={item.title}
            content={item.content}
            defaultOpen={index === 0}
            maxHeight="2000px"
          />
        ))}
      </div>

      {/* --- Toast Notification --- */}
      {/*<ToastContainer position="top-right" autoClose={5000} />*/}{" "}
      <BottomToust
        showMessage={showMessage}
        message={toastMessage}
        handleCloseMessageModal={() => handleCloseMessageModal()}
      />
    </div>
  );
};

/* ----------------------------------------------------------------------------------------------------------
                            --- Body Content for handling of Single Products ---
---------------------------------------------------------------------------------------------------------- */

/* --- General Section --- */
const GeneralFields = ({
  tags,
  handleMultiSelect,
  selectedTags,
  selectedTagType,
  selectedProductTagType,
  selectedSaleTagType,
  SaleOptions,
  taxTypeOptions,
  taxClassOptions,
  handleChangeSale,
  handleDiscountValueChange,
  handleChangeTaxStatus,
  selectedSale,
  selectedProductTags,
  selectedSaleTags,
  selectedTaxStatus,
  selectedTaxClass,
  isEdit,
  formData,
  handleInputChange,
  isViewMode,
  handleProductTagSelect,
  handleSaleTagSelect,
}) => (
  <div className="Content-GeneralFields">
    <div className="GeneralFields-Data">
      <label htmlFor="regular_price" className="Data-Label">
        Regular Price ($)
      </label>
      {/* <input
        type="text"
        id="regular_price"
        name="regular_price"
        readOnly={isViewMode}
        className="Data-Field"
        value={formData.regular_price || ""}
        onChange={handleInputChange}
        placeholder="$"
      /> */}
      <div className="InputWrapper">
        <span className="Prefix">$</span>
          <input
              type="text"
              id="regular_price"
              name="regular_price"
              readOnly={isViewMode}
              className="Updated-Data-Field"
              value={formData.regular_price || ""}
              onChange={handleInputChange}
              inputMode="number"
              pattern="^\d*\.?\d*$"
              title="Please enter a valid numeric value."
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9.]/g, ""); // Remove non-numeric characters
              }}
            />
      </div>
    </div>
    <div className="GeneralFields-Data">
      <label htmlFor="salePrice" className="Data-Label">
        Sale Price
      </label>
      <Dropdowncustom
        options={SaleOptions}
        // selected={selectedSale}
        selected={isEdit ? formData.discount?.discount_type : selectedSale}
        onChange={handleChangeSale}
        dropdownClass="custom-dropdown-sale"
        headerheight="30px"
        size={15}
        isViewMode={isViewMode}
      />
      <div className="InputWrapper-SimpleSale">
        <span className="Prefix">$</span>
        <input
          type="text"
          id="salePrice"
          name="salePrice"
          readOnly={isViewMode}
          className="Updated-Data-Field2"
          // placeholder="$"
          value={formData.discount.discount_value || ""}
          onChange={(e) => handleDiscountValueChange("discount_value", e)}
          inputMode="number"
          pattern="^\d*\.?\d*$"
          title="Please enter a valid numeric value."
          onInput={(e) => {
            e.target.value = e.target.value.replace(/[^0-9.]/g, ""); // Remove non-numeric characters
          }}
        />
      </div>
    </div>
    <div className="GeneralFields-Data">
      {/* <label htmlFor="dateRange" className="Data-Label">
        Date Range
      </label>
      <input
        type="text"
        id="dateRange"
        name="dateRange"
        readOnly={isViewMode}
        className="Data-Field"
      /> */}
    </div>
    <div className="GeneralFields-Data empty-space ">
      {/* <label htmlFor="schedule" className="Data-Label label-schadule">
        Schedule
      </label> */}
    </div>
    <div className="GeneralFields-Data">
      <label htmlFor="tax_status" className="Data-Label">
        Tax Status
      </label>
      <Dropdowncustom
        options={taxTypeOptions}
        selected={formData.tax_status || ""}
        onChange={(value) =>
          handleInputChange({ target: { name: "tax_status", value } })
        }
        dropdownClass="custom-dropdown-tax"
        headerheight="30px"
        size={15}
        isViewMode={isViewMode}
      />
    </div>
    <div className="GeneralFields-Data">
      {/* <label htmlFor="tax_class" className="Data-Label">
        Tax Class
      </label>
      <Dropdowncustom
        options={taxClassOptions}
        selected={formData.tax_class || ""}
        onChange={(value) =>
          handleInputChange({ target: { name: "tax_class", value } })
        }
        dropdownClass="custom-dropdown-tax"
        headerheight="30px"
        size={15}
        isViewMode={isViewMode}
      /> */}
    </div>
    <div className="GeneralFields-Data">
      <label htmlFor="brand" className="Data-Label">
        Brand
      </label>
      <input
        type="text"
        id="brand"
        readOnly={isViewMode}
        name="brand"
        className="Data-Field"
        value={formData.brand || ""}
        onChange={handleInputChange}
        placeholder="Brand"
      />
    </div>
    <div className="GeneralFields-Data">
      <label htmlFor="gtin" className="Data-Label">
        GTIN
      </label>
      <input
        type="text"
        id="gtin"
        name="gtin"
        readOnly={isViewMode}
        className="Data-Field"
        value={formData.gtin || ""}
        onChange={handleInputChange}
        placeholder="GTIN"
      />
      <div style={{marginBottom: "2px", marginLeft: "20px"}}>
        <QuestionMarkCircle size={19} color="var(--questionMark-color)" tooltip="GTIN" />
      </div>
    </div>
    <div className="GeneralFields-Data">
      <label htmlFor="ean" className="Data-Label">
        EAN
      </label>
      <input
        type="text"
        id="ean"
        name="ean"
        readOnly={isViewMode}
        className="Data-Field"
        value={formData.ean || ""}
        onChange={handleInputChange}
        placeholder="EAN"
      />
      <div style={{marginBottom: "2px", marginLeft: "20px"}}>
        <QuestionMarkCircle size={19} color="var(--questionMark-color)" tooltip="EAN" />
      </div>
    </div>
    <div className="GeneralFields-Data">
      <label htmlFor="mpn" className="Data-Label">
        MPN
      </label>
      <input
        type="text"
        id="mpn"
        name="mpn"
        readOnly={isViewMode}
        className="Data-Field"
        value={formData.mpn || ""}
        onChange={handleInputChange}
        placeholder="MPN"
      />
      <div style={{marginBottom: "2px", marginLeft: "20px"}}>
        <QuestionMarkCircle size={19} color="var(--questionMark-color)" tooltip="MPN" />
      </div>
    </div>
    {/* <div className="GeneralFields-Data">
      <div className="GeneralFields-Data-Tag">
        <label htmlFor="addTags" className="Data-Label">
          Tags
        </label>
        <SearchMultiple
          name="multiSelect"
          placeholder="Search & Select Tags"
          options={tags.map((tag) => tag.name)}
          onSelect={(option) => handleMultiSelect(option)}
          selectedItems={selectedTags.map((tag) => tag.name)}
          width="212px"
          isViewMode={isViewMode}
        />
      </div>
    </div> */}
    {/* {selectedTagType ? (
      selectedTagType.type === "image" ? (
        <div className="tag-content"> */}
          {/* <img src={selectedTagType.image_path} alt={selectedTagType.name} /> */}
        {/* </div>
      ) : selectedTagType.type === "Text" ? (
        <div className="tag-content"> */}
          {/* <p
            style={{
              color: selectedTagType.text_color,
              backgroundColor: selectedTagType.bg_color,
              width: "110px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "3px",
            }}
          >
            {selectedTagType.text || "Text Content for selected tag"}
          </p> */}
        {/* </div>
      ) : null
    ) : null} */}
    
    <div className="GeneralFields-Data">
      <div className="GeneralFields-Data-Tag">
        <label htmlFor="addTags" className="Data-Label">
          Product Tag
        </label>
        <SearchMultiple
          name="multiSelect"
          placeholder="Search & Select Tags"
          options={tags.map((tag) => tag.name)}
          onSelect={(option) => handleProductTagSelect(option)}
          selectedItems={selectedProductTags.map((tag) => tag.name)}
          width="212px"
          isViewMode={isViewMode}
        />
      </div>
    </div>

    <div className="GeneralFields-Data">
      <div className="GeneralFields-Data-Tag">
        <label htmlFor="addTags" className="Data-Label">
          Sale Tag
        </label>
        <SearchMultiple
          name="multiSelect"
          placeholder="Search & Select Tags"
          options={tags.map((tag) => tag.name)}
          onSelect={(option) => handleSaleTagSelect(option)}
          selectedItems={selectedSaleTags.map((tag) => tag.name)}
          width="212px"
          isViewMode={isViewMode}
        />
      </div>
    </div>
    </div>
);

/* --- Inventory Section --- */
const InventoryFields = ({
  locationsOptions,
  isStockManagementChecked,
  formData,
  handleInputChange,
  handleManageStockChange,
  handleStockCheckboxChange,
  handleBackOrderChange,
  isViewMode,
}) => (
  <div className="Content-GeneralFields">
    <div className="GeneralFields-InventoryData">
      <label htmlFor="sku" className="Data-Label-Inventory">
        SKU
      </label>
      <div className="Dropdown-Image-Container-Inventory">
        <div className="Inventory-center">
          <input
            type="text"
            id="sku"
            name="sku"
            className="Data-Field-Inventory"
            readOnly={isViewMode}
            value={formData.sku || ""}
            onChange={handleInputChange}
            placeholder="SKU"
          />
        </div>
        <div className="ImageContainer">
          <QuestionMarkCircle size={19} color="var(--questionMark-color)" tooltip="SKU here!" />
        </div>
      </div>
    </div>
    <div className="GeneralFields-InventoryData">
      <label htmlFor="stockManagement" className="Data-Label-Inventory">
        Stock Management
      </label>
      <div className="Dropdown-Image-Container-Inventory">
        <div className="Inventory-center">
          <label className={`checkbox-wrapper ${isViewMode && isStockManagementChecked ? "viewmode-checked" : ""}`}>
            <input
              type="checkbox"
              checked={isStockManagementChecked}
              onChange={handleStockCheckboxChange}
              disabled={isViewMode}
            />
            <span className="custom-checkbox"></span>
            <span >Manage Your Stocks</span>
          </label>
        </div>
        <div className="ImageContainer">
          <QuestionMarkCircle size={19} color="var(--questionMark-color)" tooltip="Stock Management here!" />
        </div>
      </div>
    </div>

    {/* Conditionally render Quantity and Allow Back Order fields based on stock management checkbox */}
    {!isStockManagementChecked && (
      <>
        <div className="GeneralFields-InventoryData-1">
          <label className="Data-Label-Inventory">Stock Status</label>
          <div className="Dropdown-Image-Container-Inventory-1">
            <div className="Inventory-Radiocenter">
              <input
                type="radio"
                id="inStock"
                name="stock_status"
                disabled={isViewMode}
                className="Data-Radio"
                value="inStock"
                checked={formData.manage_stock.stock_status === "inStock"}
                onChange={handleManageStockChange}
              />
              <span>In Stock</span>
            </div>
            <div className="Inventory-Radiocenter">
              <input
                type="radio"
                id="outOfStock"
                name="stock_status"
                disabled={isViewMode}
                className="Data-Radio"
                value="outOfStock"
                checked={formData.manage_stock.stock_status === "outOfStock"}
                onChange={handleManageStockChange}
              />
              <span>Out of Stock</span>
            </div>
            {/* <div className="Inventory-Radiocenter-1">
              <input
                type="radio"
                id="backOrder"
                name="stock_status"
                disabled={isViewMode}
                className="Data-Radio"
                value="backOrder"
                checked={formData.manage_stock.stock_status === "backOrder"}
                onChange={handleManageStockChange}
              />
              <span>Back Order</span>
            </div> */}
          </div>
        </div>
        <div className="GeneralFields-InventoryData">
          <label htmlFor="sold_individually" className="Data-Label-Inventory">
            Sold Individually
          </label>
          <div className="Dropdown-Image-Container-Inventory">
            <div className="Inventory-center">
              <input
                type="checkbox"
                id="sold_individually"
                name="sold_individually"
                readOnly={isViewMode}
                className="Data-Checkbox"
                checked={formData.sold_individually || false}
                onChange={handleInputChange}
              />
              <span>Limit Purchase 1 purchase per order</span>
            </div>
            <div className="ImageContainer">
              <QuestionMarkCircle size={19} color="var(--questionMark-color)" tooltip="Sold Individually here!" />
            </div>
          </div>
        </div>
      </>
    )}

    {/* Conditionally render Quantity and Allow Back Order fields based on stock management checkbox */}
    {isStockManagementChecked && (
      <>
        <div className="GeneralFields-CheckedData">
          <label htmlFor="quantity" className="Data-Label-Inventory">
            Quantity
          </label>
          <input
                type="text"
                id="quantity"
                name="quantity"
                readOnly={isViewMode}
                className="readonly-inputVariation"
                placeholder="1"
                onChange={handleManageStockChange}
                value={formData.manage_stock.quantity || ""}
              />
          {/* <div className="Dropdown-Image-Container-Inventory">
            <div className="Inventory-center">
              <input
                type="text"
                id="quantity"
                name="quantity"
                readOnly={isViewMode}
                className="Data-Field-Quantity"
                placeholder="1"
                onChange={handleManageStockChange}
                value={formData.manage_stock.quantity || ""}
              />
            </div>
          </div> */}
        </div>
        <div className="GeneralFields-CheckedData">
          <label htmlFor="locations" className="Data-Label-Inventory">
            Locations
          </label>
          {/* <Dropdowncustom
            options={locationsOptions}
            selected={formData.manage_stock.location || ""}
            onChange={(selectedValue) => handleManageStockChange(selectedValue)}
            dropdownClass="custom-dropdown-locations"
            size={15}
            headerheight="30px"
            isViewMode={isViewMode}
          /> */}
          <input
            type="text"
            value="All Locations" // Display the "All Locations" text in read-only mode
            readOnly
            className="readonly-inputVariation-location" // Optional: You can style this input for better appearance
          />
        </div>
        <div className="GeneralFields-InventoryData-1">
          <label className="Data-Label-Inventory">Allow Back Order</label>
          <div className="Dropdown-Image-Container-Inventory-1">
            <div className="Inventory-Radiocenter">
              <input
                type="radio"
                id="dontAllow"
                name="back_order"
                disabled={isViewMode}
                className="Data-Radio"
                value="doNotAllow"
                checked={formData.allow_back_order === 0}
                onChange={() => handleBackOrderChange(0)}
              />
              <span>Do Not Allow</span>
            </div>
            <div className="Inventory-Radiocenter">
              <input
                type="radio"
                id="notifyCustomer"
                name="back_order"
                disabled={isViewMode}
                className="Data-Radio"
                value="notifyCustomer"
                checked={formData.allow_back_order === 1}
                onChange={() => handleBackOrderChange(1)}
              />
              <span>Allow & Notify Customer</span>
            </div>
          </div>
        </div>
      </>
    )}
  </div>
);

/* --- Shipping Section --- */
const ShippingFields = ({
  shippingClassOptions,
  handleChangeShippingClass,
  selectedShippingClass,
  isViewMode
}) => (
  <div className="Content-GeneralFields">
    <div className="GeneralFields-ShippingData">
      <label htmlFor="shippingClass" className="Data-Label-Shipping">
        Shipping Class
      </label>
      <div className="Dropdown-Image-Container">
        <Dropdowncustom
          options={shippingClassOptions}
          selected={selectedShippingClass}
          onChange={handleChangeShippingClass}
          dropdownClass="custom-dropdown-shipping"
          size={15}
          isViewMode={isViewMode}
        />
        <div style={{marginBottom: "8px"}}>
          <QuestionMarkCircle size={19} color="var(--questionMark-color)" tooltip="Shipping Class here!" />
        </div>
      </div>
    </div>
  </div>
);

/* --- Linked Products Section --- */
const LinkedProducts = ({
  handleProductMultiSelect,
  handleRelatedProduct,
  relatedProducts,
  handleNeedProduct,
  needProducts,
  collectionsList,
  selectedProducts,
  products,
  isViewMode,
  productData,
  selectedProductNames,
  needProductNames,
  relatedProductNames,
  isEdit,
}) => (
  <div className="Content-GeneralFields">
    <div className="GeneralFields-LinkedData">
      <label htmlFor="collections" className="Data-Label-Linked">
        Shop From This Collection
      </label>
      <div className="Dropdown-Image-Container-Linked">
        <div className="Collection-Multisearch-Field">
          <SearchMultiple
            name="multiSelect"
            placeholder="Shop From This Collection"
            options={products.map((product) => product.name)}
            onSelect={(option, isRemoving = false) =>
              handleProductMultiSelect(option, isRemoving)
            }
            selectedItems={selectedProducts.map(
              (uid) =>
                products.find((product) => product.uid === uid)?.name || ""
            )}
            isViewMode={isViewMode}
          />
        </div>
        <div className="ImageContainer">
          <QuestionMarkCircle size={19} color="var(--questionMark-color)" tooltip="Collection here!" />
        </div>
      </div>
    </div>
    <div className="GeneralFields-LinkedData">
      <label htmlFor="relatedProducts" className="Data-Label-Linked">
        You May Also Like
      </label>
      <div className="Dropdown-Image-Container-Linked">
        <div className="Collection-Multisearch-Field">
          <SearchMultiple
            name="multiSelect"
            placeholder="You May Also Like"
            options={products.map((product) => product.name)}
            onSelect={(option, isRemoving = false) =>
              handleRelatedProduct(option, isRemoving)
            }
            selectedItems={relatedProducts.map(
              (uid) =>
                products.find((product) => product.uid === uid)?.name || ""
            )}
            isViewMode={isViewMode}
          />
        </div>
        <div className="ImageContainer">
          <QuestionMarkCircle size={19} color="var(--questionMark-color)" tooltip="Related Products here!" />
        </div>
      </div>
    </div>
    <div className="GeneralFields-LinkedData">
      <label htmlFor="mightNeed" className="Data-Label-Linked">
        You Might Also Need
      </label>
      <div className="Dropdown-Image-Container-Linked">
        <div className="Collection-Multisearch-Field">
          <SearchMultiple
            name="multiSelect"
            placeholder="You Might Also Need"
            options={products.map((product) => product.name)}
            onSelect={(option, isRemoving = false) =>
              handleNeedProduct(option, isRemoving)
            }
            selectedItems={needProducts.map(
              (uid) =>
                products.find((product) => product.uid === uid)?.name || ""
            )}
            isViewMode={isViewMode}
          />
        </div>
        <div className="ImageContainer">
          <QuestionMarkCircle size={19} color="var(--questionMark-color)" tooltip="You May Also Need here!" />
        </div>
      </div>
    </div>
  </div>
);

/* --- Attribute Section --- */
const AttributesFields = ({
  handleSingleSaveAttributes,
  attributes,
  selectedAttributes,
  handleAttributeSelect,
  handleMultiSelect,
  handleDeleteAttribute,
  isViewMode,
  isActive,
  handleAttributeSelectWithState,
  hasSelectedAttributes,
  isLoading
}) => (
  <div className="Content-VariableGeneralFields">
    <div className="GeneralFields-AdvanceData">
      <SearchInput
        label="Add Attributes"
        name="addAttributes"
        placeholder="Search & Select Attributes"
        options={attributes.map((attr) => attr.name)} // Show only attribute names
        // onSelect={handleAttributeSelect}
        onSelect={handleAttributeSelectWithState}
        isViewMode={isViewMode}
      />
    </div>

    <div className="GeneralFields-AttributeAccordion">
      {selectedAttributes.length === 0 ? (
        <div className="no-swatch-message-1">No Attribute Selected Yet</div>
      ) : (
        selectedAttributes.map((attribute, index) => (
          <AttributeAccordion
            activeIndex1={index}
            key={index}
            title={attribute.name}
            content={
              <div className="attribute-content">
                <div className="AccordionRow">
                  <div className="label">Name</div>
                  <div className="label-1">Value</div>
                </div>
                <div className="AccordionRow">
                  <div className="attribute-name">{attribute.name}</div>
                  <div className="attribute-value">
                    <SearchMultiple
                      name="multiSelect"
                      placeholder={`Enter value for ${attribute.name}`}
                      options={attribute.options.map((option) => option.name)} // Show options of the selected attribute
                      onSelect={(option) =>
                        handleMultiSelect(attribute.name, option)
                      } // Call with only selected option
                      selectedItems={attribute.selectedOptions} // This should now only allow one item
                      suggestionHeight={100}
                      isViewMode={isViewMode}
                    />
                  </div>
                </div>
                {/* <div className="checkboxes">
                  <label>
                    <input type="checkbox" disabled={isViewMode} />{" "}
                    <span className="Checkbox-Text">Select all</span>
                  </label>
                  <label>
                    <input type="checkbox" disabled={isViewMode} />{" "}
                    <span className="Checkbox-Text">
                      Visible on product page
                    </span>
                  </label>
                </div> */}
              </div>
            }
            handleDelete={() => handleDeleteAttribute(attribute.name)} // Handle attribute deletion
            headerBgColor="var(--third-layer-bg)" // Light gray background for the header
            contentBgColor="var(--second-layer-bg)" // Light gray background for the content
            contentHeight={185}
            isViewMode={isViewMode}
          />
        ))
      )}
    </div>

    {/* {!isViewMode && hasSelectedAttributes && (
      <div className="SubmitBtn">
        <CustomBtn
          label="Save Attribute"
          className={`AddAttributeBtn ${isActive ? "active" : ""}`}
          disabled={isViewMode}
          onClick={handleSingleSaveAttributes}
          type="button"
        />
      </div>
    )} */}

      {!isViewMode && hasSelectedAttributes && (
        <div className="SubmitBtn">
          <CustomBtn
            label={isLoading ? <div className="btn-loader"></div> : "Save Attribute" }  // Conditionally render text
            className={`AddAttributeBtn ${isActive ? "active" : ""}`}
            disabled={isViewMode || isLoading}  // Disable button while loading
            onClick={handleSingleSaveAttributes}
            type="button"
          >
          </CustomBtn>
        </div>
      )}
  </div>
);

/* --- Advanced Section --- */
const Advanced = ({ handleInputChange, formData, isViewMode }) => (
  <div className="Content-GeneralFields">
    <div className="GeneralFields-AdvanceData">
      <label htmlFor="shortDescription" className="Data-Label">
        Short Description
      </label>
      <textarea
        id="short_description"
        name="short_description"
        readOnly={isViewMode}
        className="Data-Field-Advance"
        placeholder="Text Field"
        rows="4" // Set desired number of rows
        cols="50" // Adjust as needed
        value={formData.short_description}
        onChange={handleInputChange} // Link to handleInputChange
      />
    </div>
    <div className="GeneralFields-AdvanceData">
      <label htmlFor="purchaseNote" className="Data-Label">
        Purchase Note
      </label>
      <textarea
        id="purchase_note"
        name="purchase_note"
        readOnly={isViewMode}
        className="Data-Field-Advance"
        placeholder="Text Field"
        rows="4" // Set desired number of rows
        cols="50" // Adjust as needed
        value={formData.purchase_note}
        onChange={handleInputChange} // Link to handleInputChange
      />
    </div>
    <div className="GeneralFields-AdvanceData">
      <label htmlFor="menuOrder" className="Data-Label">
        Menu Order
      </label>
      {/* <input type="text" id="menuOrder" name="menuOrder" className='Data-Field' placeholder='Text Field' /> */}
      <input
        type="text"
        id="menu_order"
        name="menu_order"
        readOnly={isViewMode}
        className="Data-Field"
        placeholder="Text Field"
        value={formData.menu_order}
        onChange={handleInputChange} // Link to handleInputChange
      />
    </div>
    {/* <div className="GeneralFields-AdvanceData">
      <label htmlFor="enable_review" className="Data-Label">
        Enable Reviews
      </label>
      {/* <input type="checkbox" id="enableReviews" name="enableReviews" className='Data-Checkbox' /> */}
      {/*<input
        type="checkbox"
        id="enable_review"
        name="enable_review"
        disabled={isViewMode}
        className="Data-Checkbox"
        checked={formData.enable_review === 1}
        onChange={handleInputChange} // Link to handleInputChange
      />
    </div> */}
    <div className="GeneralFields-AdvanceData">
      <label htmlFor="enable_review" className="Data-Label">
        Enable Reviews
      </label>
      <label
        className={`checkbox-wrapper Data-Checkbox-2nd ${
          isViewMode && formData.enable_review === 1 ? "viewmode-checked" : ""
        }`}
      >
        <input
          type="checkbox"
          id="enable_review"
          name="enable_review"
          disabled={isViewMode}
          checked={formData.enable_review === 1}
          onChange={handleInputChange}
        />
        <span className="custom-checkbox"></span>
      </label>
    </div>
  </div>
);

/* --- Swatches Section --- */
const SwatchFields = ({
  accordionsData,
  // accordionsData = [],
  attributeTypeOptions,
  selectedAttributeType,
  setSelectedAttributeType,
  handleSwatchSubmit,
  handleTypeChange,
  renderOptionContent,
  setAccordionsData,
  setActiveIndex,
  activeIndex,
  isViewMode,
  isSwatchBtn,
  isLoading,
  isActive
}) => (
  <div className="Content-GeneralFields">
    <div className="GeneralFields-VariationData">
      {accordionsData.length === 0 ? (
        <>
          <div className="Empty-Swatch-Status">
            <div className="no-swatch-container">
              <div className="no-swatch-message">No Swatches Generated Yet
                <br /> 
                <strong>Noted:</strong>
                <span style={{ color: 'red' }}>
                  {" "}For generating swatches add atleast one attribute
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        accordionsData.map((attribute, attributeIndex) => (
          <SwatchAccordion
            activeIndex={attributeIndex}
            key={attributeIndex}
            title={
              <div className="Swatch-Header">
                <div className="Swatch-attribute-name">{attribute.name}</div>
                <div className="Type-Selection">
                  <label htmlFor="attributeType" className="attrDropdown">
                    Attribute Type
                  </label>
                  <div onClick={(e) => e.stopPropagation()}>
                    <DropdownSwatch
                      optionsmap={attributeTypeOptions}
                      selectedOption={attribute.type || selectedAttributeType}
                      handleOptionChange={(selectedValue) => {
                        setSelectedAttributeType(selectedValue);
                        handleTypeChange(attributeIndex, selectedValue);
                        setActiveIndex(attributeIndex);
                        {
                          {/*console.log("Active Index: ", activeIndex);*/}
                        }
                      }}
                      headerBgColor="var(--third-layer-bg)" 
                      contentBgColor="transparent"
                      isViewMode={isViewMode}
                    />
                  </div>
                </div>
              </div>
            }
            content={
              <div className="parent-accordion-content borderless">
                {attribute.options.map((option, optionIndex) => (
                  <AttributeAccordion
                    key={option._id}
                    title={option.name}
                    content={renderOptionContent(
                      attribute.type,
                      option,
                      attributeIndex,
                      optionIndex,
                      isViewMode
                    )}
                    showDeleteIcon={false}
                    flexDirection="row"
                    isViewMode={isViewMode}
                  />
                ))}
              </div>
            }
            showDeleteIcon={false}
            showToggleIcon={false}
            isViewMode={isViewMode}
          />
        ))
      )}
    </div>

    {!isViewMode && isSwatchBtn && (
    <div className="SubmitBtn">
      <CustomBtn
        // label="Save Swatches"
        // className="AddSwitchBtn"
        // disabled={isViewMode}
        // onClick={handleSwatchSubmit}
        // type="button"
        label={isLoading ? <div className="btn-loader"></div> : "Save Swatches" }  // Conditionally render text
        className={`AddAttributeBtn ${isActive ? "active" : ""}`}
        disabled={isViewMode || isLoading}  // Disable button while loading
        onClick={handleSwatchSubmit}
        type="button"
      />
    </div>
    )}
  </div>
);

/* --- Features Section --- */
const FeaturesFields = ({
  handleSingleSaveFeatures,
  getFeatures,
  selectedFeatures,
  handleSingleFeatureSelect,
  handleDeleteFeature,
  isViewMode,
  isEditMode,
  isActive,
  handleFeatureSelectWithState,
  hasSelectedFeatures,
  isLoading
}) => (
  <div className="Content-VariableGeneralFields">
    <div className="GeneralFields-AdvanceData">
      <SearchInput
        label="Add Features"
        name="addFeatures"
        placeholder="Search & Select Features"
        options={getFeatures?.length > 0 ? getFeatures.map((attr) => attr.name) : []}
        onSelect={(value) => {
          {/*console.log("Feature Selected:", value);*/}
          handleFeatureSelectWithState(value);
        }}                
        isViewMode={isViewMode}
      />
    </div>

    <div className="GeneralFields-AttributeAccordion">
      {selectedFeatures.length === 0 ? (
        <div className="no-swatch-message-1">No Feature Selected Yet</div>
      ) : (
        selectedFeatures.map((feature, index) => (
          <AttributeAccordion
            activeIndex1={index}
            key={index}
            title={feature.name}
            content={
              <div className="Feature-Content">
                <div className="Feature-AccordionRow">
                  {/*<div className="Feature-AccordionRow-label">Feature Image</div>*/}
                  <div className="attribute-name">
                    <img src={`${Url+feature.image}`} width="80" height="80" />
                  </div>
                </div>
                <div className="Feature-AccordionRow">
                  <>
                <div className="Feature-AccordionRow-label">Value</div>                  
                  <div className="attribute-value">
                    <InputField
                      value={feature.inputValue}
                      name="featureValue"
                      onChange={(e) =>
                        handleSingleFeatureSelect(feature.name, e.target.value)
                      }
                      placeholder={`Enter ${feature.name}.`}
                      readOnly={isViewMode}
                      disabled={isViewMode}
                      width={175}
                      height={30}
                    />
                  </div>
                  </>
                </div>
              </div>
            }
            handleDelete={() => handleDeleteFeature(feature.name)}
            headerBgColor="var(--third-layer-bg)"
            contentBgColor="var(--second-layer-bg)"
            contentHeight={120}
            isViewMode={isViewMode}
          />
        ))
      )}
    </div>

      {isEditMode && hasSelectedFeatures && (
        <div className="SubmitBtn">
          <CustomBtn
            label={isLoading ? <div className="btn-loader"></div> : "Save Features" }  // Conditionally render text
            className={`AddAttributeBtn ${isActive ? "active" : ""}`}
            disabled={isViewMode || isLoading}  // Disable button while loading
            onClick={handleSingleSaveFeatures}
            type="button"
          >
          </CustomBtn>
        </div>
      )}
  </div>
);

/* ----------------------------------------------------------------------------------------------------------
                            --- Body Content for handling of Variable Products ---
---------------------------------------------------------------------------------------------------------- */

/* --- General Section --- */
const VariableGeneralFields = ({
  taxTypeOptions,
  taxClassOptions,
  formData,
  handleInputChange,
  handleMultiSelect,
  selectedTags,
  selectedTagType,
  selectedProductTagType,
  selectedSaleTagType,
  tags,
  isEdit,
  isViewMode,
  selectedProductTags,
  selectedSaleTags,
  handleProductTagSelect,
  handleSaleTagSelect,
}) => (
  <div className="Content-VariableGeneralFields">
    <div className="VariableGeneralFields-Data">
      <label htmlFor="tax_status" className="VariableGeneralFields-Data-Label">
        Tax Status
      </label>
      <Dropdowncustom
        options={taxTypeOptions}
        selected={formData.tax_status || ""}
        onChange={(value) =>
          handleInputChange({ target: { name: "tax_status", value } })
        }
        dropdownClass="custom-dropdown-tax"
        isViewMode={isViewMode}
        headerheight="30px"
        size={15}
      />
    </div>
    <div className="VariableGeneralFields-Data">
      {/* <label htmlFor="tax_class" className="VariableGeneralFields-Data-Label">
        Tax Class
      </label>
      <Dropdowncustom
        options={taxClassOptions}
        selected={formData.tax_class || ""}
        onChange={(value) =>
          handleInputChange({ target: { name: "tax_class", value } })
        }
        dropdownClass="custom-dropdown-tax"
        isViewMode={isViewMode}
        headerheight="30px"
        size={15}
      /> */}
    </div>
    <div className="VariableGeneralFields-Data">
      <label htmlFor="brand" className="VariableGeneralFields-Data-Label">
        Brand
      </label>
      <input
        type="text"
        id="brand"
        name="brand"
        className="Data-Field"
        readOnly={isViewMode}
        value={formData.brand || ""}
        onChange={handleInputChange}
        placeholder="Brand"
      />
    </div>
    {/* <div className="VariableGeneralFields-Data">
      <div className="GeneralFields-Data-Tag">
        <label htmlFor="addTags" className="VariableGeneralFields-Data-Label">
          Tags
        </label>
        <SearchMultiple
          name="multiSelect"
          placeholder="Search & Select Tags"
          options={tags.map((tag) => tag.name)}
          onSelect={(option) => handleMultiSelect(option)}
          selectedItems={selectedTags.map((tag) => tag.name)}
          width="212px"
          isViewMode={isViewMode}
        />
      </div>
    </div>
    {selectedTagType ? (
      selectedTagType.type === "image" ? (
        <div className="tag-content">
          <img src="image-path-here.jpg" alt="Selected Tag" />
        </div>
      ) : selectedTagType.type === "text" ? (
        <div className="tag-content">
          <p
            style={{
              color: selectedTagType.text_color,
              backgroundColor: selectedTagType.bg_color,
              width: "110px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "3px",
            }}
          >
            {selectedTagType.text || "Text Content for selected tag"}
          </p>
        </div>
      ) : null
    ) : null} */}
    <div className="VariableGeneralFields-Data">
      <div className="GeneralFields-Data-Tag">
        <label htmlFor="addTags" className="VariableGeneralFields-Data-Label">
          Product Tag
        </label>
        <SearchMultiple
          name="multiSelect"
          placeholder="Search & Select Tags"
          options={tags.map((tag) => tag.name)}
          onSelect={(option) => handleProductTagSelect(option)}
          selectedItems={selectedProductTags.map((tag) => tag.name)}
          width="212px"
          isViewMode={isViewMode}
        />
      </div>
    </div>

    <div className="VariableGeneralFields-Data">
      <div className="GeneralFields-Data-Tag">
        <label htmlFor="addTags" className="VariableGeneralFields-Data-Label">
          Sale Tag
        </label>
        <SearchMultiple
          name="multiSelect"
          placeholder="Search & Select Tags"
          options={tags.map((tag) => tag.name)}
          onSelect={(option) => handleSaleTagSelect(option)}
          selectedItems={selectedSaleTags.map((tag) => tag.name)}
          width="212px"
          isViewMode={isViewMode}
        />
      </div>
    </div>
  </div>
);

/* --- Inventory Section --- */
const VariableInventoryFields = ({
  locationsOptions,
  isStockManagementChecked,
  formData,
  handleInputChange,
  handleManageStockChange,
  handleStockCheckboxChange,
  isViewMode
}) => (
  <div className="Content-VariableGeneralFields">
    <div className="VariableInventoryFields-Data">
      <label htmlFor="sku" className="VariableInventoryFields-Data-Label">
        SKU
      </label>
      <div className="VariableInventoryFields-Dropdown-Container">
        <div className="Inventory-center">
          <input
            type="text"
            id="sku"
            name="sku"
            readOnly={isViewMode}
            className="Data-Field-Inventory"
            value={formData.sku || ""}
            onChange={handleInputChange}
            placeholder="SKU"
          />
        </div>
        <div className="ImageContainer">
          <QuestionMarkCircle size={19} color="var(--questionMark-color)" tooltip="SKU here!" />
        </div>
      </div>
    </div>
    <div className="VariableInventoryFields-Data">
      <label
        htmlFor="variableStockManagement"
        className="VariableInventoryFields-Data-Label"
      >
        Stock Management
      </label>
      <div className="VariableInventoryFields-Dropdown-Container">
        {/* <div className="Inventory-center">
          <input
            type="checkbox"
            disabled={isViewMode}
            checked={isStockManagementChecked}
            onChange={handleStockCheckboxChange}
          />
          <span>Manage Your Stocks</span>
        </div> */}
        <div className="Inventory-center">
          <label className={`checkbox-wrapper ${isViewMode && isStockManagementChecked ? "viewmode-checked" : ""}`}>
            <input
              type="checkbox"
              checked={isStockManagementChecked}
              onChange={handleStockCheckboxChange}
              disabled={isViewMode}
            />
            <span className="custom-checkbox"></span>
            <span>Manage Your Stocks</span>
          </label>
        </div>
        <div className="ImageContainer">
          <QuestionMarkCircle size={19} color="var(--questionMark-color)" tooltip="Stock Management here!" />
        </div>
      </div>
    </div>

    {/* Conditionally render Quantity and Allow Back Order fields based on stock management checkbox */}
    {!isStockManagementChecked && (
      <>
        <div className="GeneralFields-InventoryData-1">
          <label className="VariableInventoryFields-Data-Label">
            Stock Status
          </label>
          <div className="Dropdown-Image-Container-Inventory-1">
            <div className="Inventory-Radiocenter">
              <input
                type="radio"
                id="inStockVariable"
                name="variable_stock_status"
                disabled={isViewMode}
                className="Data-Radio"
                value="inStock"
                onChange={handleManageStockChange}
              />
              <span>In Stock</span>
            </div>
            <div className="Inventory-Radiocenter">
              <input
                type="radio"
                id="outOfStockVariable"
                name="variable_stock_status"
                disabled={isViewMode}
                className="Data-Radio"
                value="outOfStock"
                onChange={handleManageStockChange}
              />
              <span>Out of Stock</span>
            </div>
            {/* <div className="Inventory-Radiocenter-1">
              <input
                type="radio"
                id="backOrderVariable"
                name="variable_stock_status"
                disabled={isViewMode}
                className="Data-Radio"
                value="backOrder"
                onChange={handleManageStockChange}
              />
              <span>Back Order</span>
            </div> */}
          </div>
        </div>
        <div className="VariableInventoryFields-Data">
          <label
            htmlFor="sold_individually"
            className="VariableInventoryFields-Data-Label"
          >
            Sold Individually
          </label>
          <div className="VariableInventoryFields-Dropdown-Container">
            <div className="Inventory-center">
              <input
                type="checkbox"
                id="sold_individually"
                name="sold_individually"
                className="Data-Checkbox"
                disabled={isViewMode}
                checked={formData.sold_individually || false}
                onChange={handleInputChange}
              />
              <span>Limit Purchase 1 purchase per order</span>
            </div>
            <div className="ImageContainer">
              <QuestionMarkCircle size={19} color="var(--questionMark-color)" tooltip="Sold Individually here!" />
            </div>
          </div>
        </div>
      </>
    )}

    {/* Conditionally render Quantity and Allow Back Order fields based on stock management checkbox */}
    {isStockManagementChecked && (
      <>
        <div className="GeneralFields-CheckedData">
          <label
            htmlFor="quantity"
            className="VariableInventoryFields-Data-Label"
          >
            Quantity
          </label>
          <input
                type="text"
                id="quantity"
                name="quantity"
                className="readonly-inputVariation"
                readOnly={isViewMode}
                placeholder="1"
                onChange={handleManageStockChange}
              />
          {/* <div className="VariableInventoryFields-Dropdown-Container">
            <div className="Inventory-center">
              <input
                type="text"
                id="quantity"
                name="quantity"
                className="Data-Field-Quantity"
                readOnly={isViewMode}
                placeholder="1"
                onChange={handleManageStockChange}
              />
            </div>
          </div> */}
        </div>
        <div className="GeneralFields-CheckedData">
          <label
            htmlFor="locations"
            className="VariableInventoryFields-Data-Label"
          >
            Locations
          </label>
          {/* <Dropdowncustom
            options={locationsOptions}
            selected={formData.manage_stock.location}
            onChange={(selectedValue) => handleManageStockChange(selectedValue)}
            dropdownClass="custom-dropdown-Var-locations"
            size={15}
            headerheight="30px"
            isViewMode={isViewMode}
          /> */}
          <input
            type="text"
            value="All Locations" // Display the "All Locations" text in read-only mode
            readOnly
            className="readonly-inputVariation-location" // Optional: You can style this input for better appearance
          />
        </div>
        <div className="GeneralFields-InventoryData-1">
          <label className="VariableInventoryFields-Data-Label">
            Allow Back Order
          </label>
          <div className="Dropdown-Image-Container-Inventory-1">
            <div className="Inventory-Radiocenter">
              <input
                type="radio"
                id="dontAllow"
                disabled={isViewMode}
                name="allow_back_order"
                className="Data-Radio"
                value="doNotAllow"
              />
              <span>Do Not Allow</span>
            </div>
            <div className="Inventory-Radiocenter">
              <input
                type="radio"
                id="notifyCustomer"
                disabled={isViewMode}
                name="allow_back_order"
                className="Data-Radio"
                value="notifyCustomer"
              />
              <span>Allow & Notify Customer</span>
            </div>
          </div>
        </div>
      </>
    )}
  </div>
);

/* --- Shipping Section --- */
const VariableShippingFields = ({
  shippingClassOptions,
  handleChangeShippingClass,
  selectedShippingClass,
  isViewMode
}) => (
  <div className="Content-GeneralFields">
    <div className="GeneralFields-ShippingData">
      <label htmlFor="shippingClass" className="Data-Label-Shipping">
        Shipping Class
      </label>
      <div className="Dropdown-Image-Container">
        <Dropdowncustom
          options={shippingClassOptions}
          selected={selectedShippingClass}
          onChange={handleChangeShippingClass}
          dropdownClass="custom-dropdown-shipping"
          isViewMode={isViewMode}
          size={15}
        />
        <div style={{marginBottom: "8px"}}>
          <QuestionMarkCircle size={19} color="var(--questionMark-color)" tooltip="Shipping Class here!" />
        </div>
      </div>
    </div>
  </div>
);

/* --- Linked Products Section --- */
const VariableLinkedProducts = ({
  handleProductMultiSelect,
  handleRelatedProduct,
  relatedProducts,
  handleNeedProduct,
  needProducts,
  collectionsList,
  selectedProducts,
  products,
  isViewMode
}) => (
  <div className="Content-GeneralFields">
    <div className="GeneralFields-LinkedData">
      <label htmlFor="collections" className="Data-Label-Linked">
        Shop From This Collection
      </label>
      <div className="Dropdown-Image-Container-Linked">
        <div className="Collection-Multisearch-Field">
          <SearchMultiple
            name="multiSelect"
            placeholder="Select products"
            options={products.map((product) => product.name)} // Display only names
            onSelect={(option, isRemoving = false) =>
              handleProductMultiSelect(option, isRemoving)
            }
            selectedItems={selectedProducts.map(
              (uid) => products.find((p) => p.uid === uid)?.name || ""
            )}
            isViewMode={isViewMode}
          />
        </div>
        <div className="ImageContainer">
          <QuestionMarkCircle size={19} color="var(--questionMark-color)" tooltip="Related Products here!" />
        </div>
      </div>
    </div>
    <div className="GeneralFields-LinkedData">
      <label htmlFor="relatedProducts" className="Data-Label-Linked">
        You May Also Like
      </label>
      <div className="Dropdown-Image-Container-Linked">
        <div className="Collection-Multisearch-Field">
          <SearchMultiple
            name="multiSelect"
            placeholder="Select reletad products"
            options={products.map((product) => product.name)}
            onSelect={(option, isRemoving = false) =>
              handleRelatedProduct(option, isRemoving)
            }
            selectedItems={relatedProducts.map(
              (uid) => products.find((p) => p.uid === uid)?.name || ""
            )}
            isViewMode={isViewMode}
          />
        </div>
        <div className="ImageContainer">
          <QuestionMarkCircle size={19} color="var(--questionMark-color)" tooltip="Collection here!" />
        </div>
      </div>
    </div>
    <div className="GeneralFields-LinkedData">
      <label htmlFor="mightNeed" className="Data-Label-Linked">
        You might also need
      </label>
      <div className="Dropdown-Image-Container-Linked">
        <div className="Collection-Multisearch-Field">
          <SearchMultiple
            name="multiSelect"
            placeholder="Select need products"
            options={products.map((product) => product.name)}
            onSelect={(option, isRemoving = false) =>
              handleNeedProduct(option, isRemoving)
            }
            selectedItems={needProducts.map(
              (uid) => products.find((p) => p.uid === uid)?.name || ""
            )}
            isViewMode={isViewMode}
          />
        </div>
        <div className="ImageContainer">
          <QuestionMarkCircle size={19} color="var(--questionMark-color)" tooltip="You May Also Need here!" />
        </div>
      </div>
    </div>
  </div>
);

/* --- Attribute Section --- */
const VariableAttributesFields = ({
  handleSaveAttributes,
  attributes,
  selectedAttributes,
  handleAttributeSelect,
  handleMultiSelect,
  handleDeleteAttribute,
  isViewMode,
  handleButtonClick,
  handleSelectAll,
  isClicked,
  handleDropdownToggle,
  setIsDropdownOpen,
  isDropdownOpen,
  rowRef,
  isActive,
  handleAttributeSelectWithState,
  hasSelectedAttributes,
  isLoading,
}) => (
  <div className="Content-VariableGeneralFields">
    <div className="GeneralFields-AdvanceData">
      <SearchInput
        label="Add Attributes"
        name="addAttributes"
        placeholder="Search & Select Attributes"
        options={attributes.map((attr) => attr.name)} // Show only attribute names
        // onSelect={handleAttributeSelect}
        onSelect={handleAttributeSelectWithState}
        isViewMode={isViewMode}
      />
    </div>

    <div className="GeneralFields-AttributeAccordion">
      {selectedAttributes.length === 0 ? (
        <div className="no-swatch-message-1">No Attribute Selected Yet</div>
      ) : (
        selectedAttributes.map((attribute, index) => (
          <AttributeAccordion
            key={index}
            title={attribute.name}
            content={
              <div className="attribute-content">
                <div className="AccordionRow">
                  <div className="label">Name</div>
                  <div className="label-1">Value</div>
                </div>
                <div
                  ref={rowRef}
                  className={`AccordionRow-SearchSelect ${isDropdownOpen ? 'expanded' : ''}`}
                  style={{
                    overflow: 'hidden', // Prevent content overflow
                    transition: 'height 0.3s ease', // Smooth height transition
                  }}
                >
                  <div className="attribute-name">{attribute.name}</div>
                  <div className="attribute-value">
                    <AttributeSearch
                      name="multiSelect"
                      placeholder={`Enter value for ${attribute.name}`}
                      options={attribute.options.map((option) => option.name)} // Show options of the selected attribute
                      onSelect={(option, isRemoving) =>
                        handleMultiSelect(attribute.name, option, isRemoving)
                      }
                      selectedItems={attribute.selectedOptions}
                      suggestionHeight={'auto'}
                      isViewMode={isViewMode}
                      onDropdownToggle={handleDropdownToggle}
                    />
                  </div>
                </div>
                <div className="checkboxes">
                  <CustomBtn
                    label="Select All"
                    className={`SelectAllBtn ${isClicked ? "clicked" : ""}`}
                    disabled={isViewMode}
                    onClick={() =>
                      handleButtonClick(
                        attribute.name,
                        attribute.options.map((option) => option.name) // Pass all options
                      )
                    }
                    type="button"
                  />
                </div>
              </div>
            }
            handleDelete={() => handleDeleteAttribute(attribute.name)} // Handle attribute deletion
            contentHeight={'auto'}
            isViewMode={isViewMode}
          />
        ))
      )}
    </div>

    {/* {!isViewMode && (
    <div className="SubmitBtn">
      <CustomBtn
        label="Save Attribute"
        className={`AddAttributeBtn ${isActive ? "active" : ""}`}
        disabled={isViewMode}
        onClick={handleSaveAttributes}
        type="button"
      />
    </div>
    )} */}

      {!isViewMode && hasSelectedAttributes && (
        <div className="SubmitBtn">
          <CustomBtn
            label={isLoading ? <div className="btn-loader"></div> : "Save Attribute" }  // Conditionally render text
            className={`AddAttributeBtn ${isActive ? "active" : ""}`}
            disabled={isViewMode || isLoading}  // Disable button while loading
            onClick={handleSaveAttributes}
            type="button"
          >
          </CustomBtn>
        </div>
      )}
  </div>
);

/* --- Variable Section --- */
// const VariableVariationsFields = ({
//   singleImage,
//   setSingleImage,
//   additionalImages,
//   setAdditionalImages,
//   handleVariationSubmit,
//   variableTaxTypeOptions,
//   variableTaxClassOptions,
//   handleVariationChange,
//   shippingClassOptions,
//   handleChangeShippingClass,
//   selectedShippingClass,
//   variations,
//   handleChangeTaxStatus,
//   generateVariationNumber,
//   selectedTaxStatus,
//   saleOptions,
//   selectedSale,
//   selectedTaxClass,
//   isEdit,
//   isViewMode,
//   isActive,
//   isLoading,
//   isVariationBtn
// }) => (
//   <div className="Content-GeneralFields">
//     <div className="GeneralFields-VariationData-1">
//       {/* <label htmlFor="shippingClass" className="Data-Label-Linked">
//         Default Form Values
//       </label>
//       <div className="Dropdown-Image-Container-Linked">
//         <Dropdowncustom
//           options={shippingClassOptions}
//           selected={selectedShippingClass}
//           onChange={handleChangeShippingClass}
//           dropdownClass="custom-dropdown-VariationsAttributes"
//           isViewMode={isViewMode}
//           size={15}
//         />
//         <Dropdowncustom
//           options={shippingClassOptions}
//           selected={selectedShippingClass}
//           onChange={handleChangeShippingClass}
//           dropdownClass="custom-dropdown-VariationsAttributes"
//           isViewMode={isViewMode}
//           size={15}
//         />
//       </div> */}
//     </div>
//     {variations.length === 0 ? (
//       // <p>
//       //   No variations generated yet...
//       //   <br /> <strong>Noted:</strong> For generating variations add more than
//       //   one attribute{" "}
//       // </p>
//       <p>
//         No variations generated yet...
//         <br /> 
//         <strong>Noted:</strong>
//         <span style={{ color: 'red' }}>
//           {" "}For generating variations add more than one attribute
//         </span>
//       </p>
//     ) : (
//       variations.map((variation, index) => (
//         <VariationAccordion
//           key={index}
//           title={
//             <div className="variation-title">
//               <span className="serialNo">
//                 #{generateVariationNumber(index)}
//               </span>
//               <div className="variation-boxes">
//                 {/* Render the options in box-style */}
//                 {variation.map((option, i) => {
//                   // Truncate option name to show only 3 words or a fixed number of characters
//                   const truncatedOption =
//                     option.split(" ").slice(0, 3).join(" ") +
//                     (option.split(" ").length > 3 ? "..." : "");

//                   return (
//                     <div
//                       key={i}
//                       className="variation-box"
//                       title={option} // Tooltip will show the full option name on hover
//                     >
//                       {truncatedOption}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           }
//           content={
//             <div className="Variation-Content">
//               <VariationForm
//                 ind={index}
//                 SaleOptions={saleOptions}
//                 selectedSale={selectedSale}
//                 selectedTaxStatus={selectedTaxStatus}
//                 selectedTaxClass={selectedTaxClass}
//                 variableTaxClassOptions={variableTaxClassOptions}
//                 handleChangeTaxStatus={handleChangeTaxStatus}
//                 handleVariationChange={handleVariationChange}
//                 variableTaxTypeOptions={variableTaxTypeOptions}
//                 isEdit={isEdit}
//                 isViewMode={isViewMode}
//               />
//             </div>
//           }
//           handleDelete={() => console.log(`Delete variation ${index + 1}`)} // Handle delete logic here
//           toggleLabel="Edit"
//           headerBgColor="var(--third-layer-bg)"
//           contentBgColor="transparent"
//           isViewMode={isViewMode}
//         />
//       ))
//     )}

//     {/* {!isViewMode && (
//     <div className="SubmitBtn">
//       <CustomBtn
//         label="Save Variations"
//         className="AddVariationsBtn"
//         disabled={isViewMode}
//         onClick={handleVariationSubmit}
//         type="button"
//       />
//     </div>
//     )} */}

//     {!isViewMode && isVariationBtn && (
//         <div className="SubmitBtn">
//           <CustomBtn
//             label={isLoading ? <div className="btn-loader"></div> : "Save Variations" }  // Conditionally render text
//             className={`AddAttributeBtn ${isActive ? "active" : ""}`}
//             disabled={isViewMode || isLoading}  // Disable button while loading
//             onClick={handleVariationSubmit}
//             type="button"
//           >
//           </CustomBtn>
//         </div>
//       )}

//   </div>
// );


/* --- Variable Section --- */
const VariableVariationsFields = ({
  singleImage,
  setSingleImage,
  additionalImages,
  setAdditionalImages,
  handleVariationSubmit,
  variableTaxTypeOptions,
  variableTaxClassOptions,
  handleVariationChange,
  shippingClassOptions,
  handleChangeShippingClass,
  selectedShippingClass,
  variations,
  handleChangeTaxStatus,
  generateVariationNumber,
  selectedTaxStatus,
  saleOptions,
  selectedSale,
  selectedTaxClass,
  isEdit,
  isViewMode,
  isActive,
  isLoading,
  isVariationBtn,
  activeAccordion,
  handleAccordionToggle
}) => (
  <div className="Content-GeneralFields">
    <div className="GeneralFields-VariationData-1">
    </div>
    {variations.length === 0 ? (
      <>
      <div className="Empty-Swatch-Status">
        <div className="no-swatch-container">
          <div className="no-swatch-message">No Variations Generated Yet
            <br /> 
            <strong>Noted:</strong>
            <span style={{ color: 'red' }}>
              {" "}For generating variations add more than one attribute
            </span>
          </div>
        </div>
      </div>
    </>
    ) : (
      variations.map((variation, index) => (
        <VariationAccordion
          key={index}
          title={
            <div className="variation-title">
              <span className="serialNo">
                #{generateVariationNumber(index)}
              </span>
              <div className="variation-boxes">
                {/* Render the options in box-style */}
                {variation.map((option, i) => {
                  // Truncate option name to show only 3 words or a fixed number of characters
                  const truncatedOption =
                    option.split(" ").slice(0, 3).join(" ") +
                    (option.split(" ").length > 3 ? "..." : "");

                  return (
                    <div
                      key={i}
                      className="variation-box"
                      title={option} // Tooltip will show the full option name on hover
                    >
                      {truncatedOption}
                    </div>
                  );
                })}
              </div>
            </div>
          }
          content={
            <div className="Variation-Content">
              <VariationForm
                ind={index}
                SaleOptions={saleOptions}
                selectedSale={selectedSale}
                selectedTaxStatus={selectedTaxStatus}
                selectedTaxClass={selectedTaxClass}
                variableTaxClassOptions={variableTaxClassOptions}
                handleChangeTaxStatus={handleChangeTaxStatus}
                handleVariationChange={handleVariationChange}
                variableTaxTypeOptions={variableTaxTypeOptions}
                isEdit={isEdit}
                isViewMode={isViewMode}
              />
            </div>
          }
          isOpen={activeAccordion === index}
          toggleAccordion={() => handleAccordionToggle(index)}
          headerBgColor="var(--third-layer-bg)"
          contentBgColor="transparent"
          isViewMode={isViewMode}
        />
      ))
    )}

    {!isViewMode && isVariationBtn && (
        <div className="SubmitBtn">
          <CustomBtn
            label={isLoading ? <div className="btn-loader"></div> : "Save Variations" }  // Conditionally render text
            className={`AddAttributeBtn ${isActive ? "active" : ""}`}
            disabled={isViewMode || isLoading}  // Disable button while loading
            onClick={handleVariationSubmit}
            type="button"
          >
          </CustomBtn>
        </div>
      )}

  </div>
);


/* --- Advance Section --- */
const VariableAdvanceFields = ({ handleInputChange, formData, isViewMode }) => (
  <div className="Content-GeneralFields">
    <div className="GeneralFields-AdvanceData">
      <label htmlFor="shortDescription" className="Data-Label">
        Short Description
      </label>
      <textarea
        id="short_description"
        name="short_description"
        className="Data-Field-Advance"
        placeholder="Text Field"
        readOnly={isViewMode}
        rows="4" // Set desired number of rows
        cols="50" // Adjust as needed
        value={formData.short_description}
        onChange={handleInputChange}
      />
    </div>
    <div className="GeneralFields-AdvanceData">
      <label htmlFor="purchaseNote" className="Data-Label">
        Purchase Note
      </label>
      <textarea
        id="purchase_note"
        name="purchase_note"
        className="Data-Field-Advance"
        placeholder="Text Field"
        readOnly={isViewMode}
        rows="4" // Set desired number of rows
        cols="50" // Adjust as needed
        value={formData.purchase_note}
        onChange={handleInputChange}
      />
    </div>
    <div className="GeneralFields-AdvanceData">
      <label htmlFor="menuOrder" className="Data-Label">
        Menu Order
      </label>
      <input
        type="text"
        id="menu_order"
        name="menu_order"
        readOnly={isViewMode}
        className="Data-Field"
        placeholder="Text Field"
        value={formData.menu_order}
        onChange={handleInputChange}
      />
    </div>
    {/* <div className="GeneralFields-AdvanceData">
      <label htmlFor="enable_review" className="Data-Label">
        Enable Reviews
      </label>
      <input
        type="checkbox"
        id="enable_review"
        name="enable_review"
        disabled={isViewMode}
        className="Data-Checkbox"
        checked={formData.enable_review === 1}
        onChange={handleInputChange}
      />
    </div> */}
    <div className="GeneralFields-AdvanceData">
      <label htmlFor="enable_review" className="Data-Label">
        Enable Reviews
      </label>
      <label
        className={`checkbox-wrapper Data-Checkbox-2nd ${
          isViewMode && formData.enable_review === 1 ? "viewmode-checked" : ""
        }`}
      >
        <input
          type="checkbox"
          id="enable_review"
          name="enable_review"
          disabled={isViewMode}
          checked={formData.enable_review === 1}
          onChange={handleInputChange}
        />
        <span className="custom-checkbox"></span>
      </label>
    </div>
  </div>
);

/* --- Swatches Section --- */
const VariableSwatchFields = ({
  accordionsData,
  setAccordionsData,
  handleInputChange,
  attributeTypeOptions,
  selectedAttributeType,
  setSelectedAttributeType,
  handleSwatchSubmit,
  handleTypeChange,
  renderOptionContent,
  setActiveIndex,
  activeIndex,
  handleOptionValueChange,
  isViewMode,
  isSwatchBtn,
  isLoading,
  isActive
}) => (
  <div className="Content-GeneralFields">
    <div className="GeneralFields-VariationData">
      {accordionsData.length === 0 ? (
        <>
          <div className="Empty-Swatch-Status">
            <div className="no-swatch-container">
              <div className="no-swatch-message">No Swatches Generated Yet
                <br /> 
                <strong>Noted:</strong>
                <span style={{ color: 'red' }}>
                  {" "}For generating swatches add atleast one attribute
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        accordionsData.map((attribute, attributeIndex) => (
          <SwatchAccordion
            key={attributeIndex}
            title={
              <div className="Swatch-Header">
                <div className="Swatch-attribute-name">{attribute.name}</div>
                <div className="Type-Selection">
                  <label htmlFor="attributeType" className="attrDropdown">
                    Attribute Type
                  </label>
                  <div onClick={(e) => e.stopPropagation()}>
                    <DropdownSwatch
                      optionsmap={attributeTypeOptions}
                      selectedOption={attribute.type.charAt(0).toUpperCase() + attribute.type.slice(1) || selectedAttributeType}
                      handleOptionChange={(selectedValue) => {
                        setSelectedAttributeType(selectedValue);
                        handleTypeChange(attributeIndex, selectedValue);
                        setActiveIndex(attributeIndex);
                        {
                          {/*console.log("Active Index: ", activeIndex);*/}
                        }
                      }}
                      isViewMode={isViewMode}
                    />
                  </div>
                </div>
              </div>
            }
            content={
              <div className="parent-accordion-content borderless">
                {attribute.options.map((option, optionIndex) => (
                  <AttributeAccordion
                    key={option._id}
                    title={option.name}
                    content={renderOptionContent(
                      attribute.type,
                      option,
                      attributeIndex,
                      optionIndex,
                      isViewMode
                    )}
                    showDeleteIcon={false}
                    flexDirection="row"
                    contentBgColor="transparent"
                    isViewMode={isViewMode}
                  />
                ))}
              </div>
            }
            showDeleteIcon={false}
            showToggleIcon={false}
            isViewMode={isViewMode}
          />
        ))
      )}
    </div>

    {/* {!isViewMode && (
    <div className="SubmitBtn">
      <CustomBtn
        label="Save Swatches"
        className="AddSwitchBtn"
        disabled={isViewMode}
        onClick={handleSwatchSubmit}
        type="button"
      />
    </div>
    )} */}

    {!isViewMode && isSwatchBtn && (
      <div className="SubmitBtn">
        <CustomBtn
          // label="Save Swatches"
          // className="AddSwitchBtn"
          // disabled={isViewMode}
          // onClick={handleSwatchSubmit}
          // type="button"
          label={isLoading ? <div className="btn-loader"></div> : "Save Swatches" }  // Conditionally render text
          className={`AddAttributeBtn ${isActive ? "active" : ""}`}
          disabled={isViewMode || isLoading}  // Disable button while loading
          onClick={handleSwatchSubmit}
          type="button"
        />
      </div>
    )}
  </div>
);

export default AddProduct;
