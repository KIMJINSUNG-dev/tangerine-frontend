import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createPost } from "../../api/postApi";
import { useAuth } from "../../context/AuthContext";

function PostCreatePage() {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const defaultBoardType = searchParams.get("boardType")?.toUpperCase() || "FREE";
    const { isAdmin } = useAuth();

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

    const inputClass = "px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors";

    return (
        <div className="max-w-3xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors mb-6"
            >
                ← 뒤로가기
            </button>

            <h1 className="text-2xl font-bold mb-8">글 작성</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        게시판
                    </label>
                    <select
                        value={boardType}
                        onChange={(e) => setBoardType(e.target.value)}
                        className={inputClass}
                    >
                        <option value="FREE">자유 게시판</option>
                        {isAdmin && <option value="NOTICE">공지사항</option>}
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        제목
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className={inputClass}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        내용
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        rows={10}
                        className={`${inputClass} resize-none`}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        관련 문서 ID
                        <span className="ml-1 text-gray-400 font-normal">(선택)</span>
                    </label>
                    <input
                        type="number"
                        value={taggedDocumentId}
                        onChange={(e) => setTaggedDocumentId(e.target.value)}
                        placeholder="위키 문서 ID를 입력하세요"
                        className={inputClass}
                    />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}
                <button
                    type="submit"
                    className="py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors"
                >
                    저장
                </button>
            </form>
        </div>
    );
}

export default PostCreatePage;