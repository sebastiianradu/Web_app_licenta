import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './OrderPage.css';

function OrderPage() {
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage menu visibility
  const navigate = useNavigate();

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to place an order.');
        navigate('/login');
        return;
      }

      await axios.post('http://localhost:3001/api/orders', 
        {
          address: address,
          phoneNumber: phoneNumber,
          paymentMethod: paymentMethod
        }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Order placed successfully!");
      navigate('/final-order');
    } catch (error) {
      console.error('Error placing order:', error);
      alert("Failed to place the order.");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle menu visibility
  };

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
          <img src="/Firma.jpg" className="nume-firma-img" alt="Firma" />
        </div>

        <input type="text" placeholder="Search..." />
        <button className="Account" onClick={handleAccountClick}>Contul Meu</button>
        <button className="My-Basket" onClick={() => navigate('/basket')}>Cosul Meu</button>
      </header>

      <div className="order-container">
        <h1>Finalizare Comandă</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Adresă:
            <input type="text" value={address} onChange={handleAddressChange} />
          </label>
          <label>
            Nr. de Telefon:
            <input type="text" value={phoneNumber} onChange={handlePhoneNumberChange} />
          </label>
          <label>
            Metoda de plată:
            <select value={paymentMethod} onChange={handlePaymentMethodChange}>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
            </select>
          </label>
          <button type="submit">Finalizare Comandă</button>
        </form>
      </div>
    </div>
  );
}

export default OrderPage;
