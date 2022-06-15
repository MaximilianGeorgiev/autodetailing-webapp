import axios from "axios";
import { getCookieByName } from "../utils/cookies";

const API_URL = "http://localhost:3030";

/*
    Picture uploading flow:
         1. Add the picture file physically on the server
         2. If it is successful it returns the file path
         3. We then insert into the "EntityPicture" table the file path with the corresponding service id
*/
export const handlePictureUpload = (serviceId, pictures) => {
    uploadPictures(pictures).then((res) => {
        if (res.data?.status === "success") {
            const paths = res.data?.paths;

            for (let i = 0; i < paths.length; i++) {
                insertPicPathToDatabase(serviceId, paths[i]).then((insertRes) => {
                    if (insertRes.data?.status === "failed") return false;
                });
            }
        } else return false;
    });

    return true;
};

const uploadPictures = (pictures) => {
    if (!pictures) return;
    if (pictures.length <= 0) return;

    const formData = new FormData();

    for (let i = 0; i < pictures.length; i++) formData.append("pictures", pictures[i]);

    return new Promise((resolve, reject) => {
        axios.post(API_URL + "/picture/add", formData, {
            headers: {
                Authorization: "Bearer " + getCookieByName("accessToken"),
                "Content-Type": "multipart/form-data"
            },
        })
            .then((res) => resolve(res))
            .catch((err) => {
                reject(err);
            })
    });
};

const insertPicPathToDatabase = (serviceId, path) => {
    if (!serviceId || serviceId < 0 || isNaN(serviceId)) return;
    if (!path || path === "") return;

    const payload = { service_id: serviceId, picture_path: path };

    return new Promise((resolve, reject) => {
        axios.post(API_URL + "/service/picture/add", payload, {
            headers: {
                Authorization: "Bearer " + getCookieByName("accessToken"),
            },
        })
            .then((res) => resolve(res))
            .catch((err) => {
                reject(err);
            })
    });
};


