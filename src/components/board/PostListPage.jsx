import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPosts } from "../../api/postApi";
import PostCard from "./PostCard";
import { useAuth } from "../../context/AuthContext";

function PostListPage() {

    const { boardType } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const [posts, setPosts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const boardTypeLabel = {

        FREE: "자유 게시판",
        NOTICE: "공지 사항",
    };

    useEffect(() => {

        const fetchPosts = async () => {

            try {

                setLoading(true);
                const response = await getPosts(

                    boardType.toUpperCase(),
                    currentPage,
                    20,
                    keyword || null
                );
                setPosts(response.data.content);
                setTotalPages(response.data.totalPages);
            } catch (err) {

                setError("게시글을 불러오는 데 실패했어요.");
            } finally {

                setLoading(false);
            }
        };
        fetchPosts();
    }, [boardType, currentPage, keyword]);

    const handleSearch = (e) => {

        e.preventDefault();
        setKeyword(searchInput);
        setCurrentPage(0);
    };

    if (loading) return (
        
        <p className="text-center text-gray-500 dark:text-gray-400 py-20">
            불러오는 중...
        </p>
    );
    if (error) return (
        
        <p className="text-center text-red-500 py-20">{error}</p>
    );

    return (

        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">
                    {boardTypeLabel[boardType.toUpperCase()] || boardType}
                </h1>
                <div className="flex gap-1 mb-6 border-b border-gray-200 dark:border-gray-800">
                    {[
                        { key: "free", label: "자유 게시판" },
                        { key: "notice", label: "공지사항" },
                    ].map((board) => (
                        
                        <button
                            key={board.key}
                            onClick={() => navigate(`/board/${board.key}`)}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                boardType === board.key
                                    ? "border-orange-500 text-orange-500"
                                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            }`}
                        >
                            {board.label}
                        </button>
                    ))}
                </div>
                { isLoggedIn && (

                    <button
                        onClick={() => navigate(`/board/posts/new?boardType=${boardType}`)}
                        className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors"
                    >
                        글 작성
                    </button>
                )}
            </div>

            <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="제목으로 검색"
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors"
                />
                <button
                    type="submit"
                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    검색
                </button>
            </form>

            {posts.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-20">
                    게시글이 없어요.
                </p>
            ) : (
                <div className="flex flex-col gap-3">
                    {posts.map((post) => (
                    
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i)}
                            className={`w-8 h-8 rounded-lg text-sm transition-colors ${
                                currentPage === i
                                    ? "bg-orange-500 text-white"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PostListPage;