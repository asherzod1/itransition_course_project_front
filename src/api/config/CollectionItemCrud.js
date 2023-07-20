import {HttpRequestHubWithToken} from "../httpRequestHub.js";

export const postCollectionItemApi = (data) => {
    const config = {
        method: "POST",
        url: `collection-items/`,
        data
    };
    return HttpRequestHubWithToken(config);
};

export const getCollectionItemByCollectionIdApi = (collectionId, userId) => {
    const config = {
        method: "GET",
        url: `collection-items/?collectionId=${collectionId}&userId=${userId}`
    };
    return HttpRequestHubWithToken(config);
};

export const getCollectionItemApi = (userId) => {
    const config = {
        method: "GET",
        url: `collection-items/?userId=${userId}`
    };
    return HttpRequestHubWithToken(config);
};

export const deleteCollectionItemApi = (id) => {
    const config = {
        method: "DELETE",
        url: `collection-items/${id}/`,
    };
    return HttpRequestHubWithToken(config);
};

export const editCollectionItemApi = (id, data) => {
    const config = {
        method: "PUT",
        url: `collection-items/${id}/`,
        data
    };
    return HttpRequestHubWithToken(config);
};

export const getCollectionItemByIdApi = (id) => {
    const config = {
        method: "GET",
        url: `collection-items/${id}/`
    };
    return HttpRequestHubWithToken(config);
};

export const getTagsApi = () => {
    const config = {
        method: "GET",
        url: `tags/`
    };
    return HttpRequestHubWithToken(config);
};

export const postLikeApi = (data) => {
    const config = {
        method: "POST",
        url: `likes/`,
        data
    };
    return HttpRequestHubWithToken(config);
};

export const editLikeApi = (id, data) => {
    const config = {
        method: "PUT",
        url: `likes/${id}/`,
        data
    };
    return HttpRequestHubWithToken(config);
};

export const deleteLikeApi = (id) => {
    const config = {
        method: "DELETE",
        url: `likes/${id}/`,
    };
    return HttpRequestHubWithToken(config);
};

export const getCollectionItemByTagApi = (tagId, userId) => {
    const config = {
        method: "GET",
        url: `tags/${tagId}/?userId=${userId}`
    };
    return HttpRequestHubWithToken(config);
};
