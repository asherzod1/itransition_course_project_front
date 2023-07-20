
import axios from "axios";
import {BASE_URL, TOKEN_ACCESS} from "./host.js";

export const HttpRequestHubWithToken = (config = null) => {
    const token = localStorage.getItem(TOKEN_ACCESS);
    const lang = localStorage.getItem('i18nextLng')?.split('-')[0]
    let headers = {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": `Bearer ${token}`,
        "accept-language": lang
    };

    let axiosInstance = axios.create({
        baseURL: `${BASE_URL}/`,
        headers,
        timeout: 100000,
    });

    axiosInstance.interceptors.response.use(
        response => {
            if(response.status === 401){
                localStorage.removeItem(TOKEN_ACCESS);
                localStorage.removeItem("current_user");
                window.location.href = '/login'
            }
            return response
        },
        function (error) {
            return Promise.reject(error)
        }
    )
    return axiosInstance(config);
};
