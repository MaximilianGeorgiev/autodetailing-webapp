import axios from "axios";
import { getCookieByName } from "../utils/cookies";

const API_URL = "http://localhost:3030";

export const getAllVehicleTypes = () => {
    return new Promise((resolve, reject) => {
        axios.get(API_URL + "/vehicle-type", {
            headers: {
                Authorization: "Bearer " + getCookieByName("accessToken")
            }
        })
            .then((res) => resolve(res))
            .catch((err) => {
                reject(err);
            })
    });
};
