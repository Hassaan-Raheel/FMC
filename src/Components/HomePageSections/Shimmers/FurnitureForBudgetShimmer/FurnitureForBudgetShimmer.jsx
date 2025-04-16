import React from 'react'
import './FurnitureForBudgetShimmer.css';

const FurnitureForBudgetShimmer = () => {
  return (
    <div className='furniture-for-budget-shimmer-main-container'>
        {Array.from({length: 3}).map((_, index) => (
            <div className='furniture-for-budget-card-shimmer'>
                <div className='furniture-for-budget-shimmer-card-main-image'></div>
                <div className='furniture-for-budget-shimmer-options'>
                    {Array.from({length: 3}).map((_, index) => (
                        <div className='furniture-for-budget-shimmer-single-option'></div>
                    ))}
                </div>
            </div>
        ))}
    </div>
  )
}

export default FurnitureForBudgetShimmer
