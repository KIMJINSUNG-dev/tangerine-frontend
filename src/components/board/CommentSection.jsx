import { useState, useEffect } from "react";
import { getComments, createComment, deleteComment } from "../../api/postApi";
import { useAuth } from "../../context/AuthContext";

function CommentSection({ postId }) {

    const { isAdmin, isLoggedIn, userNickname } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchComments = async () => {

            try {

                const response = await getComments(postId);
                setComments(response.data);
            } catch (err) {

                setError("댓글을 불러오는 데 실패했어요.");
            }
        };
        fetchComments();
    }, [postId]);

    const handleSubmit = async (e) => {

        e.preventDefault();
        if (!newComment.trim()) return;
        try {

            const response = await createComment(postId, newComment);
            setComments([...comments, response.data]);
            setNewComment("");
        } catch (err) {

            setError("댓글 작성에 실패했어요.");
        }
    };

    const handleDelete = async (commentId) => {

        if (!window.confirm("댓글을 삭제하시겠어요?")) return;
        try {

            await deleteComment(commentId);
            setComments(comments.filter((c) => c.id !== commentId));
        } catch (err) {

            setError("댓글 삭제에 실패했어요.");
        }
    };

    return (

        <div className="mt-10">
            <h3 className="text-base font-semibold mb-4">
                댓글 {comments.length}개
            </h3>

            {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

            <div className="flex flex-col">
                {comments.map((comment) => {

                    const canDelete = isAdmin || comment.author === userNickname;

                    return (

                        <div
                            key={comment.id}
                            className="py-4 border-b border-gray-100 dark:border-gray-800"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {comment.author}
                                </span>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-400 dark:text-gray-500">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>
                                    {canDelete && (

                                        <button
                                            onClick={() => handleDelete(comment.id)}
                                            className="text-xs text-red-400 hover:text-red-500 transition-colors"
                                        >
                                            삭제
                                        </button>
                                    )}
                                </div>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                {comment.content}
                            </p>
                        </div>
                    );
                })}

                {isLoggedIn && (

                    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="댓글을 입력하세요"
                            rows={3}
                            className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors"
                        />
                        <button
                            type="submit"
                            className="self-end px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors"
                        >
                            댓글 작성
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default CommentSection;