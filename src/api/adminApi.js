import api from "./axios";

// [추가] 관리자가 템플릿 필드를 추가
export const createTemplate = (data) =>
    api.post("/api/admin/templates", data);

// [추가] 관리자가 템플릿 필드를 삭제
export const deleteTemplate = (id) =>
    api.delete(`/api/admin/templates/${id}`);