import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { CookiesProvider } from "react-cookie";

import { Login } from "./components/Login";
import { Logout } from "./components/Logout";
import { Register } from "./components/Register";
import { CreateProduct } from "./components/create/CreateProduct";
import { CreateService } from "./components/create/CreateService";
import { CreatePromotion } from "./components/create/CreatePromotion";
import { EditProduct } from "./components/edit/EditProduct";
import { EditService } from "./components/edit/EditService";

import { App } from "./App";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <CookiesProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/" element={<App />} />
        <Route path="/products/create" element={<CreateProduct />} />
        <Route path="/services/create" element={<CreateService />} />
        <Route path="/promotions/create" element={<CreatePromotion />} />
        <Route path="/products/edit/:id" element={<EditProduct />} />
        <Route path="/services/edit/:id" element={<EditService />} />
      </Routes>
      <App />
    </BrowserRouter>
    </CookiesProvider>
  </React.StrictMode>
);