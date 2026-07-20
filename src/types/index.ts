/**
 * [추가] Tangerine 전체에서 공통으로 쓰는 타입 정의 파일이에요.
 * 백엔드의 각 DTO(Request/Response 클래스)와 1:1로 맞춰서 작성했어요.
 * 이렇게 하면 "백엔드가 보내는 JSON 구조"와 "프론트엔드가 다루는 타입"이
 * 항상 일치한다는 걸 컴파일 단계에서 보장받을 수 있어요.
 */

// ===== 인증 관련 =====

// UserController.login()의 응답과 대응돼요
export interface LoginResponse {

    accessToken: string;
    refreshToken: string;
    nickname: string;
    role: string;
}

export interface SignupRequest {

    email: string;
    password: string;
    nickname: string;
}

export interface LoginRequest {

    email: string;
    password: string;
}

// AuthContext가 내부적으로 관리하는 상태 구조예요
export interface AuthState {

    accessToken: string | null;
    userRole: string | null;
    userNickname: string | null;
}

// ===== 위키 (Document) 관련 =====

// DocumentResponse.java와 대응돼요
export interface Document {

    id: number;
    typeId: number;
    typeName: string;
    title: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    // [설명] EAV 패턴 특성상 필드가 고정되어 있지 않아서
    // "키와 값 모두 문자열인 객체"라는 형태로만 표현할 수 있어요.
    // (Record<K, V>는 "키 타입이 K, 값 타입이 V인 객체"를 뜻하는 유틸리티 타입이에요)
    fields: Record<string, string>;
}

export interface DocumentCreateRequest {

    typeId: number;
    title: string;
    fields: Record<string, string>;
}

export interface DocumentUpdateRequest {

    title: string;
    fields: Record<string, string>;
}

// DocumentTemplateResponse.java와 대응돼요
export interface DocumentTemplate {

    id: number;
    fieldKey: string;
    fieldName: string;
    // [설명] 백엔드 Enum(TEXT/NUMBER/DATE/BOOLEAN/REFERENCE)이 JSON으로 올 때는
    // 결국 문자열이라서, 굳이 TypeScript의 리터럴 유니온 타입으로
    // 세분화하지 않고 string으로 단순화했어요. (필요하면 나중에
    // "TEXT" | "NUMBER" | "DATE" | "BOOLEAN" | "REFERENCE" 로 좁힐 수 있어요)
    fieldType: string;
    required: boolean;
    displayOrder: number;
}

export interface DocumentTemplateRequest {

    typeId: number;
    fieldKey: string;
    fieldName: string;
    fieldType: string;
    required: boolean;
    displayOrder: number;
}

export interface DocumentType {

    id: number;
    name: string;
    description: string;
}

// ===== 게시판 (Post/Comment) 관련 =====

// PostResponse.java와 대응돼요
export interface Post {

    id: number;
    boardType: string;
    title: string;
    content: string;
    author: string;
    taggedDocumentId: number | null;
    taggedDocumentTitle: string | null;
    createdAt: string;
    updatedAt: string;
    viewCount: number;
    commentCount: number;
}

export interface PostCreateRequest {

    boardType: string;
    title: string;
    content: string;
    taggedDocumentId: number | null;
}

export interface PostUpdateRequest {

    title: string;
    content: string;
}

// CommentResponse.java와 대응돼요
export interface Comment {

    id: number;
    author: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

// ===== 공통 =====

/**
 * [설명] Spring의 Page<T> 객체가 JSON으로 변환됐을 때의 구조예요.
 * Pebble에서 썼던 PageResponse<T>와 똑같은 제네릭 타입이에요.
 * 실제 Spring Page 객체엔 더 많은 필드(first, last, empty 등)가 있지만
 * 지금 화면에서 실제로 쓰는 것만 우선 정의했어요. 나중에 필요한 필드가
 * 생기면 여기에 추가하면 돼요.
 */
export interface PageResponse<T> {

    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}