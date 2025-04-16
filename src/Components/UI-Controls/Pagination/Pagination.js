import React from 'react';
import './PaginationNew.css';
import ActiveNavLeft from '../../../Assets/Images/Active-Navigator-Left 15 x 15.png';
import ActiveNavRight from '../../../Assets/Images/Active-Navigator-Right 15 x 15.png';

const CustomPagination = ({ rowsPerPage, rowCount, currentPage, onChangePage }) => {
  const totalPages = Math.ceil(rowCount / rowsPerPage);
  const startRow = (currentPage - 1) * rowsPerPage + 1;
  const endRow = Math.min(currentPage * rowsPerPage, rowCount);

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className="custom-pagination-container">
      <div className="custom-pagination-nav">
        <button
          className={`pagination-btn ${isFirstPage ? 'disabled' : ''}`}
          disabled={isFirstPage}
          onClick={() => onChangePage(currentPage - 1)}
        >
          <img
            src={ActiveNavLeft}
            alt="Previous"
            className={`pagination-icon ${isFirstPage ? 'inactive' : 'active'}`}
          />
        </button>
        <div className="custom-pagination-info">
          <span className="entries-display">{`${startRow} - ${endRow}`}</span> of {rowCount}
        </div>
        <button
          className={`pagination-btn ${isLastPage ? 'disabled' : ''}`}
          disabled={isLastPage}
          onClick={() => onChangePage(currentPage + 1)}
        >
          <img
            src={ActiveNavRight}
            alt="Next"
            className={`pagination-icon ${isLastPage ? 'inactive' : 'active'}`}
          />
        </button>
      </div>
    </div>
  );
};

export default CustomPagination;