import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { CookiesProvider } from "react-cookie";

import { Login } from "./components/Login";
import { Register } from "./components/Register";

import { App } from "./App";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CookiesProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <App />
    </BrowserRouter>
    </CookiesProvider>
  </React.StrictMode>
);