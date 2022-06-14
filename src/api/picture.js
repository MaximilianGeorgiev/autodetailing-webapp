import axios from "axios";
import { getCookieByName } from "../utils/cookies";

const API_URL = "http://localhost:3030";

export const uploadPictures = (pictures) => {
    if (!pictures) return;
    if (pictures.files.length <= 0) return;

    const formData = new FormData();
    
    for (let i = 0; i < pictures.files.length; i ++) formData.append("pictures", pictures.files[i]);



    return new Promise((resolve, reject) => {
        axios.post(API_URL + "/picture/add", {
            headers: {
                Authorization: "Bearer " + getCookieByName("accessToken"),
                "Content-Type": "multipart/form-data"
            }
        })
            .then((res) => resolve(res))
            .catch((err) => {
                reject(err);
            })
    });
};
