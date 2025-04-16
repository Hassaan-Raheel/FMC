import React, { useRef, useState, useEffect } from 'react'
import './Categorydescription.css'
import '../../../Pages/Page/GeneralPage.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import uploadImageIcon from '../../../Assets/Images/uploadImg 48 x 48.png'
// import axios from 'axios'
import CMSHead from '../../UI-Controls/CMSHead/CMSHead';
import { Url } from '../../../Services/Api';
import axios from 'axios';
import crossBtn from '../../../Assets/Images/cross-button-32-X-32.png'
import { IoClose } from "react-icons/io5";
import { useLocation } from 'react-router-dom';
import ImageGalleryPopup from '../../UI-Controls/PopUp/ImageGalleryPapup/ImageGalleryPopup';
import { uploadImage } from '../../../Services/functions';
import JoditEditor from "jodit-react";
import '../../../../src/JoditEditorStyle.css';
import GalleryUpload from '../../UI-Controls/GalleryUpload/GalleryUpload';

const CategoryDescription = () => {

  const editor = useRef(null); // Reference for JoditEditor
  const [editorData, setEditorData] = useState('')
  const [modalView, setModalView] = useState(false)
  const [infoModal, setInfoModal] = useState(false);
  const [uploadType, setUploadType] = useState('');
  const [uploadedStatus, setUploadedStates] = useState('');
  const [mediaDeta, setMediaData] = useState([])
  const [imageSendPayload, setImageSendPayload] = useState({
    file: null,
    alt_text: '',
    title: '',
    description: '',
    usedin: [],
    link_url: '',
  });
  const [currentModalIndex, setCurrentModalIndex] = useState(null)
  const [combinedState, setCombinedState] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Visual");
  const [editorContent, setEditorContent] = useState({
    "slugName": '',
    content: "",
    content_images: []
  }); // To store text editor content

  const location = useLocation()
  const subCategoryData = location.state

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const api = `${Url}/api/v1/media/global/add`

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

  // get images in gallery modal
  const getApi = async () => {
    try {
      const response = await axios.get(`${Url}/api/v1/media/global/get`)
      setMediaData(response.data.media)
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    getApi();
  }, []);

  // fetch description data
  useEffect(() => {
    const fetchEditorContent = async () => {
      const api = `/api/v1/sub-category/get`;
      try {
        const response = await axios.get(`${Url + api}/${subCategoryData.slug}`);
        const apiData = response.data;
        setCombinedState(apiData)

      } catch (error) {
        console.error("error geting content", error)
      }
    }
    fetchEditorContent()
  }, [])

  useEffect(() => { console.log("combined state data", combinedState) }, [combinedState])

  /* --- Jodit Editor Configuration --- */
  const configEditor = {
    buttons: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "paragraph", // Adds paragraph options
      "fontsize", // Adds font size options
      "lineHeight", // Adds line height options
      "|",
      "ul", // Unordered list
      "ol", // Ordered list
      "|",
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
      height: "400px",
    },
    toolbarAdaptive: false,
    toolbarSticky: false,
  };

  const handleEditorOnChange = (newContent) => {
    setCombinedState((prevState) => ({
      ...prevState,
      slugName: subCategoryData.slug,
      content: newContent
    }));
  };

  // get editor data
  // const handleEditorOnChange = (editor) => {
  //   const data = editor.getData()
  //   setCombinedState((prevState) => ({
  //     ...prevState,
  //     slugName: subCategoryData.slug,
  //     content: data
  //   }))
  // }

  // update description data
  // const handleDescriptionSet = async () => {
  //   const api = `/api/v1/sub-category/edit`
  //   try {
  //     const response = await axios.put(`${url}${api}`, combinedState);
  //     console.log("res", response)
  //   } catch (error) {
  //     console.error("error updating description", error);
  //   }
  // }

  const handleDeleteImage = (index) => {
    setCombinedState((prevState) => {
      const updatedContentImages = [...prevState.content_images];

      // Update the specific image at the index
      updatedContentImages[index] = {
        ...updatedContentImages[index],
        image_url: '', // Clear the image_url
      };

      // Return the updated state
      return {
        ...prevState, // Preserve other state properties
        content_images: updatedContentImages, // Update only the content_images
      };
    });
  }

  // open Gallery modal
  const handleOpenModal = (index) => {
    setModalView(true)
    setCurrentModalIndex(index)
  }
  const handleModalClose = () => {
    setModalView(false)
    setCurrentModalIndex(null)
  }

  const handleImageSelect = (image) => {
    setCombinedState((prevState) => {
      const updatedContentImages = [...prevState.content_images]; // Create a shallow copy of the array
      updatedContentImages[currentModalIndex] = {
        ...updatedContentImages[currentModalIndex], // Preserve other properties of the object
        image_url: image.image_url // Update the image_url
      };

      return {
        ...prevState,
        content_images: updatedContentImages
      };
    });
    // console.log("sombinedState after image select", combinedState)
    setModalView(false)
  };

  // update description data
  const handleDescriptionSet = async () => {
    const api = `/api/v1/sub-category/edit`
    const payload = {
      content: combinedState.content,
      content_images: combinedState.content_images,
      slugName: subCategoryData.slug


    };
    //  console.log("before send to api ", payload)
    try {
      const response = await axios.put(`${Url + api}`, payload);
      console.log("category description", response)
    } catch (error) {
      console.error("error updating description", error);
    }
  }

  return (
    <div className='category-description-main-section'>
      <CMSHead
        heading={'Category Description'}
        buttonText={'Save'}
        isButtonVissible={true}
        sendImagesHomeSlider={handleDescriptionSet}
      />
      <div className='category-description-body'>
        <div className='category-editer-section'>
          <div className="custom-editor-pageSection">

            <div className="Policy-Editor">
              <div className="Editor-Row">
                <div className="General-Editor-Container">
                  <div className="General-Editor-Tabs">
                    <div
                      className={`Tab ${selectedTab === "Visual" ? "active" : ""}`}
                      onClick={() => setSelectedTab("Visual")}
                    >
                      Visual
                    </div>
                    <div
                      className={`Tab ${selectedTab === "Text" ? "active" : ""}`}
                      onClick={() => setSelectedTab("Text")}
                    >
                      Text
                    </div>
                  </div>
                  <div className="General-Editor-Content">
                    {selectedTab === "Visual" ? (
                      <JoditEditor
                        ref={editor}
                        value={combinedState.content}
                        tabIndex={1}
                        onBlur={(newContent) => handleEditorOnChange(newContent)}
                        config={configEditor}
                      />
                    ) : (
                      <textarea
                        id="contentDescription"
                        name="contentDescription"
                        value={combinedState.content}
                        onChange={(e) => setCombinedState(e.target.value)}
                        className="General-Editor-Text-Area"
                        placeholder="Content Description"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        

        <div className='category-description-images-container'>
          {Array.from({ length: 10 }).map((_, index) => {
            const item = combinedState?.content_images?.[index]; // Get item if it exists

            return item && item.image_url ? (
              <div className='category-description-single-image' key={index}>
                <button className='category-description-img-dlt-btn' onClick={() => handleDeleteImage(index)}>
                  <IoClose size={15} color='#595959' />
                </button>
                <img src={`${Url + item.image_url}`} alt='item' />
              </div>
            ) : (
              // <div className='upload-image-div' key={index} onClick={() => handleOpenModal(index)}>
              //   <img src={uploadImageIcon} alt='upload-image-icon' />
              // </div>
              <GalleryUpload 
                openModal={() => handleOpenModal(index)}
                fontSize='8px'
                width='100%'
              />
            );
          })}
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
        data={mediaDeta}
      />
    </div>
  )
}

export default CategoryDescription
