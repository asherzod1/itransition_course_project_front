import {HttpRequestHubWithToken} from "../httpRequestHub.js";

export const postCollectionApi = (data) => {
    const config = {
        method: "POST",
        url: `collection/`,
        data
    };
    return HttpRequestHubWithToken(config);
};

export const getCollectionApi = () => {
    const config = {
        method: "GET",
        url: `collection/`
    };
    return HttpRequestHubWithToken(config);
};

export const deleteCollectionApi = (id) => {
    const config = {
        method: "DELETE",
        url: `collection/${id}/`,
    };
    return HttpRequestHubWithToken(config);
};

export const editCollectionApi = (id, data) => {
    const config = {
        method: "PUT",
        url: `collection/${id}/`,
        data
    };
    return HttpRequestHubWithToken(config);
};

export const getCollectionByIdApi = (id) => {
    const config = {
        method: "GET",
        url: `collection/${id}/`
    };
    return HttpRequestHubWithToken(config);
};

export const getCollectionWithOutTokenApi = () => {
    const config = {
        method: "GET",
        url: `collection/home/`
    };
    return HttpRequestHubWithToken(config);
};
