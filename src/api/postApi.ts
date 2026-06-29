import api from "./axios";
import type {

    Post,
    Comment,
    PostCreateRequest,
    PostUpdateRequest,
    PageResponse,
} from "../types";

export const getPosts = (

    boardType: string,
    page: number = 0,
    size: number = 20,
    keyword: string | null = null
): Promise<{ data: PageResponse<Post> }> => {

    // [추가] params 객체의 타입을 명시. keyword는 있을 수도 없을 수도 있어서
    // Record<string, string | number>로 느슨하게 잡아요.
    const params: Record<string, string | number> = { boardType, page, size };
    if (keyword) params.keyword = keyword;
    return api.get<PageResponse<Post>>("/api/posts", { params });
};

export const getPost = ( id: number ): Promise<{ data: Post }> =>
    api.get<Post>(`/api/posts/${id}`);

export const createPost = ( data: PostCreateRequest ): Promise<{ data: Post }> =>
    api.post<Post>("/api/posts", data);

export const updatePost = (

    id: number,
    data: PostUpdateRequest
): Promise<{ data: Post }> =>
    api.put<Post>(`/api/posts/${id}`, data);

export const deletePost = ( id: number ): Promise<void> =>
    api.delete(`/api/posts/${id}`);

export const getComments = ( postId: number ): Promise<{ data: Comment[] }> =>
    api.get<Comment[]>(`/api/posts/${postId}/comments`);

export const createComment = (
    
    postId: number,
    content: string
): Promise<{ data: Comment }> =>
    api.post<Comment>(`/api/posts/${postId}/comments`, content, {

        headers: { "Content-Type": "text/plain" },
    });

export const updateComment = (

    commentId: number,
    content: string
): Promise<{ data: Comment }> =>
    api.put<Comment>(`/api/posts/comments/${commentId}`, content, {

        headers: { "Content-Type": "text/plain" },
    });

export const deleteComment = ( commentId: number ): Promise<void> =>
    api.delete(`/api/posts/comments/${commentId}`);