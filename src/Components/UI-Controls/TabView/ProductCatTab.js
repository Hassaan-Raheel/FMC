import React, { useState } from 'react';
import './TabBarView.css';
import { FaPlus, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Url } from "../../../Services/Api";

const SEOSection = ({ metaData, handleInputChange, accordions, viewType,
    keyPhrase, handleKeyPhraseChange, handleViewChange, isAccordionOpen, toggleAccordion, isAccordionAdvanceOpen,
    toggleAdvanceAccordion }) => (
    <div style={{ width: '100%', boxSizing: 'border-box', color: 'var(--text-color-1)', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column', lineHeight: '10px', }}>
        <label style={{ paddingLeft: '10px', }}>Focus Keyphrase</label>
        <input type="text" placeholder="Keyphrase" style={{ width: '95%', height: '30px', marginLeft: '10px', border: "var(--standered-border)", }} />
        <br />

        <hr style={{ width: '103%', border: 'var(--standered-border-1)' }} />

        <div style={{ color: 'var(--text-color-1)', marginTop: 5, marginBottom: 10, paddingLeft: '10px', }}>
            <label>Search Appearance</label>
            <p style={{ fontSize: '11.5px', marginLeft: 5, }}>Determine how your post look in the search result</p>
        </div>

        <label style={{ paddingLeft: '10px', }}>Preview as</label>
        <div style={{ paddingLeft: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '270px', }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <input
                    type="radio"
                    id="mobile_view"
                    name="viewType"
                    value="mobile"
                    checked={viewType === 'mobile'}
                    onChange={handleViewChange}
                    style={{ width: '15px', height: '15px', marginRight: '10px' }}
                />
                <label htmlFor="mobile_view" style={{ fontFamily: 'var(--font-family)', color: 'black', fontSize: '11.5px', }}>Mobile View</label><br />
            </div><div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <input
                    type="radio"
                    id="desktop_view"
                    name="viewType"
                    value="desktop"
                    checked={viewType === 'desktop'}
                    onChange={handleViewChange}
                    style={{ width: '15px', height: '15px', marginRight: '10px' }}
                />
                <label htmlFor="desktop_view" style={{ fontFamily: 'var(--font-family)', color: 'black', fontSize: '11.5px', }}>Desktop View</label>
            </div></div>

        {viewType && (
            <div style={{
                width: '295px',
                height: '40px',
                marginLeft: '10px',
                backgroundColor: viewType === 'mobile' ? 'var(--primary-color)' : 'var(--primary-color-opacity)',
                color: viewType === 'mobile' ? 'white' : 'var(--primary-color)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
            }}>
                <span>{viewType === 'mobile' ? 'Mobile View' : 'Desktop View'} Card</span>
            </div>
        )}

        <label style={{ paddingLeft: '10px', color: 'var(--text-color-1)' }}>SEO Title</label>
        <input
            type="text"
            placeholder="SEO Title"
            name="metaTitle"
            value={metaData.metaTitle}
            onChange={handleInputChange}
            style={{ width: '95%', height: '35px', marginLeft: '10px', background: 'var(--third-layer-bg)', border: 'var(--standered-border)', }}
        />
        <br />

        <label style={{ paddingLeft: '10px', color: 'var(--text-color-1)' }}>Meta Description</label>
        <input
            type="text"
            placeholder="Meta Description"
            name="metaDescription"
            style={{ width: '95%', height: '35px', background: 'var(--third-layer-bg)', border: 'var(--standered-border)', marginLeft: '10px' }}
            value={metaData.metaDescription}
            onChange={handleInputChange}
        />
        <br />

        <div style={{ width: '100%', }}>
            {accordions.map((accordion, index) => (
                <div key={index}>
                    <div
                        onClick={() => toggleAccordion(index)}
                        style={{
                            width: '103%',
                            height: 'auto',
                            cursor: 'pointer',
                            border: 'var(--standered-border)',
                            borderLeft: 'none',
                            borderRight: 'none',
                            padding: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                        }}
                    >
                        <div style={{ lineHeight: '18px' }}>
                            <FaPlus style={{ marginRight: '8px', fontSize: 'var(--font-size-small)', }} />
                            <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--font-size-large)', color: 'var(--text-color-1)' }}>Add Related Keyphrase</span>
                        </div>
                        <div>
                            {accordion.isAccordionOpen ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                    </div>

                    <div
                        style={{
                            maxHeight: accordion.isAccordionOpen ? '300px' : '0',
                            opacity: accordion.isAccordionOpen ? 1 : 0,
                            width: '102%',
                            overflow: 'hidden',
                            transition: 'max-height 0.5s ease, opacity 0.5s ease',
                            borderBottom: accordion.isAccordionOpen ? 'var(--standered-border)' : 'none',
                            padding: accordion.isAccordionOpen ? '10px' : '0 10px',
                        }}
                    >
                        <label>Related Keyphrase</label>
                        <span
                            style={{
                                display: 'block',
                                width: '100%',
                                height: '20px',
                                lineHeight: '18px',
                                padding: '5px',
                                fontSize: '11.5px',
                            }}
                        >
                            {accordion.keyPhrase || ''}
                        </span>

                        <br />
                        <label>Keyphrase</label>
                        <input
                            type="text"
                            placeholder="Keyphrase"
                            value={accordion.keyPhrase}
                            onChange={(e) => handleKeyPhraseChange(index, e.target.value)}
                            style={{
                                width:'100%',
                                height: '32px',
                                marginBottom: '10px',
                                transition: 'opacity 0.5s ease',
                                border: 'var(--standered-border)',
                                background: 'var(--third-layer-bg)',
                            }}
                        />
                        <br />
                        <label>Synonyms</label>
                        <input
                            type="text"
                            placeholder="Synonyms"
                            style={{
                                width: '100%',
                                height: '32px',
                                transition: 'opacity 0.5s ease',
                                border: 'var(--standered-border)',
                                background: 'var(--third-layer-bg)',
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>

        <div
            onClick={toggleAdvanceAccordion}
            style={{
                cursor: 'pointer',
                border: 'none',
                padding: '10px',
                width: '102%',
                height: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
            }}
        >
            <div>
                <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--font-size-large)', color: 'var(--text-color-1)', }}>Advance</span>
            </div>
            <div>{isAccordionAdvanceOpen ? <FaChevronUp /> : <FaChevronDown />}</div>
        </div>

        <div
            style={{
                maxHeight: isAccordionAdvanceOpen ? '300px' : '0',
                opacity: isAccordionAdvanceOpen ? 1 : 0,
                overflow: 'hidden',
                width: '103%',
                borderTop: isAccordionAdvanceOpen ? 'var(--standered-border)' : 'none',
                transition: 'max-height 0.5s ease, opacity 0.5s ease',
                padding: isAccordionAdvanceOpen ? '10px' : '0 10px',
            }}
        >
            <p style={{ fontSize: '11.5px', fontWeight: 500, margin: '5px' }}>
                Allow search engines to show this content in search results?
            </p>
            <input
                type="text"
                placeholder=""
                style={{
                    width: '100%',
                    height: '32px',
                    marginBottom: '10px',
                    transition: 'opacity 0.5s ease',
                    border: 'var(--standered-border)',
                    background: 'var(--third-layer-bg)',
                }}
            />
            <br />
            <label style={{ color: 'var(--text-color-1)' }}>Breadcrumbs Title ?</label>
            <input
                type="text"
                placeholder=""
                style={{
                    width: '100%',
                    height: '32px',
                    marginBottom: '10px',
                    transition: 'opacity 0.5s ease',
                    border: 'var(--standered-border)',
                    background: 'var(--third-layer-bg)',
                }}
            />
            <br />
            <label style={{ color: 'var(--text-color-1)' }}>Canonical URL ?</label>
            <input
                type="text"
                placeholder=""
                style={{
                    width: '100%',
                    height: '32px',
                    transition: 'opacity 0.5s ease',
                    border: 'var(--standered-border)',
                    background: 'var(--third-layer-bg)',
                }}
                name='canonicalUrl'
                value={metaData.canonicalUrl}
                onChange={handleInputChange}
            />
        </div>

    </div>
);

const SocialSection = ({ handleInputChange, metaData, selectedImage, isHovered, setIsHovered,
    toggleXAppearanceAccordion, isAccordionXOpen, handleGalleryModalOpen, cancelSocialImage, handleImageSelect,
    isEditing, selectedXImage, cancelXImage }) => (

    <div style={{ color: 'var(--text-color-1)', width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column', lineHeight: '10px', }}>
        <label style={{ paddingLeft: '10px', }}>Social Media Appearance</label>
        <span style={{ fontSize: '10px', lineHeight: '12px', paddingLeft: '10px', }}>Determine how your post look on social media like Facebook, X, Instagram, Whatsapp, Threads, LinkedIn, Slack & more.</span>
        <br />
        <label style={{ fontSize: '11.5px', paddingLeft: '10px', color: 'var(--text-color-1)', }}>Social Share Preview</label>
        <div style={{
            margin: '0 0 10px 10px',
            border: 'var(--standered-border)',
            color: 'var(--text-color-1)',
            borderRadius: 'var(--standered-radius)',
            background: 'var(--second-layer-bg)',
            width: '95%',
            position: 'relative'
        }}>
            <div style={{ color: 'var(--text-color-1)', height: '150px', borderBottom: 'var(--standered-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                {selectedImage ? (
                    <>
                        <img
                            src={isEditing ? `${Url+selectedImage}` : `${Url+selectedImage}`}
                            alt="Selected"
                            className="image-preview"
                        />
                        <button
                            onClick={cancelSocialImage}
                            onChange={handleImageSelect}
                            style={{
                                position: 'absolute',
                                top: '5px',
                                right: '5px',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'red',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                zIndex: 1
                            }}
                        >
                            &times;
                        </button>
                    </>
                ) : (
                    <label
                        style={{ cursor: 'pointer', textDecoration: isHovered ? 'underline' : 'none', color: isHovered ? 'var(--primary-color)' : 'var(--text-color)' }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={() => handleGalleryModalOpen('socialImage')}
                    >
                        <span style={{fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-small)'}}>Select an Image</span>
                    </label>
                )}
            </div>
            <div style={{ height: '65px', color: 'var(--text-color-1)', }}>
                <span
                    style={{
                        display: 'block',
                        width: '240px',
                        height: '20px',
                        lineHeight: '10px',
                        padding: '8px 0 0 8px',
                        fontSize: '11.5px',
                        fontWeight: 'var(--font-weight-semi-bold)',
                    }}
                >
                    {metaData.ogTitle}
                </span>
                <span
                    style={{
                        display: 'block',
                        width: '240px',
                        height: '20px',
                        lineHeight: '10px',
                        padding: '0 0 0 8px',
                        fontSize: '11.5px',
                    }}
                >
                    {metaData.ogDescription}
                </span>
                <br />
            </div>
        </div>

        <label style={{ paddingLeft: '10px', color: 'var(--text-color-1)', }}>Social Title</label>
        <input
            type="text"
            placeholder="Social Title"
            name='ogTitle'
            value={metaData.ogTitle}
            onChange={handleInputChange}
            style={{ color: 'var(--text-color-1)', background: 'var(--third-layer-bg)', width: '95%', height: '32px', marginLeft: '10px', border: 'var(--standered-border)' }}
        />
        <label style={{ paddingLeft: '10px', color: 'var(--text-color-1)', }}>Social Description</label>
        <textarea
            type="text"
            placeholder="Social Description"
            name='ogDescription'
            value={metaData.ogDescription}
            onChange={handleInputChange}
            style={{ background: 'var(--third-layer-bg)', color: 'var(--text-color-1)', width: '95%', height: '40px', marginLeft: '10px', border: 'var(--standered-border)', resize: 'none', overflow: 'hidden', }}
        />
        <span style={{ fontSize: '10px', lineHeight: '13px', paddingLeft: '10px', }}>
            To customize the appearance of your post specifically for X, please fill out the 'X Appearance' setting below.
            if you leave these settings untouched. the 'Social Media Appearance' setting mentioned above will also be applied
            for sharing on X.
        </span>
        <br />

        <div
            onClick={toggleXAppearanceAccordion}
            style={{
                marginTop: '10px',
                cursor: 'pointer',
                border: 'var(--standered-border)',
                borderLeft: 'none',
                borderRight: 'none',
                borderBottom: 'none',
                padding: '10px',
                width: '103%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
            }}
        >
            <div>
                <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--font-size-large)', color: 'var(--text-color)', }}>X Appearance</span>
            </div>
            <div>{isAccordionXOpen ? <FaChevronUp /> : <FaChevronDown />}</div>
        </div>

        <div
            style={{
                maxHeight: isAccordionXOpen ? '600px' : '0',
                opacity: isAccordionXOpen ? 1 : 0,
                width: '103%',
                overflow: 'hidden',
                transition: 'max-height 0.5s ease, opacity 0.5s ease',
                borderTop: isAccordionXOpen ? 'var(--standered-border)' : 'none',
                padding: isAccordionXOpen ? '10px' : '0 10px',
            }}
        >
            <label style={{ fontSize: '11.5px', marginLeft: '10px', color: 'var(--text-color-1)', }}>X Share Preview</label>
            <div style={{
                margin: '5px 0 10px 5px',
                border: 'var(--standered-border)',
                borderRadius: 'var(--standered-radius)',
                background: 'var(--second-layer-bg)',
                width: '95%',
                position: 'relative'
            }}>
                <div style={{ height: '150px', borderBottom: 'var(--standered-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {selectedXImage ? (
                        <>
                            <img
                                src={isEditing ? `${Url+selectedXImage}` : `${Url+selectedXImage}`}
                                alt="Selected"
                                className="image-preview"
                            />
                            <button
                                onClick={cancelXImage}
                                style={{
                                    position: 'absolute',
                                    top: '5px',
                                    right: '5px',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'red',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    zIndex: 1
                                }}
                            >
                                &times;
                            </button>
                        </>
                    ) : (
                        <label
                            style={{ cursor: 'pointer', textDecoration: isHovered ? 'underline' : 'none', color: isHovered ? 'var(--primary-color)' : 'var(--text-color)' }}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            onClick={() => handleGalleryModalOpen('X-Image')}
                        >
                            <span style={{fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-small)'}}>Select an Image</span>
                        </label>
                    )}
                </div>
                <div style={{ height: '65px' }}>
                    <span
                        style={{
                            display: 'block',
                            width: '240px',
                            height: '20px',
                            lineHeight: '10px',
                            padding: '8px 0 0 8px',
                            fontSize: '11.5px',
                            fontWeight: 'var(--font-weight-semi-bold)',
                        }}
                    >
                        {metaData.xTitle}
                    </span>
                    <span
                        style={{
                            display: 'block',
                            width: '240px',
                            height: '20px',
                            lineHeight: '10px',
                            padding: '0 0 0 8px',
                            fontSize: '11.5px',
                        }}
                    >
                        {metaData.xDescription}
                    </span>
                    <br />
                </div>
            </div>
            <label style={{color: 'var(--text-color-1)'}}>X Title:</label>
            <input
                type="text"
                placeholder="X Title"
                name='xTitle'
                value={metaData.xTitle}
                onChange={handleInputChange}
                style={{ width: '98%', height: '32px', background: 'var(--third-layer-bg)',  border: 'var(--standered-border)'}}
            />
            <br />
            <label style={{color: 'var(--text-color-1)', }}> X Description:</label>
            <textarea
                type="text"
                placeholder="X Description"
                name='xDescription'
                value={metaData.xDescription}
                onChange={handleInputChange}
                style={{ width: '98%', height: '40px', border: 'var(--standered-border)', background: 'var(--third-layer-bg)', resize: 'none', overflowY: 'hidden' }}
            />
        </div>
    </div>
);

const TabBarView = ({ onKeyPhrasesChange, handleInputChange, metaData, updateCategoryData, handleGalleryModalOpen, 
    cancelSocialImage, selectedImage, setSelectedImage, isEditing, setIsEditing, handleImageSelect, 
    selectedXImage, setSelectedXImage, cancelXImage, accordions, setAccordions }) => {

    const [activeTab, setActiveTab] = useState('SEO');
    const [viewType, setViewType] = useState('');
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const [isAccordionAdvanceOpen, setIsAccordionAdvanceOpen] = useState(false);
    const [keyPhrase, setKeyPhrase] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const [isAccordionXOpen, setIsAccordionXOpen] = useState(false);

    const toggleAccordion = (index) => {
        const newAccordions = [...accordions];
        newAccordions[index].isAccordionOpen = !newAccordions[index].isAccordionOpen;
        setAccordions(newAccordions);
    };

    const toggleAdvanceAccordion = () => {
        setIsAccordionAdvanceOpen((prev) => !prev);
    };

    const handleViewChange = (e) => {
        setViewType(e.target.value);
    };

    const handleKeyPhraseChange = (index, value) => {
        const newAccordions = [...accordions];
        newAccordions[index].keyPhrase = value;

        if (value && index === accordions.length - 1) {
            newAccordions.push({ keyPhrase: '', isAccordionOpen: false });
        }

        else if (!value && accordions.length > 1 && index === accordions.length - 2 && accordions[accordions.length - 1].keyPhrase === '') {
            newAccordions.pop();
        }

        setAccordions(newAccordions);

        const keyPhrases = newAccordions.map(accordion => accordion.keyPhrase).filter(Boolean);
        onKeyPhrasesChange(keyPhrases);
    };

    const toggleXAppearanceAccordion = () => {
        setIsAccordionXOpen((prev) => !prev);
    };

    return (
        <div className="tab-bar-container">
            <div className="tab-bar">
                <div
                    className={`tab ${activeTab === 'SEO' ? 'active' : ''}`}
                    onClick={() => setActiveTab('SEO')}
                >
                    SEO
                </div>
                <div
                    className={`tab ${activeTab === 'Social' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Social')}
                >
                    Social
                </div>
            </div>
            <div className="tab-content">
                {activeTab === 'SEO' ? (
                    <SEOSection
                        viewType={viewType}
                        handleViewChange={handleViewChange}
                        isAccordionOpen={isAccordionOpen}
                        toggleAccordion={toggleAccordion}
                        isAccordionAdvanceOpen={isAccordionAdvanceOpen}
                        toggleAdvanceAccordion={toggleAdvanceAccordion}
                        keyPhrase={keyPhrase}
                        handleKeyPhraseChange={handleKeyPhraseChange}
                        accordions={accordions}
                        handleInputChange={handleInputChange}
                        metaData={metaData}
                    />
                ) : (
                    <SocialSection
                        isHovered={isHovered}
                        setIsHovered={setIsHovered}
                        toggleXAppearanceAccordion={toggleXAppearanceAccordion}
                        isAccordionXOpen={isAccordionXOpen}
                        handleInputChange={handleInputChange}
                        metaData={metaData}
                        updateCategoryData={updateCategoryData}
                        handleGalleryModalOpen={handleGalleryModalOpen}
                        cancelSocialImage={cancelSocialImage}
                        cancelXImage={cancelXImage}
                        selectedImage={selectedImage}
                        setSelectedImage={setSelectedImage}
                        selectedXImage={selectedXImage}
                        setSelectedXImage={setSelectedXImage}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        handleImageSelect={handleImageSelect}
                    />
                )}
            </div>
        </div>
    );
};

export default TabBarView;