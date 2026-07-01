import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../../api/postApi";
import PostCard from "../../components/board/PostCard";
import { useAuth } from "../../context/AuthContext";

const boardTypeLabel: Record<string, string> = {

    free: "자유 게시판",
    notice: "공지사항",
};

const boardTabs = [

    { key: "free", label: "자유 게시판" },
    { key: "notice", label: "공지사항" },
];

function PostListPage() {

    const { boardType } = useParams<{ boardType: string }>();
    const navigate = useNavigate();
    const { isLoggedIn, isAdmin } = useAuth();
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [searchInput, setSearchInput] = useState<string>("");
    const [appliedKeyword, setAppliedKeyword] = useState<string>("");

    const { data, isLoading, isError } = useQuery({

        queryKey: ["posts", boardType, currentPage, appliedKeyword],
        queryFn: () =>
            getPosts(

                (boardType ?? "free").toUpperCase(),
                currentPage,
                20,
                appliedKeyword || null
            ).then((res) => res.data),
    });

    const handleSearch = (e: React.SubmitEvent<HTMLFormElement>) => {

        e.preventDefault();
        setAppliedKeyword(searchInput);
        setCurrentPage(0);
    };

    const handleTabChange = (key: string) => {

        navigate(`/board/${key}`);
        setCurrentPage(0);
        setSearchInput("");
        setAppliedKeyword("");
    };

    if (isLoading) {

        return <p className="text-center text-gray-500 dark:text-gray-400 py-20">불러오는 중...</p>;
    }

    if (isError || !data) {

        return <p className="text-center text-red-500 py-20">게시글을 불러오는 데 실패했어요.</p>
    }

    return (

        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">
                    {boardTypeLabel[boardType ?? "free"] || "게시판"}
                </h1>
                {isLoggedIn && (boardType !== "notice" || isAdmin) && (
                    <button
                        onClick={() => navigate(`/board/posts/new?boardType=${boardType}`)}
                        className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors"
                    >
                        글 작성
                    </button>
                )}
            </div>

            {/* 게시판 탭 */}
            <div className="flex gap-1 mb-6 border-b border-gray-200 dark:border-gray-800">
                {boardTabs.map((tab) => (

                    <button
                        key={tab.key}
                        onClick={() => handleTabChange(tab.key)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${

                            boardType === tab.key
                                ? "border-orange-500 text-orange-500"
                                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
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

            {data.content.length === 0 ? (

                <p className="text-center text-gray-500 dark:text-gray-400 py-20">
                    {appliedKeyword ? "검색 결과가 없어요." : "게시글이 없어요."}
                </p>
            ) : (

                <div className="flex flex-col gap-3">
                    {data.content.map((post) => (

                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            )}

            {data.totalPages > 1 && (

                <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: data.totalPages }, (_, i) => (

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