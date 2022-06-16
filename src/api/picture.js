import axios from "axios";
import { getCookieByName } from "../utils/cookies";

const API_URL = "http://localhost:3030";

/*
    Picture uploading flow:
         1. Add the picture file physically on the server
         2. If it is successful it returns the file path
         3. We then insert into the "EntityPicture" table the file path with the corresponding service id
*/
export const handlePictureUpload = (entityType, id, pictures) => {
    uploadPictures(pictures).then((res) => {
        if (res.data?.status === "success") {
            const paths = res.data?.paths;

            for (let i = 0; i < paths.length; i++) {
                insertPicPathToDatabase(entityType, id, paths[i]).then((insertRes) => {
                    if (insertRes.data?.status === "failed") return false;
                });
            }
        } else return false;
    });

    return true;
};

export const handlePictureDelete = (entityType, id, path) => {
    if (!id || id < 0 || isNaN(id)) return;
    if (!path || path === "") return;
    if (!entityType || (entityType !== "service" && entityType !== "product")) return;

    let payload = {picture_path: path};

    if (entityType === "service") payload = { ...payload, service_id: id }
    else if (entityType === "product") payload = { ...payload, product_id: id }

    
    return new Promise((resolve, reject) => {
        axios.post(API_URL + `/${entityType}/picture/remove`, payload, {
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

const insertPicPathToDatabase = (entityType, id, path) => {
    if (!id || id < 0 || isNaN(id)) return;
    if (!path || path === "") return;
    if (!entityType || (entityType !== "service" && entityType !== "product")) return;

    let payload = { picture_path: path };

    if (entityType === "service") payload = { ...payload, service_id: id }
    else if (entityType === "product") payload = { ...payload, product_id: id }

    return new Promise((resolve, reject) => {
        axios.post(API_URL + `/${entityType}/picture/add`, payload, {
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


