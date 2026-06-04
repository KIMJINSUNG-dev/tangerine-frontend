import { useState, useEffect } from "react";
import { getComments, createComment, deleteComment } from "../../api/postApi";
import { useAuth } from "../../hooks/useAuth";

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

        <div style={{ marginTop: "32px" }}>
            <h3>댓글 {comments.length}개</h3>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {comments.map((comment) => {

                const canDelete = isAdmin || comment.author === userNickname;

                return (

                    <div
                        key={comment.id}
                        style={{
                            borderBottom: "1px solid #eee",
                            padding: "12px 0",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontWeight: "500" }}>{comment.author}</span>
                            <div style={{ display: "flex", gap: "8px", fontSize: "14px" }}>
                                <span style={{ color: "#666" }}>
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                                {canDelete && (

                                    <button
                                        onClick={() => handleDelete(comment.id)}
                                        style={{ color: "red", border: "none", background: "none", cursor: "pointer" }}
                                    >
                                        삭제
                                    </button>
                                )}
                            </div>
                        </div>
                        <p style={{ margin: "8px 0 0 0" }}>{comment.content}</p>
                    </div>
                );
            })}

            {isLoggedIn && (

                <form onSubmit={handleSubmit} style={{ marginTop: "16px" }}>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="댓글을 입력하세요"
                        rows={3}
                        style={{ width: "100%", marginBottom: "8px" }}
                    />
                    <button type="submit">댓글 작성</button>
                </form>
            )}
        </div>
    );
}

export default CommentSection;