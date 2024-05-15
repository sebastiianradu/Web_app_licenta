import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MainPage from '../MainPage/MainPage.js';
import LoginPage from '../LogIn/LogInPage.js';
import CreateAccountPage from '../LogIn/CreateAccount.js';
import Barbati from '../Pages/Barbati/Barbati.js';
import Femei from  '../Pages/Femei/Femei.js';
import Copii from '../Pages/Copii/Copii.js';
import Account from '../Account/Account.js';
import ProtectedRoute from '../ProtectedRoute.js';
import Article from '../ArticlePage/Article.js';
import Basket from '../Basket/Basket.js';
import Comanda from '../Comanda/OrderPage.js';
import FinalOrder from '../FinalOrder/FinalOrder.js';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/account" element={
        <ProtectedRoute>
          <Account />
        </ProtectedRoute>
      }/>
      <Route path="/" element={<MainPage />} />
      <Route path="/create-account" element={<CreateAccountPage />} />
      <Route path="/barbati" element={<Barbati />} />
      <Route path="/femei" element={<Femei />} />
      <Route path="/copii" element={<Copii />} />
      <Route path="/article/:id" element={<Article />} />
      <Route path="/basket" element={<Basket />} />
      <Route path="/orders" element={<Comanda />} />
      <Route path="/final-order" element={<FinalOrder />} />
    </Routes>
  );
}

export default App;

