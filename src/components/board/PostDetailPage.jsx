import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPost, deletePost } from "../../api/postApi";
import CommentSection from "./CommentSection";

function PostDetailPage() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchPosts = async () => {
            
            try {
                
                const response = await getPost(id);
                setPost(response.data);
            } catch (err) {

                setError("게시글을 불러오는 데 실패했어요.");
            } finally {

                setLoading(false);
            }
        };
        fetchPosts();
    }, [id]);

    const handleDelete = async () => {

        if (!window.confirm("게시글을 삭제하시겠어요?")) return;
        try {

            await deletePost(id);
            navigate(-1);
        } catch (err) {

            setError("삭제에 실패했어요.");
        }
    };

    if (loading) return <p>불러오는 중...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!post) return null;

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
            <button onClick={() => navigate(-1)} style={{ marginBottom: "16px" }}>
                ← 뒤로가기
            </button>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <h1 style={{ margin: "0 0 8px 0" }}>{post.title}</h1>
                <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => navigate(`/board/posts/${id}/edit`)}>편집</button>
                    <button onClick={handleDelete} style={{ color: "red" }}>삭제</button>
                </div>
            </div>

            <p style={{ color: "#666", fontSize: "14px", marginBottom: "8px" }}>
                {post.author} | {new Date(post.createdAt).toLocaleDateString()} | 조회 {post.viewCount}
            </p>

            {post.taggedDocumentTitle && (

                <p
                    style={{ color: "#4a90e2", fontSize: "14px", cursor: "pointer", marginBottom: "16px" }}
                    onClick={() => navigate(`/wiki/documents/${post.taggedDocumentId}`)}
                >
                    관련 문서: #{post.taggedDocumentTitle}
                </p>
            )}

            <div style={{ borderTop: "1px solid #eee", paddingTop: "16px", lineHeight: "1.7" }}>
                {post.content}
            </div>

            <CommentSection postId={id} />
        </div>
    );
}

export default PostDetailPage;