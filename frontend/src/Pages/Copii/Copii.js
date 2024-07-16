import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Copii.css';
import { useNavigate } from 'react-router-dom';

function Copii() {
  const [filters, setFilters] = useState({ type: '', priceRange: '' });
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');




  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/api/articles?category=K')
      .then(response => {
        setArticles(response.data);
      })
      .catch(error => console.error('there was a problem fetching the articles', error));
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false); 

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

  const filterArticles = () => {
    let filtered = articles;
  
    // type
    if (filters.type !== '') {
      filtered = filtered.filter(article => article.type === filters.type);
    }
  
    //price range
    if (filters.priceRange !== '') {
      const [minPrice, maxPrice] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(article => article.price >= minPrice && article.price <= maxPrice);
    }
  
    //search term
    if (searchTerm !== '') {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  
    setFilteredArticles(filtered);
  };
  

  useEffect(() => {
    filterArticles();
  }, [filters, articles, searchTerm]);
  

  ////

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  

////

return (
  <div className="Copii-Page">
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
        <img src="/Firma.jpg" className="nume-firma-img" style={{ width: '270px', maxHeight: '100%' }}/>
      </div>
      <input className="text" type="text" placeholder="Search..." value={searchTerm} onChange={handleSearch} />
      <button onClick={handleAccountClick}>Contul Meu</button>
      <button className="My-Basket" onClick={() => navigate('/basket')}>Cosul Meu</button>
    </header>
    <div className="Copii">
      <header className="Copii-header">
        <h1>Haine Sport pentru Copii</h1>
        <p>Numar de produse: {filteredArticles.length}</p>
      </header>
      <div className="Copii-content">
        <aside className="Copii-filters">
          <h2>Filtre</h2>
          <div className="filter-group">
            <h3>Tipuri de articole</h3>
            <select name="type" onChange={handleFilterChange}>
            <option value="">Toate</option>
              <option value="Tricouri">Tricouri</option>
              <option value="Pantaloni">Pantaloni</option>
              <option value="Adidasi">Incaltaminte</option>
            </select>
          </div>
          <div className="filter-group">
            <h3>Interval de preturi</h3>
            <select name="priceRange" onChange={handleFilterChange}>
              <option value="">Toate</option>
              <option value="0-50">0 - 50</option>
              <option value="50-100">50 - 100</option>
              <option value="100-200">100 - 200</option>
              <option value="200-300">200 - 300</option>
            </select>
          </div>
        </aside>
        <main className="article-container">
          {filteredArticles.length > 0 ? (
            filteredArticles.map(article => (
              <div key={article.id} className="Copii-articles" onClick={() => navigate(`/article/${article.id}`)} style={{ cursor: 'pointer' }}>
                <img src={article.imageUrl} alt={article.title} style={{ width: '150px', height: 'auto' }} />
                <h3>{article.title}</h3>
                <p>{article.price} RON</p>
              </div>
            ))
          ) : (
            <div className="no-articles-message">Nu exista articole in aceasta gama!</div>
          )}
        </main>
      </div>
    </div>
  </div>
);

}

export default Copii;
