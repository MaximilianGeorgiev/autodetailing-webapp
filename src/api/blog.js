import axios from "axios";
import { getCookieByName } from "../utils/cookies";

const API_URL = "http://localhost:3030";

const deletePicturesForBlog = (id) => {
    if (id < 0 || isNaN(id)) return;

    const payload = {blog_id: id};

    return new Promise((resolve, reject) => {
        axios.post(API_URL + `/blog/picture/remove/all`, payload, {
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

export const getBlogById = (id) => {
    if (!id || id < 0 || isNaN(id)) return;

    return new Promise((resolve, reject) => {
        axios.get(API_URL + `/blog/id/${id}`)
            .then((res) => resolve(res))
            .catch((err) => {
                reject(err);
            })
    });
};

export const getAllBlogs = () => {
    return new Promise((resolve, reject) => {
        axios.get(API_URL + "/blog")
            .then((res) => resolve(res))
            .catch((err) => {
                reject(err);
            })
    });
};

export const updateBlog = (id, title, text) => {
    if (!id || id < 0 || isNaN(id)) return;
    if (!text || text === "") return;
    if (!title || title === "") return;

    const payload = { updateData: { blog_id: id, blog_title: title, blog_text: text } };

    return new Promise((resolve, reject) => {
        axios.put(API_URL + `/blog/${id}`, payload, {
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

export const getBlogPicturePaths = (id) => {
    if (!id || id < 0 || isNaN(id)) return;

    return new Promise((resolve, reject) => {
        axios.get(API_URL + `/blog/pictures/${id}`)
            .then((res) => resolve(res))
            .catch((err) => {
                reject(err);
            })
    });
};

export const deleteBlog = async (id) => {
    if (!id || id < 0 || isNaN(id)) return;

    await deletePicturesForBlog(id);

    return new Promise((resolve, reject) => {
        axios
            .get(API_URL + `/blog/delete/${id}`, {
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

export const deleteBlogsForUser = (id) => {
    if (!id || id < 0 || isNaN(id)) return;
  
    return new Promise((resolve, reject) => {
      axios
        .get(API_URL + `/blog/delete/user/${id}`, {
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