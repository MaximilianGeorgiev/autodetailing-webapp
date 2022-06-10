import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { CookiesProvider } from "react-cookie";

import { Login } from "./components/Login";
import { App } from "./App";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CookiesProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
      <App />
    </BrowserRouter>
    </CookiesProvider>
  </React.StrictMode>
);