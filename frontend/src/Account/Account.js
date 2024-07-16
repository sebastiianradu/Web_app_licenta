import React, { useEffect, useState } from 'react';
import axiosInstance from '../AxiosInstance'; 
import './Account.css';
import { useNavigate } from 'react-router-dom'; 

const Account = () => {
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const navigate = useNavigate(); 

  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.get('/user/details');
        setUserDetails({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
        });
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/login'); 
  };

   
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); 
  };

const handleAccountClick = () => {
  const token = localStorage.getItem('token');
  if (token) {
    navigate('/account'); 
  } else {
    navigate('/login'); 
  }
};
  return (
    <div className="App">
     <header className="App-header">
     <div className="menu-container">
    <div className="menu-button" onClick={toggleMenu}>Menu &#9776;</div>
    {isMenuOpen && (
      <div className="menu">
        <a onClick={() => navigate('/barbati')}>BARBATI</a>
        <a onClick={() => navigate('/femei')}>FEMEI</a>
        <a onClick={() => navigate('/copii')}>COPII</a>
      </div>
    )}
  </div>

  <div className="nume-firma-icon" onClick={() => navigate('/')}>
    <img src="/Firma.jpg" className="nume-firma-img" />
  </div>

  <input type="text" placeholder="Search..." />
  <button className="Account" onClick={handleAccountClick}>Contul Meu</button>
  <button className="My-Basket" onClick={() => navigate('/basket')}>Cosul Meu</button>
</header>

    <div className="account-container">
  <h2 className="account-title">My Account</h2>
  <p className="account-detail"><label>Prenume:</label> {userDetails.firstName}</p>
  <p className="account-detail"><label>Nume:</label> {userDetails.lastName}</p>
  <p className="account-detail"><label>Email:</label> {userDetails.email}</p>
  <button onClick={handleLogout} className="logout-button">Logout</button>
</div>
</div>
  );
};

export default Account;