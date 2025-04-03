import React, { useEffect, useState } from 'react'
import './FaqEdit.css'
import { useLocation } from 'react-router-dom';
import { SlArrowDown } from "react-icons/sl";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { IoClose } from "react-icons/io5";


const FaqEdit = () => {

    const location = useLocation();

    const data = location.state;

    const faqsData = [
        { question: 'What is the return policy?', answer: 'You can return the product within 30 days of purchase.' },
        { question: 'What is the return policy?', answer: 'You can return the product within 30 days of purchase.' },
        { question: 'What is the return policy?', answer: 'You can return the product within 30 days of purchase.' },
        { question: 'What is the return policy?', answer: 'You can return the product within 30 days of purchase.' },
        { question: 'What is the return policy?', answer: 'You can return the product within 30 days of purchase.' },
    ]

    const [askQuestion, setAskQuestion] = useState({
        question: '',
        answer: ''
    })

    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(null);
    const handleOpenQuestion = (index) => {
        setCurrentIndex(currentIndex !== index ? index : null);
    }

    const AddFAQModal = () => {
        setIsOpen(true);
    }

    const closeFAQModal = (e) => {

        setIsOpen(false);

        setAskQuestion({
            question: '',
            answer: ''
        })
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setAskQuestion((prevState) => ({
            ...prevState,
            [name]: value
        }))
    }

    useEffect(() => { console.log("question and answer", askQuestion) })

    return (
        <div className='faq-edit-main-container'>
            <div className='faq-editor-head'>
                <h3>{data.title} FAQs</h3>
                <div>

                </div>
                <button onClick={AddFAQModal}>
                    Add
                </button>
            </div>
            <div className='faq-editor-body'>
                <div className='faq-editor-categories'>
                    {faqsData.map((faq, index) => (
                        <div className='single-faq-editor' key={index}>
                            <div className='faq-editor-questions' onClick={() => handleOpenQuestion(index)}>
                                <p>{faq.question}</p>

                                <div className='faq-action-btns'>
                                    <button className={`faq-editor-arrow ${currentIndex === index ? 'rotate-faq-btn' : ''}`} >
                                        <SlArrowDown size={15} color='#595959' />
                                    </button>
                                    <button className='faq-editor-arrow'>
                                        <CiEdit size={15} color='#595959' />
                                    </button>
                                    <button className='faq-editor-arrow'>
                                        <MdDelete size={15} color='#595959' />
                                    </button>

                                </div>

                            </div>
                            <div className={`faq-editor-answers ${currentIndex === index ? 'show-answer' : ''}`}>
                                <p>{faq.answer}</p>
                            </div>
                        </div>
                    ))}

                </div>
            </div>

            <div className={`add-faq-modal ${isOpen ? 'show-modal' : ''}`} onClick={closeFAQModal}>
                <div className='add-faq-inner-modal' onClick={(e) => e.stopPropagation()}>
                    <div className='faq-modal-head'>
                        <h3>Add FAQ</h3>

                        <button onClick={closeFAQModal} className='close-faq-modal'>
                            <IoClose size={20} color='#595959' />
                        </button>
                    </div>


                    <div className='faq-inputs'>
                        <input type='text' placeholder='Enter Question' name='question' value={askQuestion.question} onChange={handleInputChange} className='faq-input' />
                        <textarea placeholder='Enter Answer' rows={4} className='faq-answer-input' name='answer' value={askQuestion.answer} onChange={handleInputChange}></textarea>
                    </div>
                    <div className='faq-modal-btns'>
                        <button>Cancel</button>
                        <button>Save</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FaqEdit