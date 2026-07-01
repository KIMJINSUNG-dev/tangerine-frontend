import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { getPost, updatePost } from "../../api/postApi";
import type { PostUpdateRequest } from "../../types";

function PostEditPage() {

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const postId = Number(id);

    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");

    const { data: post, isLoading } = useQuery({

        queryKey: ["post", postId],
        queryFn: () => getPost(postId).then((res) => res.data),
    });

    // [설명] DocumentEditPage에서 썼던 것과 완전히 동일한 패턴이에요.
    // 비동기로 받아온 post 데이터가 도착하면 폼 초기값을 채워요.
    useEffect(() => {

        if (post) {

            setTitle(post.title);
            setContent(post.content);
        }
    }, [post]);

    const updateMutation = useMutation({

        mutationFn: (data: PostUpdateRequest) => updatePost(postId, data),
        onSuccess: () => {

            queryClient.invalidateQueries({ queryKey: ["post", postId] });
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            navigate(`/board/posts/${postId}`);
        }
    });

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {

        e.preventDefault();
        updateMutation.mutate({ title, content });
    };

    const inputClass = "px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors";

    if (isLoading) {

        return <p className="text-center text-gray-500 dark:text-gray-400 py-20">불러오는 중...</p>;
    }

    return (

        <div className="max-w-3xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors mb-6"
            >
                ← 뒤로가기
            </button>

            <h1 className="text-2xl font-bold mb-8">글 편집</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

                {updateMutation.error && (

                    <p className="text-sm text-red-500">
                        {(updateMutation.error as AxiosError<string>).response?.data ||
                            "게시글 수정에 실패했어요."}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 disabled:opacity-50 transition-colors"
                >
                    저장
                </button>
            </form>
        </div>
    );
}

export default PostEditPage;