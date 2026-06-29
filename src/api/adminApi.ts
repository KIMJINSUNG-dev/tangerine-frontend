import api from "./axios";
import type { DocumentTemplate, DocumentTemplateRequest } from "../types";

export const createTemplate = (

    data: DocumentTemplateRequest
): Promise<{ data: DocumentTemplate }> =>
    api.post<DocumentTemplate>("/api/admin/templates", data);

export const deleteTemplate = ( id: number ): Promise<void> =>
    api.delete(`/api/admin/templates/${id}`);