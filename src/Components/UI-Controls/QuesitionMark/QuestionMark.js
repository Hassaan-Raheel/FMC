import React from 'react';

const QuestionMarkCircle = ({ size = 24, color = '#000', tooltip = '' }) => {
  const circleStyle = {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    width: size,
    height: size,
    backgroundColor: color,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: size / 2,
    cursor: 'pointer',
    position: 'relative',
  };

  const tooltipStyle = {
    position: 'absolute',
    bottom: '125%',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#333',
    color: '#fff',
    padding: '5px 10px',
    borderRadius: '4px',
    fontSize: '12px',
    whiteSpace: 'nowrap',
    visibility: tooltip ? 'hidden' : 'hidden',
    opacity: 0,
    transition: 'opacity 0.2s',
    zIndex: 1000,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const containerStyle = {
    position: 'relative',
    display: 'inline-block',
  };

  const showTooltip = (e) => {
    const tooltip = e.currentTarget.querySelector('.tooltip');
    tooltip.style.visibility = 'visible';
    tooltip.style.opacity = 1;
  };

  const hideTooltip = (e) => {
    const tooltip = e.currentTarget.querySelector('.tooltip');
    tooltip.style.visibility = 'hidden';
    tooltip.style.opacity = 0;
  };

  return (
    <div
      style={containerStyle}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      <div style={circleStyle}>?</div>
      {tooltip && <div className="tooltip" style={tooltipStyle}>{tooltip}</div>}
    </div>
  );
};

export default QuestionMarkCircle;