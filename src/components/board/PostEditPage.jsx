import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPost, updatePost } from "../../api/postApi";

function PostEditPage() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchPost = async () => {

            try {

                const response = await getPost(id);
                setTitle(response.data.title);
                setContent(response.data.content);
            } catch (err) {

                setError("문서를 불러오는 데 실패했어요.");
            } finally {

                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    const handleSubmit = async (e) => {

        e.preventDefault();
        try {

            await updatePost(id, { title, content });
            navigate(`/board/posts/${id}`);
        } catch (err) {

            setError("수정에 실패했어요.");
        }
    };

    if (loading) return <p>불러오는 중...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (

        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
            <button onClick={() => navigate(-1)} style={{ marginBottom: "16px" }}>
                ← 뒤로가기
            </button>

            <h1>글 수정</h1>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "16px" }}>
                    <label>제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ display: "block", marginTop: "4px", width: "100%" }}
                    />
                </div>

                <div style={{ marginBottom: "16px" }}>
                    <label>내용</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        rows={10}
                        style={{ display: "block", marginTop: "4px", width: "100%" }}
                    />
                </div>

                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit">저장</button>
            </form>
        </div>
    );
}

export default PostEditPage;