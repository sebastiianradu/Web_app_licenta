import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Barbati.css';
import { useNavigate } from 'react-router-dom';

function Barbati() {
  const [filters, setFilters] = useState({ type: '', priceRange: '' });
  const [articles, setArticles] = useState(Array(10).fill({})); // Simulate 10 placeholder articles

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/api/articles?category=M')
    .then(response => {
      setArticles(response.data);
    })
    .catch(error => console.error('there was a problem fetching the articles', error));
  }, []);


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage menu visibility

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
    <div class="Barbati-Page">
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
         <input type="text" placeholder="Search..." />
         <button onClick={handleAccountClick}>Contul Meu</button>
         <button className="My-Basket" onClick={() => navigate('/basket')}>Cosul Meu</button>
       </header>
        <div className="Barbati">
       <header className="Barbati-header">
         <h1>Haine Sport pentru Barbati</h1>
         <p>Numar de produse: {articles.length}</p>
       </header>
       <div className="Barbati-content">
         <aside className="Barbati-filters">
           <h2>Filtre</h2>
           <div className="filter-group">
             <h3>Tipuri de articole</h3>
             <select name="type" onChange={handleFilterChange}>
               <option value="">Toate</option>
               <option value="t-shirts">Tricouri</option>
               <option value="pants">Pantaloni</option>
               <option value="shoes">Incaltaminte</option>
               <option value="accessories">Accesorii</option>
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
        {articles.map(article => (
          <div key={article.id} className="article" onClick={() => navigate(`/article/${article.id}`)} style={{ cursor: 'pointer' }}>
            <img src={article.imageUrl} alt={article.title} style={{ width: '150px', height: 'auto' }} />
            <h3>{article.title}</h3>
            <p>{article.description}</p>
            <p>${article.price}</p>
          </div>
        ))}
      </main>
       </div>
     </div>
     </div>
   );
 }
 
 export default Barbati;