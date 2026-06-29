import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDocumentsByType } from "../../api/documentApi";
import DocumentCard from "../../components/wiki/DocumentCard";
import WikiSearch from "../../components/wiki/WikiSearch";
import { useAuth } from "../../context/AuthContext";

const typeLabel: Record<string, string> = { "1": "수록곡", "2": "작곡가", "3": "게임 타이틀" };

function DocumentListPage() {
    
    const { typeId } = useParams<{typeId: string}>();
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const [currentPage, setCurrentPage] = useState<number>(0);

    const [searchInput, setSearchInput] = useState<string>("");
    const [appliedKeyword, setAppliedKeyword] = useState<string>("");

    const numericTypeId = Number(typeId);

    const { data, isLoading, isError } = useQuery({

        queryKey: ["documents", numericTypeId, currentPage, appliedKeyword],
        queryFn: () =>
            getDocumentsByType(numericTypeId, currentPage, 20, appliedKeyword || undefined).then(
                (res) => res.data
            ),
    });

    const handleSearch = (e: React.SubmitEvent<HTMLFormElement>) => {

        e.preventDefault();
        setAppliedKeyword(searchInput);
        setCurrentPage(0);
    };

    if (isLoading) {

        return <p className="text-center text-gray-500 dark:text-gray-400 py-20">불러오는 중...</p>;
    };
    if (isError || !data) {

        return <p className="text-center text-red-500 py-20">문서 목록을 불러오는 데 실패했어요.</p>;
    };

    return (
        
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">{typeLabel[typeId ?? ""] || "문서 목록"}</h1>
                {isLoggedIn && (

                    <button
                        onClick={() => navigate("/wiki/documents/new")}
                        className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors"
                    >
                        새 문서 작성
                    </button>
                )}

                <div className="mb-6">
                    <WikiSearch />
                </div>
            </div>

            <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="이 유형 안에서 제목으로 검색"
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
                    {appliedKeyword ? "검색 결과가 없어요." : "문서가 없어요."}
                </p>
            ) : (
                <div className="flex flex-col gap-3">
                    {data.content.map(doc => (
                      
                        <DocumentCard key={doc.id} document={doc} />
                    ))}
                </div>
            )}

            {data.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: data.totalPages }, (_, i) => (

                        <button
                            key={i}
                            onClick={() => setCurrentPage(i)}
                            className={`w-8 rounded-lg text-sm transition-colors ${
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

export default DocumentListPage;