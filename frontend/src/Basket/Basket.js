import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Basket.css';
import { useNavigate } from 'react-router-dom';

function Basket() {
  const [basketItems, setBasketItems] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [isLoading, setIsLoading] = useState(true); 
  const [errorMessage, setErrorMessage] = useState(''); 

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBasketItems = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found. User must be logged in to fetch basket items.');
          setIsLoading(false); 
          return;
        }

        const response = await axios.get('http://localhost:3001/api/basket', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.length === 0) {
          console.log('The basket is empty.');
          setIsLoading(false); 
          return;
        }

        console.log('Basket items fetched:', response.data); 
        setBasketItems(response.data);
        setIsLoading(false); 
      } catch (error) {
        console.error('Error fetching basket items:', error);
        setIsLoading(false); 
      }
    };

    fetchBasketItems();
  }, []);

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

  const calculateTotal = (basketItems) => {
    let total = 0;
    for (const item of basketItems) {
      total += parseFloat(item.clothingArticle.price) * item.quantity;
    }
    return total;
  };

  const total = calculateTotal(basketItems);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleRemoveItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found. User must be logged in to delete basket items.');
        return;
      }

      await axios.delete('http://localhost:3001/api/basket', {
        headers: { Authorization: `Bearer ${token}` },
        data: { itemId } 
      });

      const updatedBasketItems = basketItems.filter(item => item.id !== itemId);
      setBasketItems(updatedBasketItems);
    } catch (error) {
      console.error('Error deleting basket item:', error);
    }
  };

  const handleCheckout = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Nu sunteti conectat la contul dumneavoastra!\nVa rugam conectati-va si incercati din nou!")
      navigate('/login'); 
      return;
    }
    if (basketItems.length === 0) {
      setErrorMessage('Coșul tău este gol.');
      return;
    }
    navigate('/orders');
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

      <div className="basket-container">
        <div className="basket-items">
          <h2>Coș de cumpărături:</h2>
          {basketItems.length > 0 ? (
            basketItems.map((item, index) => (
              <div className="basket-item" key={index}>
                <img src={item.clothingArticle.imageUrl} alt={item.clothingArticle.title} className="basket-item-image" />
                <div className="basket-item-details">
                  <p className="basket-item-title">{item.clothingArticle.title}</p>
                  <p className="basket-item-price">{parseFloat(item.clothingArticle.price).toFixed(2)} RON</p>
                  <p className="basket-item-quantity">Cantitate: {item.quantity}</p>
                  <p className="basket-item-size">Marime: {item.clothingArticle.sizes}</p>
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
          <p>Total: {total.toFixed(2)} RON</p>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <button className="basket-checkout-button" onClick={handleCheckout}>Către livrare</button>
        </div>
      </div>
    </div>
  );
}

export default Basket;
