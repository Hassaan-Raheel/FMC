import React, {useState} from 'react';
import './Header.css';
import { useLocation, useNavigate } from 'react-router-dom';
import userIcon from '../../Assets/check-images/user-vector.jpeg';
import { HiOutlineBellAlert } from "react-icons/hi2";


function Header() {
  const location = useLocation()
  const navigate = useNavigate();
  const pageName = location.pathname;

  let lastName = pageName.split('/').pop();
  const isId = /^[0-9a-fA-F]{24}$/.test(lastName);

  if (isId) {
    lastName = pageName.split('/').slice(-2, -1)[0];
  }

  if (pageName.includes('/Settings/')) {
    lastName = 'Settings';
  }

  if (pageName.includes('/Analytics/')) {
    lastName = 'Analytics';
  }

  if (pageName.includes('/Appointments/')) {
    lastName = 'Appointments';
  }

  const removeDash = lastName.split('-').join(' ');

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const username = sessionStorage.getItem('username')
  ?.split(/(?=[A-Z])/)
  .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  .join(' ');

  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('username');
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <header className="parentHeadClass">
      <div className="categoryClass">
        <div className="product">{removeDash}</div>
        <div className="authSection">
          <HiOutlineBellAlert size={20} color='#595959' />
          <img src={userIcon} alt="Frame" className="framerImage" />
          <span className='username'>{username}</span>
        </div>
      </div>
    </header>
  );
}

export default Header;