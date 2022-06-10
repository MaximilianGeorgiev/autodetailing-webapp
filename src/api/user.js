import axios from "axios";

const API_URL = "http://localhost:3030";

export const login = (email, password) => {
    if (!email || email === "") return;
    if (!password || password === "") return;

    const payload = { email: email, password: password };

    // overriding the default axios behaviour to throw for statuses 400, 500 so they can be handled
    // manually and displayed accordingly to the customer
    return new Promise((resolve, reject) => {
        axios.post(API_URL + "/user/login", payload, {
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

export const register = (userInfo) => {
    if (!userInfo) return;
    if (!userInfo?.email || userInfo?.email === "") return;
    if (!userInfo?.password || userInfo?.password === "") return;
    if (!userInfo?.username || userInfo?.username === "") return;
    if (!userInfo?.fullname || userInfo?.fullname === "") return;

    return new Promise((resolve, reject) => {
        axios.post(API_URL + "/user", userInfo, {
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