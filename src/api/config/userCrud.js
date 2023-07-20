import {HttpRequestHubWithToken} from "../httpRequestHub.js";

export const getUsersApi = () => {
    const config = {
        method: "GET",
        url: `users/`,
    };
    return HttpRequestHubWithToken(config);
};

export const updateUserStatusApi = (data) => {
    const config = {
        method: "POST",
        url: `users/status/`,
        data
    };
    return HttpRequestHubWithToken(config);
};

export const updateUserRoleApi = (data) => {
    const config = {
        method: "POST",
        url: `users/role/`,
        data
    };
    return HttpRequestHubWithToken(config);
};

export const deleteUserApi = (id) => {
    const config = {
        method: "DELETE",
        url: `users/${id}/`,
    };
    return HttpRequestHubWithToken(config);
};

export const searchApi = (text) => {
    const config = {
        method: "GET",
        url: `search/?q=${text}`,
    };
    return HttpRequestHubWithToken(config);
};
