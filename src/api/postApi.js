import api from "./axios";

export const getPosts = (boardType, page = 0, size = 20, keyword = null) => {

    const params = { boardType, page, size };
    if (keyword) params.keyword = keyword;
    return api.get("/api/posts", { params });
};

export const getPost = (id) => api.get(`/api/posts/${id}`);

export const createPost = (data) => api.post("/api/posts", data);

export const updatePost = (id, data) => api.put(`/api/posts/${id}`, data);

export const deletePost = (id) => api.delete(`/api/posts/${id}`);

export const getComments = (postId) =>
    api.get(`/api/posts/${postId}/comments`);

export const createComment = (postId, content) =>
    api.post(`/api/posts/${postId}/comments`, content, {

        headers: { "Content-Type": "text/plain" },
    });

export const updateComment = (commentId, content) =>
    api.put(`/api/posts/comments/${commentId}`, content, {

        headers: { "Content-Type": "text/plain" },
    });

export const deleteComment = (commentId) =>
    api.delete(`/api/posts/comments/${commentId}`);