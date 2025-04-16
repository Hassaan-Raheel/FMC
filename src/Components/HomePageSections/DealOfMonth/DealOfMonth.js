import React, { useEffect, useRef, useState } from 'react'
import './DealOfMonth.css'
import CMSHead from '../../UI-Controls/CMSHead/CMSHead'
import timeIcon from '../../../Assets/Images/time-icon.png';
import InfoPopUp from '../../InfoPopUp/InfoPopUp';

import { RxCross1 } from "react-icons/rx";
import { MdKeyboardArrowUp } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";
import { HiOutlineClock } from "react-icons/hi";
import axios from 'axios';
import { Url } from '../../../Services/Api';
import MainLoader from '../../UI-Controls/MainLoader/MainLoader';

import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import SectionLoader from '../../UI-Controls/MainLoader/SectionLoader';

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Ensure 2-digit month
  const day = String(today.getDate()).padStart(2, '0'); // Ensure 2-digit day
  return `${year}-${month}-${day}`;
};

const DealOfMonth = ({handleOpen}) => {
  const timePickerRef = useRef(null)
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  const [prevDate, setPrevDate] = useState('');
  const [datetime, setDateTime] = useState({
    datetime: ''
  })
  const [splitedDate, setSplitedDate] = useState();
  const [splitedTime, setSplitedTime] = useState()
  const [splitHours, setSplitHours] = useState();
  const [splitMinuts, setSplitMinuts] = useState()
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getDateAndTime = async () => {
      const api = `/api/v1/deal_of_the_month/getDealOfTheMonthTime`;
      try {
        const response = await axios.get(`${Url + api}`);
        if (response.status === 200) {
          setDateTime({
            datetime: response.data.data.datetime
          })
          const fetchedDate = new Date(response.data.data.datetime);
          setSelectedDate(fetchedDate);
        }
      } catch (error) {
        console.error("UnExpected Error", error);
        return {
          error: true,
          message: "Unwanted Server Error",
        }
      }
    }
    getDateAndTime()
  }, [])

  useEffect(() => {
    if (datetime.datetime && typeof datetime.datetime === 'string') {
      // Proceed only if datetime is a valid string
      const [splitedDate, splitedTime] = datetime.datetime.split('T');
      setSplitedDate(splitedDate);
      setSplitedTime(splitedTime)

      // Further splitting the time into hours and minutes
      const [hours, minutes] = splitedTime.split(':');
      setSplitHours(hours);
      setSplitMinuts(minutes)
    } else {
      console.log("Invalid datetime format or value");
    }
  }, [datetime])


  // const [splitedDate, splitedTime] = datetime.split('T');


  // Modal open and close functions
  const handleShowInfoModal = () => {
    setInfoModal(true)
  }
  const handleCloseInfoModal = () => {
    setInfoModal(false);
  }

  const handleTimeClick = () => {
    setShowDatePicker(prev => !prev); // Toggle time picker visibility
    if (showDatePicker && timePickerRef.current) {
      timePickerRef.current.showPicker();
    }
  }

  const [isSetTime, setIsSetTime] = useState(false)
  const handleOpenTimeModal = () => {
    setIsSetTime(true)
  }

  const handleCloseTimeModal = () => {
    setIsSetTime(false);
  }

  const [hour, setHour] = useState(12);
  const [minutes, setMinuts] = useState(60);
  const [dayTime, setDayTime] = useState('PM');

  const handleIncreseHOur = () => {
    setHour((prevHour) => (prevHour === 12 ? 1 : prevHour + 1));
  }

  const handleDecreseHour = () => {
    setHour((prevHour) => (prevHour === 1 ? 12 : prevHour - 1));
  };

  const handleIncreseMinuts = () => {
    setMinuts((prevMin) => (prevMin === 60 ? 1 : prevMin + 1))
  }
  const handleDecreseMinuts = () => {
    setMinuts((prevMin) => (prevMin === 1 ? 60 : prevMin - 1))
  }

  const handleDayTimeChange = () => {
    setDayTime((prevTime) => (prevTime === 'PM' ? 'AM' : 'PM'))
  }


  const [date, setDate] = useState('')
  const currentDate = getCurrentDate();

  const handleDateChange = () => {
    const selectedDate = timePickerRef.current.value; // Get the selected date

    // Only trigger if the date has actually changed
    if (selectedDate !== prevDate) {
      if (new Date(selectedDate) < new Date(currentDate)) {
        timePickerRef.current.value = currentDate;  // Reset to current date
        setDate(currentDate);  // Update state to current date
      } else {
        const formattedDate = formatDate(selectedDate); // Format the date to YYYY/MM/DD
        setDate(formattedDate); // Update the state
        // Call the function to handle the formatted date
        setPrevDate(selectedDate);  // Update prevDate to the newly selected date
      }
    }
  };


  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Ensure 2-digit month
    const day = String(dateObj.getDate()).padStart(2, '0'); // Ensure 2-digit day
    setDateTime({
      datetime: formateDateStandere()
    })
    return `${year}-${month}-${day}`;
  };

  const formateDateStandere = () => {
    if (!date || !hour || !minutes) {
      console.error("Invalid date or time values");
      return null;
    }

    // Ensure `date` is in the correct format (YYYY-MM-DD)
    const [year, month, day] = date.split('-'); // Split the date into parts
    if (!year || !month || !day) {
      console.error("Invalid date format:", date);
      return null;
    }

    // Ensure minutes is within the range [0, 59]
    const validMinutes = minutes >= 0 && minutes < 60 ? minutes : 0;

    // Ensure hour is within the range [1, 12] for a 12-hour format
    const validHour = hour >= 1 && hour <= 12 ? hour : 12;

    // Check if the values are valid before attempting to create the Date
    const dateObj = new Date(Date.UTC(year, month - 1, day, validHour, validMinutes, 0));
    if (isNaN(dateObj)) {
      console.error("Invalid date object created.");
      return null;
    }

    const isoDate = dateObj.toISOString(); 
    return isoDate;
  };

  useEffect(() => {
  }, [date])

  const [selectedDate, setSelectedDate] = useState(null);

  const handleChange = (date) => {
    if (date && date.isValid()) {
      const isoString = date.toISOString(); // Convert to ISO string
      setSelectedDate(isoString);  // Update the state with the ISO string
    } else {
      console.error("Invalid date selected");
    }
  };

  useEffect(() => { }, [selectedDate]);

  const handleSendDateTimeDatabase = async () => {
    const api = `/api/v1/deal_of_the_month/dealOfTheMonthSet`;
    const isoDate = new Date(selectedDate).toISOString();
    const payload = { datetime: isoDate };
    try {
      setLoading(true)
      const response = await axios.post(`${Url + api}`, payload);
      if (response.status === 200) {
       handleOpen("Date Set Successfully");
      } else {
        handleOpen("UnExpected Status Code Error");
      }
    } catch (error) {
      setLoading(false)
      console.error("UnExpected Server Error");
      handleOpen("UnExpected Server Error")
      return {
        error: true,
        message: "UnExpected Server Error"
      }
    } finally {
      setLoading(false)
    }
  }


  

  

  return (
    <div className='deal-of-month-main-container'>
      {loading && <SectionLoader />}
      <CMSHead
        heading={"Deal Of The Month"}
        buttonText={"Save"}
        isButtonVissible={true}
        sendImagesHomeSlider={handleSendDateTimeDatabase}
        handleShowInfoModal={handleShowInfoModal}
      />

      <div className='deal-of-the-month-main-container'>

        {/* <div className='deal-of-the-month-inputs'>

          <div className='select-date' onClick={handleTimeClick}>
            {datetime.datetime !== "" ? (
              <>
                <p>{splitedDate}</p>
                <img src={timeIcon} alt='time-icon' onClick={handleTimeClick} />
                <input type='date' ref={timePickerRef} min={currentDate} onChange={handleDateChange} style={{ display: 'none' }} />
              </>
            ) : (
              < >
                <p>Ending Date</p>
                <img src={timeIcon} alt='time-icon' onClick={handleTimeClick} />
                <input type='date' ref={timePickerRef} min={currentDate} onChange={handleDateChange} style={{ display: 'none' }} />
              </>
            )}
          </div>
          <div className='select-date' onClick={handleOpenTimeModal}>
            {datetime.datetime !== "" ? (
              <>
                <p>{splitHours} : {splitMinuts} {dayTime}</p>
                <HiOutlineClock size={30} />
              </>
            ) : (
              <>
                <p>Ending Time</p>
                <HiOutlineClock size={30} />
              </>
            )}
            
          </div>
        </div> */}

        <Datetime
          value={selectedDate ? new Date(selectedDate) : null}
          onChange={handleChange}
          dateFormat="YYYY-MM-DD"
          timeFormat="hh:mm a"
          inputProps={{
            placeholder: 'Select Date and Time',
            className: 'custom-input' // Custom class for the input field
          }}
          className="custom-datetime" // Custom class for the overall Datetime component
        />

      </div>

      <InfoPopUp
        showInfoModal={infoModal}
        handleCloseInfoModal={handleCloseInfoModal}
      />
      {/* <div className={`time-set-modal-main ${isSetTime ? 'show-time-modal' : ''}`}>
        <div className='time-set-modal-inner'>
          <button className='time-set-modal-close-btn' onClick={handleCloseTimeModal}>
            <RxCross1 size={15} />
          </button>
          <h3 className='end-time-heading'>Set End Time</h3>
          <div className='time-set-container'>

            <div className='hours-list'>
              <button onClick={handleIncreseHOur}>
                <MdKeyboardArrowUp size={35} />
              </button>
              <p>{hour}</p>
              <button onClick={handleDecreseHour}>
                <MdKeyboardArrowDown size={35} />
              </button>
            </div>

            <div className='hours-list'>
              <button onClick={handleIncreseMinuts}>
                <MdKeyboardArrowUp size={35} />
              </button>
              <p>{minutes}</p>
              <button onClick={handleDecreseMinuts}>
                <MdKeyboardArrowDown size={35} />
              </button>
            </div>

            <div className='hours-list'>
              <button onClick={handleDayTimeChange}>
                <MdKeyboardArrowUp size={35} />
              </button>
              <p>{dayTime}</p>
              <button onClick={handleDayTimeChange}>
                <MdKeyboardArrowDown size={35} />
              </button>
            </div>

          </div>
        </div>
      </div> */}
    </div>
  )
}

export default DealOfMonth
