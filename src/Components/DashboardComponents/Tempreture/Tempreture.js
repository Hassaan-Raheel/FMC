import React from 'react'
import './Tempreture.css';

const Tempreture = () => {
  return (
    <div className='tempreture-main-container'>
      <div className='firewall-main-heading-container'>
        <h3>Firewall</h3>
      </div>
      <div className='tempreture-circle-main-couter'>
        <div className='tempreture-circle-inner-round'>
            <div className='tempreture-circle-data-circle'>
                <h3 className='tempreture-text'>21</h3>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Tempreture
