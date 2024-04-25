// Basket.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Basket.css';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';



function Basket() {
  // const { itemId } = useParams();
  const [basketItems, setBasketItems] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage menu visibility
  const [isLoading, setIsLoading] = useState(true); // State to manage loading state

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBasketItems = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found. User must be logged in to fetch basket items.');
          setIsLoading(false); // Stop loading
          return;
        }

        const response = await axios.get(`http://localhost:3001/api/basket`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.length === 0) {
          console.log('The basket is empty.');
          setIsLoading(false); // Stop loading
          return;
        }

        console.log('Basket items fetched:', response.data); // Debugging line
        setBasketItems(response.data);
        setIsLoading(false); // Stop loading
      } catch (error) {
        console.error('Error fetching basket items:', error);
        setIsLoading(false); // Stop loading
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
  
  function calculateTotal(basketItems) {
    let total = 0;
    for (const item of basketItems) {
      total += parseFloat(item.clothingArticle.price) * item.quantity;
    }
    return total;
  }
  
  // Calcularea totalului
  const total = calculateTotal(basketItems);

  // Afișarea mesajului de coș gol
  if (isLoading) {
    return <div>Loading...</div>;
  }
///////////////stergere/////////////

const handleRemoveItem = async (itemId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found. User must be logged in to delete basket items.');
      return;
    }

    await axios.delete(`http://localhost:3001/api/basket`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { itemId } // Trimitem ID-ul elementului în corpul cererii DELETE
    });

    // Actualizăm lista de articole din coș după ștergere
    const updatedBasketItems = basketItems.filter(item => item.id !== itemId);
    setBasketItems(updatedBasketItems);
  } catch (error) {
    console.error('Error deleting basket item:', error);
  }
};


///////////////////////////////////////


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
        {basketItems.length > 0 ? (
  basketItems.map((item, index) => (
    <div className="basket-item" key={index}>
      <img src={item.clothingArticle.imageUrl} alt={item.clothingArticle.title} className="basket-item-image" />
      <div className="basket-item-details">
        <p className="basket-item-title">{item.clothingArticle.title}</p>
        <p className="basket-item-price">${parseFloat(item.clothingArticle.price).toFixed(2)}</p>
        <p className="basket-item-quantity">Quantity: {item.quantity}</p>
        <p className="basket-item-size">Size: {item.size}</p>
        <button className="remove-item-button" onClick={() => handleRemoveItem(item.id)}>Șterge</button>
      </div>
    </div>
  ))
) : (
  <p>Coșul tău este gol.</p>
)}
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