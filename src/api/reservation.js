import axios from "axios";
import { getCookieByName } from "../utils/cookies";

const API_URL = "http://localhost:3030";

export const createReservation = (userId, date, isPaid, totalPrice) => {
  if (!totalPrice || totalPrice < 0 || isNaN(totalPrice)) return;
  if (!userId || userId < 0 || isNaN(userId)) return;
  if (date === null) return;

  const payload = {
    datetime: date,
    ispaid: isPaid,
    user_id: userId,
    totalPrice: totalPrice,
  };

  return new Promise((resolve, reject) => {
    axios
      .post(API_URL + "/reservation", payload, {
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

export const deleteReservationsWithService = (id) => {
  if (!id || id < 0 || isNaN(id)) return;

  return new Promise((resolve, reject) => {
    axios
      .get(API_URL + `/order/delete/service/${id}`, {
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

export const getAllReservations = () => {
  return new Promise((resolve, reject) => {
    axios.get(API_URL + "/reservation", {
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

export const deleteReservation = (id) => {
  if (!id || id < 0 || isNaN(id)) return;

  return new Promise((resolve, reject) => {
    axios
      .get(API_URL + `/reservation/delete/${id}`, {
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

export const addServiceToReservation = (reservationId, serviceId) => {
  if (!reservationId || reservationId < 0 || isNaN(reservationId)) return;
  if (!serviceId || serviceId < 0 || isNaN(serviceId)) return;

  const payload = { reservation_id: reservationId, service_id: serviceId };

  return new Promise((resolve, reject) => {
    axios
      .post(API_URL + "/reservation/service/add", payload, {
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
