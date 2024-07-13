import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../AxiosInstance';
import './CreateAccount.css';

function CreateAccountPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    
    // Check if the password is at least 8 characters long
    if (password.length < 8) {
      alert("Parola prea scurta, numar minim de caractere: 8");
      return; // Exit the function if the password is too short
    }

    try {
      // Construct the request body
      const requestBody = {
        firstName,
        lastName,
        email,
        password,
      };

      // Send a POST request to the backend
      const response = await axiosInstance.post('/create-account', requestBody);
      
      if (response.status === 201) {
        alert("Contul dumneavoastra a fost creat cu succes!");
        navigate('/login'); // Redirect to login page after successful account creation
      } else {
        alert("Eroare la crearea contului!");
      }
    } catch (error) {
      console.error('Account creation error:', error);
      alert("Eroare la crearea contului!");
    }
  };

  return (
    <div className='App'>
      <header className="App-header">
        <div className="login-nume-firma-icon" onClick={() => navigate('/')}>
            <img src="/Firma.jpg" className="nume-firma-img" style={{ width: '270px', maxHeight: '100%' }}/>
        </div>
      </header>
      <div className="create-account-container">
        <form onSubmit={handleSubmit}>
          <h2>Creeaza-ti un nou cont acum!</h2>
          <div className="text">
          <input
            type="text"
            placeholder="Prenume"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Nume"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Parola"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          /></div>
          <button className='Create-Acc' type="submit">Creeaza cont</button>
        </form>
      </div>
    </div>
  );
}

export default CreateAccountPage;
