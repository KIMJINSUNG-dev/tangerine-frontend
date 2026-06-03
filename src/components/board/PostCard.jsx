import { useNavigate } from "react-router-dom";

function PostCard({ post }) {

    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/board/posts/${post.id}`)}
            style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "12px",
                cursor: "pointer",
            }}    
        >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3 style={{ margin: "0 0 8px 0" }}>{post.title}</h3>
                <span style={{ fontSize: "14px", color: "#666" }}>
                    댓글 {post.commentCount}
                </span>
            </div>
            <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                {post.author} |{" "}
                {new Date(post.createdAt).toLocaleDateString()} |{" "}
                조회 {post.viewCount}
                {post.taggedDocumentTitle && (

                    <span style={{ marginLeft: "8px", color: "#4a90e2" }}>
                        #{post.taggedDocumentTitle}
                    </span>
                )}
            </p>
        </div>
    );
}

export default PostCard;