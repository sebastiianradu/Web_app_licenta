import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../AxiosInstance';

function CreateAccountPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
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
        alert("Account created successfully!");
        navigate('/login'); // Redirect to login page after successful account creation
      } else {
        alert("Account creation failed. Please try again!");
      }
    } catch (error) {
      console.error('Account creation error:', error);
      alert("Account creation failed. Please try again!");
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
        <form onSubmit={handleSubmit}> {/* Updated to use handleSubmit */}
          <h2>Create New Account</h2>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
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
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className='Create-Acc' type="submit">Create Account</button>
        </form>
      </div>
    </div>
  );
}

export default CreateAccountPage;
