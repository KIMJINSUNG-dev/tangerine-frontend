import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { createPost } from "../../api/postApi";
import type { PostCreateRequest } from "../../types";
import { useAuth } from "../../context/AuthContext";

function PostCreatePage() {

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { isAdmin } = useAuth();

    /**
     * [설명] useSearchParams
     * URL의 쿼리 파라미터를 읽어오는 React Router Hook이에요.
     * /board/posts/new?boardType=free 같은 URL에서
     * searchParams.get("boardType")으로 "free"를 꺼내요.
     */
    const [searchParams] = useSearchParams();
    const boardTypeFromUrl = searchParams.get("boardType") ?? "free";

    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [boardType, setBoardType] = useState<string>(boardTypeFromUrl);

    const createMutation = useMutation({

        mutationFn: (data: PostCreateRequest) => createPost(data),
        onSuccess: (response) => {

            queryClient.invalidateQueries({ queryKey: ["posts"] });
            navigate(`/board/posts/${response.data.id}`);
        },
    });

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {

        e.preventDefault();
        createMutation.mutate({

            boardType: boardType.toUpperCase(),
            title,
            content,
            taggedDocumentId: null,
        });
    };

    useEffect(() => {

        if (boardTypeFromUrl === "notice" && !isAdmin) {

            navigate("/board/posts/new?boardType=free", { replace: true });
        }
    }, [boardTypeFromUrl, isAdmin, navigate])

    const inputClass = "px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors";

    return (

        <div className="max-w-3xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors mb-6"
            >
                ← 뒤로가기
            </button>

            <h1 className="text-2xl font-bold mb-8">글 작성</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* 관리자만 공지사항으로 게시판 유형 변경 가능 */}
                {isAdmin && (
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            게시판
                        </label>
                        <select
                            value={boardType}
                            onChange={(e) => setBoardType(e.target.value)}
                            className={inputClass}
                        >
                            <option value="free">자유 게시판</option>
                            <option value="notice">공지사항</option>
                        </select>
                    </div>
                )}

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className={inputClass}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">내용</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={12}
                        className={`${inputClass} resize-none`}
                    />
                </div>

                {createMutation.error && (

                    <p className="text-sm text-red-500">
                        {(createMutation.error as AxiosError<string>).response?.data ||
                            "게시글 작성에 실패했어요."}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 disabled:opacity-50 transition-colors"
                >
                    저장
                </button>
            </form>
        </div>
    );
}

export default PostCreatePage;