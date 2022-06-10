import axios from "axios";

const API_URL = "http://localhost:3030";

export const login = (email, password) => {
    if (!email || email === "") return;
    if (!password || password === "") return;

    const payload = { email: email, password: password };

    return new Promise((resolve, reject) => {
        axios.post(API_URL + "/user/login", payload, {
            validateStatus: function (status) {
                return status <= 422;
            }
        })
        .then((res) => resolve(res))
        .catch((err) => {
            console.log("BOKLUK" + err);
            reject(err);
        })
    })
};