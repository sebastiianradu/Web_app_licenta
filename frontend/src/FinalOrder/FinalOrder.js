import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './FinalOrder.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

function FinalOrderPage() {
  const location = useLocation();
  const { user } = location.state || { user: { firstName: '', lastName: '' } };

  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const downloadPDF = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Va rugam conectati-va pentru a descarca PDF-ul');
        navigate('/login');
        return;
      }

      const response = await axios.get(`http://localhost:3001/api/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `user-order.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading the PDF:', error);
      alert("eroare la descarcarea PDF-ului!");
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

        <input className="text" type="text" placeholder="Search..." value={searchTerm} onChange={handleSearch} />
        <button className="Account" onClick={handleAccountClick}>Contul Meu</button>
        <button className="My-Basket" onClick={() => navigate('/basket')}>Cosul Meu</button>
      </header>

      <div className="order-confirmation-container">
        <h1>Comanda Finalizată</h1>
        <p>{user.firstName} {user.lastName},</p>
        <p>Multumim ca ai ales sa achizitionezi produse de la noi! Te mai asteptam!</p>
        <p>Pentru a afla mai multe detalii despre comandata te rog apasa <a href="#" onClick={downloadPDF}>aici</a>.</p>
      </div>
    </div>
  );
}

export default FinalOrderPage;
