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
import { EditReservation } from "./components/edit/EditReservation";
import { EditOrder } from "./components/edit/EditOrder";
import { EditBlog } from "./components/edit/EditBlog";
import { EditUser } from "./components/edit/EditUser";
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
import { EntityCards } from "./components/custom/EntityCards";
import { NotFound } from './components/custom/NotFound';
import { Contacts } from "./components/Contacts";

import { Home } from "./components/Home.js";

import { App } from "./App";
import { refreshToken } from "./api/user";
import './i18nextConf';
import axios from 'axios';
import { setCookies } from "./utils/cookies";

import { CONTACTS_PHONE, CONTACTS_OWNER_NAME, CONTACTS_EMAIL, CONTACTS_ADDRESS, CONTACTS_DESCRIPTION } from "./utils/info";

const root = ReactDOM.createRoot(document.getElementById("root"));

const instance = axios.create(); // if we don't use a new instance the token refreshing will trigger an endless loop

axios.interceptors.response.use(
  (res) => {
    if (res.status === 403) {
    }
    return res;
  },
  async (err) => {
    if (err.response.status === 403) {

      const result = await refreshToken();

      setCookies("accessToken", result.data.accessToken);
      setCookies("refreshToken", result.data.refreshToken);

      // attach the new access token and retry the failed API call
      instance.defaults.headers.common['Authorization'] = `Bearer ${result.data.accessToken}`;
      return instance.get(err.config.url);
    }
    return Promise.reject(err);
  }
);

root.render(
  <CookiesProvider>
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound />} />
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
        <Route path="/users/edit/:id" element={<EditUser />} />
        <Route path="/promotions/edit/:id" element={<EditPromotion />} />
        <Route path="/reservations/edit/:id" element={<EditReservation />} />
        <Route path="/orders/edit/:id" element={<EditOrder />} />
        <Route path="/blogs/edit/:id" element={<EditBlog />} />
        <Route path="/products/show/:id" element={<ShowProduct />} />
        <Route path="/services/show/:id" element={<ShowService />} />
        <Route path="/promotions/show/:id" element={<ShowPromotion />} />
        <Route path="/blogs/show/:id" element={<ShowBlog />} />
        <Route path="/products/show/all" element={<ProductTable />} />
        <Route path="/services/show/all" element={<ServiceTable />} />
        <Route path="/promotions/show/all" element={<PromotionTable />} />
        <Route path="/reservations" element={<ReservationTable />} />
        <Route path="/orders" element={<OrderTable />} />
        <Route path="/users/show/all" element={<UserTable />} />
        <Route path="/home" element={<Home />} />
        <Route path="/services" element={<EntityCards entityType="service" isPreview={false} />} />
        <Route path="/products" element={<EntityCards entityType="product" isPreview={false} />} />
        <Route path="/blogs" element={<EntityCards entityType="blog" isPreview={false} />} />
        <Route path="/contacts" element={<Contacts
          ownerName={CONTACTS_OWNER_NAME}
          email={CONTACTS_EMAIL}
          address={CONTACTS_ADDRESS}
          phone={CONTACTS_PHONE}
          description={CONTACTS_DESCRIPTION} />} />
      </Routes>
      <App />
    </BrowserRouter>
  </CookiesProvider>
);
