import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createPost } from "../../api/postApi";

function PostCreatePage() {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const defaultBoardType = searchParams.get("boardType")?.toUpperCase() || "FREE";

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [boardType, setBoardType] = useState(defaultBoardType);
    const [taggedDocumentId, setTaggedDocumentId] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();
        setError("");
        try {

            const response = await createPost({

                boardType,
                title,
                content,
                taggedDocumentId: taggedDocumentId ? Number(taggedDocumentId) : null,
            });
            navigate(`/board/posts/${response.data.id}`);
        } catch (err) {

            setError("게시글 작성에 실패했어요.");
        }
    };

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
            <button onClick={() => navigate(-1)} style={{ marginBottom: "16px" }}>
                ← 뒤로가기
            </button>

            <h1>글 작성</h1>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "16px" }}>
                    <label>게시판</label>
                    <select
                        value={boardType}
                        onChange={(e) => setBoardType(e.target.value)}
                        style={{ display: "block", marginTop: "4px" }}
                    >
                        <option value="FREE">자유 게시판</option>
                        <option value="NOTICE">공지사항</option>
                    </select>
                </div>

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

                <div style={{ marginBottom: "16px" }}>
                    <label>관련 문서 ID (선택)</label>
                    <input
                        type="number"
                        value={taggedDocumentId}
                        onChange={(e) => setTaggedDocumentId(e.target.value)}
                        placeholder="위키 문서 ID를 입력하세요"
                        style={{ display: "block", marginTop: "4px" }}
                    />
                </div>

                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit">저장</button>
            </form>
        </div>
    );
}

export default PostCreatePage;