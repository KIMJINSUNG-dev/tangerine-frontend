import api from "./axios";

export const getDocumentsByType = (typeId, page = 0, size = 20) =>
    api.get(`/api/documents/type/${typeId}`, { params: { page, size }});

export const getDocument = (id) =>
    api.get(`/api/documents/${id}`);

export const createDocument = (data) =>
    api.post("/api/documents", data);

export const updateDocument = (id, data) =>
    api.put(`/api/documents/${id}`, data);

export const deleteDocument = (id) =>
    api.delete(`/api/documents/${id}`);