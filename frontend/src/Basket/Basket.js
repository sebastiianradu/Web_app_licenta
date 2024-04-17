// Basket.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Basket.css';
import { useNavigate } from 'react-router-dom';


function Basket() {
  const [basketItems, setBasketItems] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage menu visibility

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBasketItems = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found. User must be logged in to fetch basket items.');
          return;
        }
  
        const response = await axios.get('http://localhost:3001/api/basket', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Basket items fetched:', response.data); // Debugging line
        setBasketItems(response.data);
      } catch (error) {
        console.error('Error fetching basket items:', error);
      }
    };
  
    fetchBasketItems();
  }, []);

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
  

  const total = basketItems.reduce((acc, item) => acc + parseFloat(item.ClothingArticle.price), 0);

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

    <div className="basket-container">
      <div className="basket-items">
        <h2>Coș de cumpărături:</h2>
        {basketItems.map((item, index) => (
          <div className="basket-item" key={index}>
            <img src={item.ClothingArticle.imageUrl} alt={item.ClothingArticle.title} className="basket-item-image" />
            <div className="basket-item-details">
              <p className="basket-item-title">{item.ClothingArticle.title}</p>
              <p className="basket-item-price">${parseFloat(item.ClothingArticle.price).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="basket-summary">
        <h2>Sumar comandă:</h2>
        <p>Total: ${total.toFixed(2)}</p>
        <button className="basket-checkout-button">Către livrare</button>
      </div>
    </div>
    </div>
  );
}

export default Basket;