import axios from "axios";
import { getCookieByName } from "../utils/cookies";

const API_URL = "http://localhost:3030";

export const getAllPromotions = () => {
  return new Promise((resolve, reject) => {
      axios.get(API_URL + "/promotion")
          .then((res) => resolve(res))
          .catch((err) => {
              reject(err);
          })
  });
};

export const createPromotion = (
  dateFrom,
  dateTo,
  newPrice,
  entity_id,
  entityType
) => {
  if (dateFrom === null) return;
  if (dateTo === null) return;
  if (!newPrice || newPrice < 0) return;
  if (!entity_id || entity_id < 0) return;
  if (!entityType || entityType === "") return;

  let payload = { from: dateFrom, to: dateTo, price: newPrice };

  if (entityType === "product") payload = { ...payload, product_id: entity_id };
  else if (entityType === "service")
    payload = { ...payload, service_id: entity_id };
  else return;

  return new Promise((resolve, reject) => {
    axios
      .post(API_URL + "/promotion", payload, {
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

export const getPromotionById = (id) => {
  if (!id || id < 0 || isNaN(id)) return;

  return new Promise((resolve, reject) => {
    axios
      .get(API_URL + `/promotion/id/${id}`)
      .then((res) => resolve(res))
      .catch((err) => {
        reject(err);
      });
  });
};

export const getPromotionByServiceId = (id) => {
  if (!id || id < 0 || isNaN(id)) return;

  return new Promise((resolve, reject) => {
    axios
      .get(API_URL + `/promotion/service/${id}`)
      .then((res) => resolve(res))
      .catch((err) => {
        reject(err);
      });
  });
};

export const getPromotionByProductId = (id) => {
  if (!id || id < 0 || isNaN(id)) return;

  return new Promise((resolve, reject) => {
    axios
      .get(API_URL + `/promotion/product/${id}`)
      .then((res) => resolve(res))
      .catch((err) => {
        reject(err);
      });
  });
};

export const updatePromotion = (
  id,
  dateFrom,
  dateTo,
  newPrice,
  entity_id,
  entity
) => {
  if (!id || id < 0 || isNaN(id)) return;
  if (!dateFrom || dateFrom === null) return;
  if (!dateTo || dateTo === null) return;
  if (!newPrice || newPrice < 0 || isNaN(newPrice)) return;
  if (!entity_id || entity_id < 0 || isNaN(entity_id)) return;
  if (!entity || entity === "") return;

  let updateData = {
    promotion_from: dateFrom,
    promotion_to: dateTo,
    promotion_new_price: newPrice,
  };

  if (entity === "service")
    updateData = { ...updateData, service_id: entity_id };
  else if (entity === "product")
    updateData = { ...updateData, product_id: entity_id };

  let payload = { updateData: updateData };

  return new Promise((resolve, reject) => {
    axios
      .put(API_URL + `/promotion/${id}`, payload, {
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

export const deletePromotion = (id) => {
  if (!id || id < 0 || isNaN(id)) return;

  return new Promise((resolve, reject) => {
    axios
      .get(API_URL + `/promotion/delete/${id}`, {
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

export const deletePromotionsForService = (id) => {
  if (!id || id < 0 || isNaN(id)) return;

  return new Promise((resolve, reject) => {
    axios
      .get(API_URL + `/promotion/delete/service/${id}`, {
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
