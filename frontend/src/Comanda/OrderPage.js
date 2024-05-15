import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importăm useHistory hook
import './OrderPage.css';

function OrderPage({ userId }) {
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const navigate = useNavigate();

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/orders', {
        userId: userId,
        address: address,
        phoneNumber: phoneNumber,
        paymentMethod: paymentMethod
      });

      console.log(response.data);

      // Redirecționăm utilizatorul către pagina "FinalOrder" după ce comanda este plasată cu succes
      navigate('/final-order');
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  return (
    <div className="order-container">
      <h1>Finalizare Comandă</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Adresă:
          <input type="text" value={address} onChange={handleAddressChange} />
        </label>
        <label>
          Nr. de Telefon:
          <input type="text" value={phoneNumber} onChange={handlePhoneNumberChange} />
        </label>
        <label>
          Metoda de plată:
          <select value={paymentMethod} onChange={handlePaymentMethodChange}>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
          </select>
        </label>
        <button type="submit">Finalizare Comandă</button>
      </form>
    </div>
  );
}

export default OrderPage;
