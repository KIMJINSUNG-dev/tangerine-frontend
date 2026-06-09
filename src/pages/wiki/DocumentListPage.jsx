import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDocumentsByType } from "../../api/documentApi";
import DocumentCard from "../../components/wiki/DocumentCard";
import { useAuth } from "../../context/AuthContext";

function DocumentListPage() {

    const { typeId } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const [documents, setDocuments] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const typeLabel = { 1: "수록곡", 2: "작곡가", 3: "게임 타이틀" };

    useEffect(() => {

        const fetchDocuments = async () => {

            try {

                setLoading(true);
                const response = await getDocumentsByType(typeId, currentPage);
                setDocuments(response.data.content);
                setTotalPages(response.data.totalPages);
            } catch (err) {

                setError("문서 목록을 불러오는 데 실패했어요.");
            } finally {

                setLoading(false);
            }
        };

        fetchDocuments();
    }, [typeId, currentPage]);

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
                    {typeLabel[typeId] || "문서 목록"}
                </h1>
                {isLoggedIn && (

                    <button
                        onClick={() => navigate("/wiki/documents/new")}
                        className="px-4 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors"
                    >
                        새 문서 작성
                    </button>
                )}
            </div>

            {documents.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-20">
                    문서가 없어요.
                </p>
            ) : (
                <div className="flex flex-col gap-3">
                    {documents.map(doc => (
                      
                        <DocumentCard key={doc.id} document={doc} />
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: totalPages }, (_, i) => (

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