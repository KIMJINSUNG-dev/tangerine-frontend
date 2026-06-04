import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDocument, deleteDocument } from "../../api/documentApi";
import DocumentFieldView from "../../components/wiki/DocumentFieldView";
import { useAuth } from "../../hooks/useAuth";

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

    if (loading) return <p>불러오는 중...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!document) return null;

    return (

        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
            <button onClick={() => navigate(-1)} style={{ marginBottom: "16px" }}>
                ← 뒤로가기
            </button>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1 style={{ margin: "0 0 8px 0" }}>{document.title}</h1>
                <div style={{ display: "flex", gap: "8px" }}>
                    {isLoggedIn && (

                        <button onClick={() => navigate(`/wiki/documents/${id}/edit`)}>
                            편집
                        </button>
                    )}
                    {isAdmin && (

                        <button onClick={handleDelete} style={{ color: "red" }}>
                            삭제
                        </button>
                    )}
                </div>
            </div>

            <p style={{ color: "#666", fontSize: "14px", marginBottom: "24px" }}>
                유형: {document.typeName} | 작성자: {document.createBy} |
                작성일: {new Date(document.createdAt).toLocaleDateString()}
            </p>

            <DocumentFieldView fields={document.fields} />
        </div>
    );
}

export default DocumentDetailPage;