import axios from "axios";
import { getCookieByName } from "../utils/cookies";

const API_URL = "http://localhost:3030";

export const getAllRoles = () => {
    return new Promise((resolve, reject) => {
        axios.get(API_URL + "/role", {
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

export const getRoleByName = (roleName) => {
    if (!roleName || roleName === "") return "";

    return new Promise((resolve, reject) => {
        axios.get(API_URL + "/roles/name/" + roleName, {
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

export const unassignUserRoles = (id) => {
    if (!id || id < 0 || isNaN(id)) return;
  
    return new Promise((resolve, reject) => {
      axios
        .get(API_URL + `/roles/unassign/user/${id}`, {
          headers: {
            Authorization: "Bearer " + getCookieByName("accessToken"),
          },
          validateStatus: function (status) {
            return status <= 422;
          },
        })
        .then((res) => resolve(res))
        .catch((err) => {
          reject(err);
        });
    });
  };