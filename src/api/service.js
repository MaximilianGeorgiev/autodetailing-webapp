import axios from "axios";
import { getCookieByName } from "../utils/cookies";

const API_URL = "http://localhost:3030";

export const createService = (title, description, price, category_id) => {
    if (!title || title === "") return;
    if (!description || description === "") return;
    if (!price || price < 0) return;
    if (!category_id || category_id < 0) return;

    const payload = { title: title, description: description, price: price, category_id: category_id};

    return new Promise((resolve, reject) => {
        axios.post(API_URL + "/service", payload, {
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