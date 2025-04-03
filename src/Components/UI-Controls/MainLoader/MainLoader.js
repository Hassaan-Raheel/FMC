import React from 'react'
import './MainLoader.css';
import loaderGif from '../../../Assets/Images/loader-check-three.gif'
import Loader from '../Loader/Loader';
import useLoader from '../../../Services/LoaderHook';

const MainLoader = () => {
    const {Loader} = useLoader()
  return (
    <div className='main-loader-container'>
        <img src={loaderGif} alt='loader-gif' />
        <h3>Please Wait...</h3>
    </div>
  )
}

export default MainLoader
