import axios from "axios";
import { getCookieByName } from "../utils/cookies";

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
            });
    });
};

export const checkUserExists = (userInfo) => {
    if (!userInfo) return;
    if (!userInfo?.email) return;
    if (!userInfo?.username) return;

    return new Promise((resolve, reject) => {
        axios.get(API_URL + "/user/check/" + userInfo.email + "/" + userInfo.username, {
            validateStatus: function (status) {
                return status <= 422;
            }
        })
            .then((res) => resolve(res))
            .catch((err) => {
                reject(err);
            });
    });
};

export const getLoggedUserRoles = (userId) => {
    if (!userId || userId < 0) return [];

    return new Promise((resolve, reject) => {
        axios.get(API_URL + "/user/roles/" + userId, {
            validateStatus: function (status) {
                return status <= 422;
            },
            headers: {
                Authorization: "Bearer " + getCookieByName("accessToken")
            },
        })
            .then((res) => resolve(res))
            .catch((err) => {
                reject(err);
            });
    });
};

export const addRole = (userInfo) => {
    if (!userInfo?.user_id || userInfo?.user_id === "") return;
    if (!userInfo?.role_id || userInfo?.role_id === "") return;

    return new Promise((resolve, reject) => {
        axios.post(API_URL + "/user/role/add", userInfo, {
            validateStatus: function (status) {
                return status <= 422;
            },
            headers: {
                Authorization: "Bearer " + getCookieByName("accessToken")
            },
        })
            .then((res) => resolve(res))
            .catch((err) => {
                reject(err);
            });
    });
};