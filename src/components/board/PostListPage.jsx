import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPosts } from "../../api/postApi";
import PostCard from "./PostCard";

function PostListPage() {

    const { boardType } = useParams();
    const navigate = useNavigate();
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

        e.preventdefault();
        setKeyword(searchInput);
        setCurrentPage(0);
    };

    if (loading) return <p>불러오는 중...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (

        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h1 style={{ margin: 0 }}>{boardTypeLabel[boardType.toUpperCase()] || boardType}</h1>
                <button onClick={() => navigate(`/board/posts/new?boardType=${boardType}`)}>
                    글 작성
                </button>
            </div>

            <form onSubmit={handleSearch} style={{ marginBottom: "16px", display: "flex", gap: "8px" }}>
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="제목으로 검색"
                    style={{ flex: 1 }}
                />
                <button type="submit">검색</button>
            </form>

            {posts.length === 0 ? (
                <p>게시글이 없어요.</p>
            ) : (
                posts.map((post) => <PostCard key={post.id} post={post} />)
            )}

            {totalPages > 1 && (
                <div style={{ display: "flex", gap: "8px", marginTop: "24px" }}>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i)}
                            style={{
                                fontWeight: currentPage === i ? "bold" : "normal",
                                textDecoration: currentPage === i ? "underline" : "none",
                            }}
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