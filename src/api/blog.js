import axios from "axios";
import { getCookieByName } from "../utils/cookies";

const API_URL = "http://localhost:3030";

export const createBlog = (title, text, author = null) => {
    if (!title || title === "") return;
    if (!text || text === "") return;


    let payload = { title: title, text: text };

    if (author === null) payload = { ...payload, author_id: getCookieByName("user_id") };
    else payload = { ...payload, author_id: author };

    return new Promise((resolve, reject) => {
        axios.post(API_URL + "/blog", payload, {
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