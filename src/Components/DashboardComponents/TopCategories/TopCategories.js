import React from 'react'
import './TopCategories.css'
import menuDots from '../../../Assets/Images/Selector 20 X 20.png'
import arrowDown from '../../../Assets/Images/dropdown 20 x 20.png'
import ProgressBar from '../../UI-Controls/ProgressBar/ProgressBar';

const TopCategories = ({data, heading}) => {
    
  return (
    <div className='top-categories-main-container'>
        <div className='top-categories-inner-container'>
        <div className='top-categories-head'>
            <p>{heading}</p>
            <div className='month-drop-down-and-menu-dots'>
                <div className='top-categories-month-drop-down'>
                    <div className='top-category-month-drop-down-toggler'>
                        <p>January</p>
                        <img src={arrowDown} alt='arrow-down' />
                    </div>
                    {/* <div className='drop-down-months-container'>
                        <p>January</p>
                        <p>January</p>
                        <p>January</p>
                        <p>January</p>
                    </div> */}
                </div>
                {/* <img src={menuDots} alt='menu dots' className='menu-dots' /> */}
            </div>
        </div>
            <div className='top-category-body'>
                {data.map((item, index) => (
                    <div className='top-category-single-data'>
                        <img src={item.img} alt={item.name} className='top-category-product-image' />
                        <div className='top-category-product-content'>
                            <div className='top-category-product-name-and-value'>
                                <h3>{item.name}</h3>
                                <div className='top-categories-values'>
                                    <p>{item.val}</p>
                                    <span>{item.percentage}%</span>
                                </div>
                            </div>
                            {/* <progress 
                                value={item.percentage}
                                max="100"
                                className='top-category-product-progress'
                            /> */}
                            <ProgressBar 
                                percentage={item.percentage}
                                color={'#000'}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default TopCategories
