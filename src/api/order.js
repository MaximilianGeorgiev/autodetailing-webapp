import axios from "axios";
import { getCookieByName } from "../utils/cookies";

const API_URL = "http://localhost:3030";

export const createOrder = (
  userId,
  isDelivery,
  address,
  isPaid,
  totalPrice
) => {
  if (!totalPrice || totalPrice < 0 || isNaN(totalPrice)) return;
  if (!userId || userId < 0 || isNaN(userId)) return;

  const payload = {
    isdelivery: isDelivery,
    ispaid: isPaid,
    customer_id: userId,
    address: address,
    totalprice: totalPrice,
  };

  return new Promise((resolve, reject) => {
    axios
      .post(API_URL + "/order", payload, {
        headers: {
          Authorization: "Bearer " + getCookieByName("accessToken"),
        },
        validateStatus: function (status) {
          return status <= 422;
        },
      })
      .then((res) => resolve(res))
      .catch((err) => {
        reject(err);
      });
  });
};

export const getAllOrders = () => {
  return new Promise((resolve, reject) => {
    axios.get(API_URL + "/order", {
      headers: {
        Authorization: "Bearer " + getCookieByName("accessToken"),
      }
    })
      .then((res) => resolve(res))
      .catch((err) => {
        reject(err);
      })
  });
};

export const deleteOrder = (id) => {
  if (!id || id < 0 || isNaN(id)) return;

  return new Promise((resolve, reject) => {
    axios
      .get(API_URL + `/order/delete/${id}`, {
        headers: {
          Authorization: "Bearer " + getCookieByName("accessToken"),
        },
        validateStatus: function (status) {
          return status <= 422;
        },
      })
      .then((res) => resolve(res))
      .catch((err) => {
        reject(err);
      });
  });
};

export const deleteOrdersWithProduct = (id) => {
  if (!id || id < 0 || isNaN(id)) return;

  return new Promise((resolve, reject) => {
    axios
      .get(API_URL + `/order/delete/product/${id}`, {
        headers: {
          Authorization: "Bearer " + getCookieByName("accessToken"),
        },
        validateStatus: function (status) {
          return status <= 422;
        },
      })
      .then((res) => resolve(res))
      .catch((err) => {
        reject(err);
      });
  });
};


export const addProductToOrder = (orderId, productId) => {
  if (!orderId || orderId < 0 || isNaN(orderId)) return;
  if (!productId || productId < 0 || isNaN(productId)) return;

  const payload = { order_id: orderId, product_id: productId };

  return new Promise((resolve, reject) => {
    axios
      .post(API_URL + "/order/product/add", payload, {
        headers: {
          Authorization: "Bearer " + getCookieByName("accessToken"),
        },
        validateStatus: function (status) {
          return status <= 422;
        },
      })
      .then((res) => resolve(res))
      .catch((err) => {
        reject(err);
      });
  });
};
