import api from "./axios";
// [추가] interface들은 타입이라 import type으로 가져와요
import type {

    Document,
    DocumentCreateRequest,
    DocumentUpdateRequest,
    DocumentTemplate,
    PageResponse,
} from "../types";

export const getDocumentsByType = (

    typeId: number,
    page: number = 0,
    size: number = 20,
    keyword?: string
    // [추가] 이 함수가 최종적으로 반환하는 Promise의 구조를 명시
): Promise<{ data: PageResponse<Document> }> =>
    // [추가] <PageResponse<Document>>: 응답 data가 이 모양일 거라고 axios에 알려줌
    api.get<PageResponse<Document>>(`/api/documents/type/${typeId}`, {
        
        params: { page, size, keyword },
    });

export const getDocument = ( id: number ): Promise<{ data: Document }> =>
    api.get<Document>(`/api/documents/${id}`);

export const createDocument = (
    
    data: DocumentCreateRequest
): Promise<{ data: Document }> => api.post<Document>("/api/documents", data);

export const updateDocument = (

    id: number,
    data: DocumentUpdateRequest
): Promise<{ data: Document }> => api.put<Document>(`/api/documents/${id}`, data);

export const deleteDocument = ( id: number ): Promise<void> =>
    api.delete(`/api/documents/${id}`);

export const getTemplate = (
    
    typeId: number
): Promise<{ data: DocumentTemplate[] }> =>
    api.get<DocumentTemplate[]>(`/api/documents/type/${typeId}/template`);

export const searchDocuments = (
    
    keyword: string
): Promise<{ data: PageResponse<Document> }> =>
    api.get<PageResponse<Document>>("/api/documents/search", {

        params: { keyword, size: 10 },
    });