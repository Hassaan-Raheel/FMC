import React from 'react'
import './OrderDetails.css';
import grothChartIcon from '../../../Assets/Images/groth-chart-icon.jpeg'
import lineChartIcon from '../../../Assets/Images/line-chart-icon.jpeg'

const OrderDetails = () => {
    const ordersDetailsData = [
        {name: 'New Orders', val: 45, chartIcon: grothChartIcon},
        {name: 'Completed Orders', val: 13, chartIcon: grothChartIcon},
        {name: 'Processing Orders', val: 13, chartIcon: grothChartIcon},
        {name: 'Canceled Orders', val: 1, chartIcon: lineChartIcon},
        {name: 'Total Sales', val: 1520},
        {name: 'Net Sales', val: 1390},
        {name: 'Average Order Value', val: 1190},
    ]
    const formatePrice = (price) => {
        return new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: price % 1 === 0 ? 0 : 2, // Show decimals only if necessary
            maximumFractionDigits: 2, // Limit to 2 decimal places
        }).format(price)
    }
  return (
    <div className='order-details-main-container'>
        {ordersDetailsData.map((item, index) => (
            <div className='single-order-detail-container'>
                <p>{item.name}</p>
                <div className='order-value-and-chart-icon--container'>
                    <p>{index > 3 ? formatePrice(item.val) : item.val}</p>
                    {item.chartIcon && <img src={item.chartIcon} alt='chart-icon' />}
                </div>
            </div>
        ))}
    </div>
  )
}

export default OrderDetails
