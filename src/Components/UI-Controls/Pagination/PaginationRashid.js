import React from 'react';
import { FaRegArrowAltCircleLeft, FaRegArrowAltCircleRight } from 'react-icons/fa';
import './PaginationRashid.css';

const Pagination = ({ 
  activePageIndex, 
  totalPages, 
  onPrevPage, 
  onNextPage, 
  onPageChange 
}) => {
  const calculateVisiblePages = () => {
    let startPage = Math.max(1, activePageIndex - 1);
    let endPage = Math.min(totalPages, startPage + 2);
    
    if (endPage - startPage < 2) {
      startPage = Math.max(1, endPage - 2);
    }
    
    return Array.from(
      { length: endPage - startPage + 1 }, 
      (_, index) => startPage + index
    );
  };

  const visiblePages = calculateVisiblePages();

  return (
    <div className='view-more-products-pagination-main'>
      <div className='pagination-buttons-container'>
        <span
          className={activePageIndex === 1 ? 'disabled' : ''}
          onClick={onPrevPage}
          style={{
            pointerEvents: activePageIndex === 1 ? 'none' : 'auto',
            color: activePageIndex === 1 ? '#ccc' : '#4487C5',
          }}
        >
          <FaRegArrowAltCircleLeft
            size={18}
            style={{
              pointerEvents: activePageIndex === 1 ? 'none' : 'auto',
              color: activePageIndex === 1 ? '#ccc' : '#4487C5',
            }}
          />
          Prev
        </span>
        
        {visiblePages.map((pageNumber) => (
          <span
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={activePageIndex === pageNumber ? 'active-page-span' : ''}
          >
            {pageNumber}
          </span>
        ))}
        
        <span
          className={activePageIndex === totalPages ? 'disabled' : ''}
          onClick={onNextPage}
          style={{
            pointerEvents: activePageIndex === totalPages ? 'none' : 'auto',
            color: activePageIndex === totalPages ? '#ccc' : '#4487C5',
          }}
        >
          Next
          <FaRegArrowAltCircleRight
            size={18}
            style={{
              pointerEvents: activePageIndex === totalPages ? 'none' : 'auto',
              color: activePageIndex === totalPages ? '#ccc' : '#4487C5',
            }}
          />
        </span>
      </div>
    </div>
  );
};

export default Pagination;