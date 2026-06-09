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

    const inputClass = "px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors";

    if (loading) return (
    
        <p className="text-center text-gray-500 dark:text-gray-400 py-20">
            불러오는 중...
        </p>
    );
    if (error) return (
    
        <p className="text-center text-red-500 py-20">{error}</p>
    );

    return (

        <div className="max-w-3xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors mb-6"
            >
                ← 뒤로가기
            </button>

            <h1 className="text-2xl font-bold mb-8">글 수정</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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

export default PostEditPage;