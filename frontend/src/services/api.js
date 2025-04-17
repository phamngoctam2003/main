import axios from "../utils/axios-customize";
import Cookies from "js-cookie";
const getHeaders = () => ({
    'Content-Type': 'multipart/form-data',
    'Authorization': `Bearer ${Cookies.get('user-info')}`,
});

const apiPost = async (url, data) => {
    try {
        const response = await axios.post(url, data, {
            headers: getHeaders(),
        });
        return response;
    } catch (error) {
        console.error("lỗi khi gọi api, file: api",error);
        throw error;
    }
}

const apiGet = async (url) => {
    try {
        const response = await axios.get(url, {
            headers: getHeaders(),
        });
        return response;
    } catch (error) {
        console.error("lỗi khi gọi api, file: api",error);
        throw error;
    }
}


export const callRegister = async (name, email, password, ) => {
    return apiPost("/register", { name, email, password });
};

export const calllogin = async (email, password, ) => {
    return apiPost("/login", { email, password });
};

export const callCategory = async (id = null) => {
    const url = id ? `/getcategory/${id}` : "/getcategory";
    return apiGet(url);
};

export const callNAV = async () => {
    return apiGet("callnav");
};

export const destroy = async (ids) => {
    return apiPost("/getcategory/delete", { ids });
};

export const create = (name, description) => {
    return apiPost("/getcategory/create", { name, description });
};

export const update = (id, name, description) => {
    return apiPost(`/getcategory/update/${id}`, { name, description });
};