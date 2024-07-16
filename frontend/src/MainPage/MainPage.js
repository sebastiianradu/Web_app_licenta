import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MainPage.css';
import { useNavigate } from 'react-router-dom';

function App() {
  const [articles, setArticles] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [searchTerm, setSearchTerm] = useState('');


  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/api/articles')
      .then(response => {
        setArticles(response.data);
      })
      .catch(error => console.error('There was an error fetching the articles:', error));
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

////////////////////////////////////////Search bar////////////////////////////////////////

const handleSearch = (event) => {
  setSearchTerm(event.target.value);
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

  <input className="text" type="text" placeholder="Search..." value={searchTerm} onChange={handleSearch} />
  <button className="Account" onClick={handleAccountClick}>Contul Meu</button>
  <button className="My-Basket" onClick={() => navigate('/basket')}>Cosul Meu</button>
</header>

      <main className="article-container">
        {articles
        .filter(article =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map(article => (
          <div key={article.id} className="Main-article" onClick={() => navigate(`/article/${article.id}`)} style={{ cursor: 'pointer' }}>
            <img src={article.imageUrl} alt={article.title} style={{ width: '250px', height: 'auto' }} />
            <h3>{article.title}</h3>
            <p>{article.price} RON</p>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;