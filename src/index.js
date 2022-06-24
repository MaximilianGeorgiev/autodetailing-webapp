import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { CookiesProvider } from "react-cookie";

import { Login } from "./components/Login";
import { Logout } from "./components/Logout";
import { Register } from "./components/Register";
import { CreateProduct } from "./components/create/CreateProduct";
import { CreateService } from "./components/create/CreateService";
import { CreatePromotion } from "./components/create/CreatePromotion";
import { CreateBlog } from "./components/create/CreateBlog";
import { EditProduct } from "./components/edit/EditProduct";
import { EditService } from "./components/edit/EditService";
import { EditPromotion } from "./components/edit/EditPromotion";
import { EditBlog } from "./components/edit/EditBlog";
import { ShowProduct } from "./components/show/ShowProduct";
import { ShowService } from "./components/show/ShowService";
import { ShowPromotion } from "./components/show/ShowPromotion";
import { ShowBlog } from "./components/show/ShowBlog";
import { ProductTable } from "./components/tables/ProductTable";
import { ServiceTable } from "./components/tables/ServiceTable";
import { PromotionTable } from "./components/tables/PromotionTable";
import { ReservationTable } from "./components/tables/ReservationTable";
import { OrderTable } from "./components/tables/OrderTable";
import { UserTable } from "./components/tables/UserTable";

import { Home } from "./components/Home.js";

import { App } from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
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
          <Route path="/blogs/create" element={<CreateBlog />} />
          <Route path="/products/edit/:id" element={<EditProduct />} />
          <Route path="/services/edit/:id" element={<EditService />} />
          <Route path="/promotions/edit/:id" element={<EditPromotion />} />
          <Route path="/blogs/edit/:id" element={<EditBlog />} />
          <Route path="/products/show/:id" element={<ShowProduct />} />
          <Route path="/services/show/:id" element={<ShowService />} />
          <Route path="/promotions/show/:id" element={<ShowPromotion />} />
          <Route path="/blogs/show/:id" element={<ShowBlog />} />
          <Route path="/products/show/all" element={<ProductTable />} />
          <Route path="/services/show/all" element={<ServiceTable />} />
          <Route path="/promotions/show/all" element={<PromotionTable />} />
          <Route path="/reservations/show/all" element={<ReservationTable />} />
          <Route path="/orders/show/all" element={<OrderTable />} />
          <Route path="/users/show/all" element={<UserTable />} />
          <Route path="/test" element={<Home />} />    
        </Routes>
        <App />
      </BrowserRouter>
    </CookiesProvider>
);
