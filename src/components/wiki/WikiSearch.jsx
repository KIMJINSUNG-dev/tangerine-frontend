import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { searchDocuments } from "../../api/documentApi";

function WikiSearch() {

    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef(null);

    // 외부 클릭 시 드롭다운 닫기
    useEffect(() => {

        const handleClickOutside = (e) => {

            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {

                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // 키워드 변경 시 검색
    useEffect(() => {

        if (!keyword.trim()) {

            setResults([]);
            setIsOpen(false);
            return;
        }

        const timer = setTimeout(async () => {

            try {

                setLoading(true);
                const response = await searchDocuments(keyword);
                setResults(response.data.content);
                setIsOpen(true);
            } catch (err) {

                console.error("검색 실패: ", err);
            } finally {

                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [keyword]);

    const handleSelect = (id) => {

        navigate(`/wiki/documents/${id}`);
        setKeyword("");
        setIsOpen(false);
    };

    return (

        <div ref={wrapperRef} className="relative w-full max-w-md">
            <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="문서 검색..."
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors"
            />

            {isOpen && (

                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-20 overflow-hidden">
                    {loading ? (
                        
                        <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                            검색 중...
                        </p>
                    ) : results.length === 0 ? (
                        
                        <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                            검색 결과가 없어요.
                        </p>
                    ) : (

                        results.map((doc) => (

                            <div
                                key={doc.id}
                                onClick={() => handleSelect(doc.id)}
                                className="px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0"
                            >
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {doc.title}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    {doc.typeName}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default WikiSearch;