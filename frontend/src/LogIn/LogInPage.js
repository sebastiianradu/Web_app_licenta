//LogIn
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../AxiosInstance';
import './LogIn.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Perform the login operation here with the backend
      const response = await axiosInstance.post('/login', { email, password });

      if(response.status === 200){
        localStorage.setItem('token', response.data.token); // Save the token
        alert("Bine ati venit!");
        navigate('/'); // Redirect to main page after login
        window.location.reload(); // Force reload to update account information

      }
      else{
        alert("Login esuat!\nEmail sau parola incorecte, va rugam incercati din nou!");
      }
      
    } catch (error) {
      console.error('Login error:', error);
      alert("Login esuat!\nEmail sau parola incorecte, va rugam incercati din nou!");
    }
  };
  

  const handleCreateAccount = () => {
    navigate('/create-account'); // Redirect to create account page
  };



  return (
    <div className='App'>
    <header className="App-header">
    <div className="login-nume-firma-icon" onClick={() => navigate('/')}>
        <img src="/Firma.jpg" className="nume-firma-img" style={{ width: '270px', maxHeight: '100%' }}/>
    </div>
    </header>
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
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
        />
        <div class="buttons">
        <button className='LogIn' type="submit">Log in</button>
        <p>Nu ai inca un cont? Creeaza-ti acum unul apasand pe butonul de mai jos!</p>
        <button className='Create-Acc'type="button" onClick={handleCreateAccount}>Creare Cont</button> {/* Add this line */}</div>
      </form>
    </div>
    </div>
  );
}

export default LoginPage;

