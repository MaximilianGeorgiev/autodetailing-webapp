import axios from "axios";
import { getCookieByName } from "../utils/cookies";

const API_URL = "http://localhost:3030";

export const createPromotion = (dateFrom, dateTo, newPrice, entity_id, entityType) => {
    if (dateFrom === null) return;
    if (dateTo === null) return;
    if (!newPrice || newPrice < 0) return;
    if (!entity_id || entity_id < 0) return;
    if (!entityType || entityType === "") return;


    let payload = { from: dateFrom, to: dateTo, price: newPrice };

    if (entityType === "product") payload = {...payload, product_id: entity_id}
    else if (entityType === "service") payload = {...payload, service_id: entity_id}
    else return;

    return new Promise((resolve, reject) => {
        axios.post(API_URL + "/promotion", payload, {
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