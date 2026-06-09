import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDocument, deleteDocument } from "../../api/documentApi";
import DocumentFieldView from "../../components/wiki/DocumentFieldView";
import { useAuth } from "../../context/AuthContext";

function DocumentDetailPage() {

    const { id } = useParams();
    const navigate = useNavigate();
    const { isAdmin, isLoggedIn } = useAuth();
    const [document, setDocuments] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchDocuments = async () => {

            try {

                const response = await getDocument(id);
                setDocuments(response.data);
            } catch (err) {

                setError("문서를 불러오는 데 실패했어요.");
            } finally {

                setLoading(false);
            }
        };

        fetchDocuments();
    }, [id]);

    const handleDelete = async () => {

        if (!window.confirm("정말 삭제하시겠어요?")) return;
        try {

            await deleteDocument(id);
            navigate(-1);
        } catch (err) {

            setError("삭제에 실패했어요.");
        }
    };

    if (loading) return (

        <p className="text-center text-gray-500 dark:text-gray-400 py-20">
            불러오는 중...
        </p>
    );
    if (error) return (
    
        <p className="text-center text-red-500 py-20">{error}</p>
    );
    if (!document) return null;

    return (

        <div className="max-w-3xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors mb-6 flex items-center gap-1"
            >
                ← 뒤로가기
            </button>

            <div className="flex items-start justify-between mb-2">
                <h1 className="text-2xl font-bold">{document.title}</h1>
                <div className="flex gap-2">
                    {isLoggedIn && (

                        <button
                            onClick={() => navigate(`/wiki/documents/${id}/edit`)}
                            className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            편집
                        </button>
                    )}
                    {isAdmin && (

                        <button
                            onClick={handleDelete}
                            className="px-3 py-1.5 rounded-lg text-sm border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
                            삭제
                        </button>
                    )}
                </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                유형: {document.typeName} | 작성자: {document.createBy} |
                작성일: {new Date(document.createdAt).toLocaleDateString()}
            </p>

            <DocumentFieldView fields={document.fields} />
        </div>
    );
}

export default DocumentDetailPage;