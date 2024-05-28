import React from 'react';
import { useLocation } from 'react-router-dom';
import './FinalOrder.css';

function FinalOrderPage() {
  const location = useLocation();
  const { user } = location.state || { user: { firstName: '', lastName: '' } };

  return (
    <div className="App">
      <header className="App-header">
        <div className="menu-container">
          <div className="menu-button" onClick={() => {}}>Menu &#9776;</div>
          {/* Add menu items here if needed */}
        </div>

        <div className="nume-firma-icon">
          <img src="/Firma.jpg" className="nume-firma-img" alt="Firma" />
        </div>

        <input type="text" placeholder="Search..." />
        <button className="Account">Contul Meu</button>
        <button className="My-Basket">Cosul Meu</button>
      </header>

      <div className="order-confirmation-container">
        <h1>Comanda Finalizată</h1>
        <p>{user.firstName} {user.lastName},</p>
        <p>Multumim ca ai ales sa achizitionezi produse de la noi! Te mai asteptam!</p>
        <p>Pentru a afla mai multe detalii despre comandata te rog apasa <a href="/path/to/order-details.pdf" download>aici</a>.</p>
      </div>
    </div>
  );
}

export default FinalOrderPage;
