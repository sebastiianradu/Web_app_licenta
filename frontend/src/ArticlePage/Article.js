// Articles.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Article.css'; // Assuming you have or will create CSS for this component
import { useNavigate } from 'react-router-dom';


function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage menu visibility


  useEffect(() => {
    axios.get(`http://localhost:3001/api/articles/${id}`)
      .then(response => {
        setArticle(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the article:', error);
      });
  }, [id]);

  if (!article) return <div>Loading...</div>;

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

const addToBasket = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to add items to your basket.');
      navigate('/login');
      return;
    }

    await axios.post('http://localhost:3001/api/basket', 
      { articleId: article.id, quantity: 1 }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Article added to basket successfully!");
  } catch (error) {
    console.error('There was an error adding the item to the basket:', error);
    alert("Failed to add the item to the basket.");
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
    <button className="Account" onClick={handleAccountClick}>Account</button>
    <button className="My-Basket" onClick={() => navigate('/basket')}>Cosul Meu</button>
    </header>

    <div className="article-detail">
      <div className="article-content">
        <div className="article-image">
          <img src={article.imageUrl} alt={article.title} />
        </div>
        <div className="article-info">
          <h1 className="article-title">{article.title}</h1>
          <p className="article-price">Price: ${article.price}!</p>
          <p className="article-description">{article.description}</p>
          <button className="add-button" onClick={addToBasket}>Add</button>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Article;