import axios from "axios";
import { getCookieByName } from "../utils/cookies";
import { deletePromotionsForProduct } from "./promotion";
import { deleteOrdersWithProduct } from "./order";

const API_URL = "http://localhost:3030";

export const getAllProducts = () => {
    return new Promise((resolve, reject) => {
        axios.get(API_URL + "/product")
            .then((res) => resolve(res))
            .catch((err) => {
                reject(err);
            })
    });
};

export const createProduct = (title, description, price, category_id) => {
    if (!title || title === "") return;
    if (!description || description === "") return;
    if (!price || price < 0) return;
    if (!category_id || category_id < 0) return;

    const payload = { title: title, description: description, price: price, category_id: category_id };

    return new Promise((resolve, reject) => {
        axios.post(API_URL + "/product", payload, {
            headers: {
                Authorization: "Bearer " + getCookieByName("accessToken")
            },
            validateStatus: function (status) {
                return status <= 422;
            }
        })
            .then((res) => resolve(res))
            .catch((err) => {
                reject(err);
            })
    });
};

export const getProductById = (id) => {
    if (!id || id < 0 || isNaN(id)) return;

    return new Promise((resolve, reject) => {
        axios.get(API_URL + `/product/id/${id}`)
            .then((res) => resolve(res))
            .catch((err) => {
                reject(err);
            })
    });
};

export const updateProduct = (id, title, description, price, category_id) => {
    if (!id || id < 0 || isNaN(id)) return;
    if (!description || description === "") return;
    if (!title || title === "") return;
    if (!price || price < 0 || isNaN(price)) return;
    if (!category_id || category_id < 0 || isNaN(category_id)) return;

    const payload = { updateData: { product_id: id, product_title: title, product_description: description, product_price: price, category_id: category_id } };

    return new Promise((resolve, reject) => {
        axios.put(API_URL + `/product/${id}`, payload, {
            headers: {
                Authorization: "Bearer " + getCookieByName("accessToken")
            },
            validateStatus: function (status) {
                return status <= 422;
            }
        })
            .then((res) => resolve(res))
            .catch((err) => {
                reject(err);
            })
    });
};

export const getProductPicturePaths = (id) => {
    if (!id || id < 0 || isNaN(id)) return;

    return new Promise((resolve, reject) => {
        axios.get(API_URL + `/product/pictures/${id}`)
            .then((res) => resolve(res))
            .catch((err) => {
                reject(err);
            })
    });
};

export const deleteProduct = async (id) => {
    if (!id || id < 0 || isNaN(id)) return;

  // Cascade service deletion
  await deletePromotionsForProduct(id);
  await deletePicturesForProduct(id);
  await deleteOrdersWithProduct(id);
  
    return new Promise((resolve, reject) => {
      axios
        .get(API_URL + `/product/delete/${id}`, {
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

  const deletePicturesForProduct = (id) => {
    if (id < 0 || isNaN(id)) return;

    const payload = {product_id: id};

    return new Promise((resolve, reject) => {
        axios.post(API_URL + `/product/picture/remove/all`, payload, {
            headers: {
                Authorization: "Bearer " + getCookieByName("accessToken"),
            },
        })
            .then((res) => resolve(res))
            .catch((err) => {
                reject(err);
            })
    });
};
