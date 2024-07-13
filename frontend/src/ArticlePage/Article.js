import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Article.css'; // Assuming you have or will create CSS for this component
import { useNavigate } from 'react-router-dom';

function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [predictedPrice, setPredictedPrice] = useState(null);

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

  const addToBasket = async () => {
    if (!size) {
      alert('Alegeti o marime inainte de a adauga in cos!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Va rugam conectati-va cu contul dumneavoastra pentru a putea adauga produse in cos!');
        navigate('/login');
        return;
      }

      await axios.post('http://localhost:3001/api/basket', 
        { articleId: article.id, quantity: quantity, size: size }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Articol adaugat in cos cu succes!");
    } catch (error) {
      console.error('There was an error adding the item to the basket:', error);
      alert("Eroare in adaugarea produsului in cosul de cumparaturi!");
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleSizeChange = (event) => {
    setSize(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    axios.get(`http://localhost:3001/api/search?term=${event.target.value}`)
      .then(response => {
        setFilteredArticles(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the search results:', error);
      });
  };

  const handlePredictPrice = () => {
    const data = {
      articleId: article.id,
      price: article.price // Include the current price of the article
    };
  
    axios.post('http://localhost:3001/api/predict-price', data)
      .then(response => {
        setPredictedPrice(response.data.predicted_price);
      })
      .catch(error => {
        console.error('There was an error predicting the price:', error);
      });
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
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
        />    
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
            <p className="article-price">Pret: {article.price} RON</p>
            <p className="article-description">{article.description}</p>
            <div className="quantity-and-size">
              <div className="quantity-buttons">
                <p className="quantity-label">Cantitate:</p>
                <button className="quantity-button" onClick={decreaseQuantity}>-</button>
                <p className="quantity-value">{quantity}</p>
                <button className="quantity-button" onClick={increaseQuantity}>+</button>
              </div>
              <div className="size-selection">
                <label htmlFor="size">Marime:</label>
                <select id="size" value={size} onChange={handleSizeChange}>
                  <option value="">Selectează mărimea</option>
                  {article.sizes && article.sizes.map((sizeOption, index) => (
                    <option key={index} value={sizeOption}>{sizeOption}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="button-container">
              <button className="add-button" onClick={addToBasket}>Adauga in Cos!</button>
            </div>
            <div className="button-container-prediction">
              <button className="predict-button" onClick={handlePredictPrice}>Prezicere Pret</button>
            </div>
            {predictedPrice !== null && (
              <p className="predicted-price">Preț prezis peste 6 luni: {predictedPrice} RON</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Article;
