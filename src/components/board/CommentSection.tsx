import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import {

    getComments,
    createComment,
    updateComment,
    deleteComment,
} from "../../api/postApi";
import { useAuth } from "../../context/AuthContext";
import type { Comment } from "../../types";

interface CommentSectionProps {

    postId: number;
}

function CommentSection({ postId }: CommentSectionProps) {

    const queryClient = useQueryClient();
    const { isLoggedIn, userNickname, isAdmin } = useAuth();

    const [newContent, setNewContent] = useState<string>("");

    // [설명] 댓글 목록을 별도 queryKey로 관리해요.
    // PostDetailPage에서 게시글을 가져오는 쿼리와 분리되어 있어서,
    // 댓글만 invalidate할 때 게시글 데이터를 다시 요청하지 않아요.
    const { data: comments = [], isLoading } = useQuery({

        queryKey: ["comments", postId],
        queryFn: () => getComments(postId).then((res) => res.data),
    });

    const createMutation = useMutation({

        mutationFn: (content: string) => createComment(postId, content),
        onSuccess: () => {

            queryClient.invalidateQueries({ queryKey: ["comments", postId] });
            setNewContent("");
        },
    });

    const deleteMutation = useMutation({

        mutationFn: (commentId: number) => deleteComment(commentId),
        onSuccess: () => {

            queryClient.invalidateQueries({ queryKey: ["comments", postId] });
        },
    });

    // [설명] 수정 중인 댓글의 id와 내용을 로컬 state로 관리해요.
    // null이면 수정 중이 아닌 상태예요.
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingContent, setEditingContent] = useState<string>("");

    const updateMutation = useMutation({

        mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
            updateComment(commentId, content),
        onSuccess: () => {

            queryClient.invalidateQueries({ queryKey: ["comments", postId] });
            setEditingId(null);
            setEditingContent("");
        },
    });

    const handleCreate = (e: React.SubmitEvent<HTMLFormElement>) => {

        e.preventDefault();
        if (!newContent.trim()) return;
        createMutation.mutate(newContent);
    }

    const handleEditStart = (comment: Comment) => {

        setEditingId(comment.id);
        setEditingContent(comment.content);
    }

    const handleEditSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {

        e.preventDefault();
        if (!editingContent.trim() || editingId === null) return;
        updateMutation.mutate({ commentId: editingId, content: editingContent });
    };

    const handleDelete = (commentId: number) => {

        if (!window.confirm("댓글을 삭제하시겠어요?")) return;
        deleteMutation.mutate(commentId);
    };

    if (isLoading) {

        return <p className="text-sm text-gray-500 dark:text-gray-400">댓글 불러오는 중...</p>;
    }

    return (

        <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">
                댓글 {comments.length > 0 && `(${comments.length})`}
            </h2>

            {/* 댓글 목록 */}
            {comments.length === 0 ? (
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">첫 댓글을 남겨보세요.</p>
            ) : (

                <div className="flex flex-col gap-4 mb-6">
                    {comments.map((comment) => (

                        <div
                            key={comment.id}
                            className="border border-gray-200 dark:border-gray-800 rounded-xl p-4"
                        >
                            {editingId === comment.id ? (
                                
                                // 수정 폼
                                <form onSubmit={handleEditSubmit} className="flex flex-col gap-2">
                                    <textarea
                                        value={editingContent}
                                        onChange={(e) => setEditingContent(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    />
                                    <div className="flex gap-2 justify-end">
                                        <button
                                            type="button"
                                            onClick={() => setEditingId(null)}
                                            className="px-3 py-1.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            취소
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={updateMutation.isPending}
                                            className="px-3 py-1.5 rounded-lg text-sm bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 transition-colors"
                                        >
                                            저장
                                        </button>
                                    </div>
                                </form>
                            ) : (

                                <>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {comment.author}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                                {new Date(comment.createdAt).toLocaleDateString()}
                                            </span>
                                            {/* 본인 댓글이거나 관리자면 편집/삭제 버튼 표시 */}
                                            {isLoggedIn && (comment.author === userNickname || isAdmin) && (

                                                <div className="flex gap-2">
                                                    {comment.author === userNickname && (

                                                        <button
                                                            onClick={() => handleEditStart(comment)}
                                                            className="text-xs text-gray-500 dark:text-gray-400 hover:text-orange-500 transition-colors"
                                                        >
                                                            편집
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(comment.id)}
                                                        className="text-xs text-red-400 hover:text-red-500 transition-colors"
                                                    >
                                                        삭제
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* [설명] whitespace-pre-wrap: 줄바꿈과 공백을 그대로 유지해요 */}
                                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                        {comment.content}
                                    </p>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* 댓글 작성 폼 */}
            {isLoggedIn ? (

                <form onSubmit={handleCreate} className="flex flex-col gap-2">
                    <textarea
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        placeholder="댓글을 입력하세요."
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors"
                    />
                    {createMutation.error && (

                        <p className="text-xs text-red-500">
                            {(createMutation.error as AxiosError<string>).response?.data || "댓글 작성에 실패했어요."}
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={createMutation.isPending}
                        className="self-end px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 disabled:opacity-50 transition-colors"
                    >
                        댓글 작성
                    </button>
                </form>
            ) : (

                <p className="text-sm text-gray-500 dark:text-gray-400">
                    댓글을 작성하려면 로그인이 필요해요.
                </p>
            )}
        </div>
    );
}

export default CommentSection;