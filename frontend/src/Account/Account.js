import React, { useEffect, useState } from 'react';
import axiosInstance from '../AxiosInstance'; // Adjust the import path as necessary
import './Account.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for redirection

const Account = () => {
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const navigate = useNavigate(); // Hook for navigating to different routes

  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage menu visibility
  
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
        // Handle error, e.g., redirect to login if unauthorized
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from storage
    navigate('/login'); // Redirect user to login page
    // You could also redirect to the home page or another page if you prefer
  };

   
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle menu visibility
  };

// Function to handle Account button click
const handleAccountClick = () => {
  // Check if the JWT token exists in local storage
  const token = localStorage.getItem('token');
  if (token) {
    navigate('/account'); // If logged in, navigate to the Account page
  } else {
    navigate('/login'); // If not logged in, navigate to the Login page
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