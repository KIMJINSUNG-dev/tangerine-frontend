import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPost, deletePost } from "../../api/postApi";
import CommentSection from "../../components/board/CommentSection";
import { useAuth } from "../../context/AuthContext";

function PostDetailPage() {

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { isLoggedIn, userNickname, isAdmin } = useAuth();
    const postId = Number(id);

    const { data: post, isLoading, isError } = useQuery({

        queryKey: ["post", postId],
        queryFn: () => getPost(postId).then((res) => res.data),
    });

    const deleteMutation = useMutation({

        mutationFn: () => deletePost(postId),
        onSuccess: () => {

            queryClient.invalidateQueries({ queryKey: ["posts"]});
            navigate(-1);
        },
    });

    const handleDelete = () => {

        if (!window.confirm("게시글을 삭제하시겠어요?")) return;
        deleteMutation.mutate();
    };

    if (isLoading) {

        return <p className="text-center text-gray-500 dark:text-gray-400 py-20">불러오는 중...</p>;
    }

    if (isError || !post) {

        return <p className="text-center text-red-500 py-20">게시글을 불러오는 데 실패했어요.</p>;
    }

    const canEdit = isLoggedIn && (post.author === userNickname || isAdmin);

    return (

        <div className="max-w-3xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors mb-6"
            >
                ← 뒤로가기
            </button>

            <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-2xl font-bold">{post.title}</h1>
                {canEdit && (

                    <div className="flex gap-2 shrink-0">
                        <button
                            onClick={() => navigate(`/board/posts/${postId}/edit`)}
                            className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            편집
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-3 py-1.5 rounded-lg text-sm border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                        >
                            삭제
                        </button>
                    </div>
                )}
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {post.author} · {new Date(post.createdAt).toLocaleDateString()} · 조회 {post.viewCount}
            </p>

            {post.taggedDocumentTitle && (

                <div
                    onClick={() => navigate(`/wiki/documents/${post.taggedDocumentId}`)}
                    className="mb-6 px-4 py-3 rounded-lg border border-orange-200 dark:border-orange-900 text-sm text-orange-500 cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-950 transition-colors"
                >
                    관련 문서: {post.taggedDocumentTitle}
                </div>
            )}

            <div className="border-t border-gray-100 dark:border-gray-800 pt-6 text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                {post.content}
            </div>

            <CommentSection postId={postId} />
        </div>
    );
}

export default PostDetailPage;