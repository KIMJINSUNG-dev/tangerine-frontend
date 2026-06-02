import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDocumentsByType } from "../../api/documentApi";
import DocumentCard from "../../components/wiki/DocumentCard";

function DocumentListPage() {

    const { typeId } = useParams();
    const navigate = useNavigate();
    const [documents, setDocuments] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    if (loading) return <p>불러오는 중...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h1 style={{ margin: 0 }}>문서 목록</h1>
                <button onClick={() => navigate("/wiki/documents/new")}>
                    새 문서 작성
                </button>
            </div>

            {documents.length === 0 ? (
                <p>문서가 없어요.</p>
            ) : (
                documents.map(doc => (
                    <DocumentCard key={doc.id} document={doc} />
                ))
            )}

            {totalPages > 1 && (
                <div style={{ display: "flex", gap: "8px", marginTop: "24px" }}>
                    {Array.from({ length: totalPages }, (_, i) => (

                        <button
                            key={i}
                            onClick={() => setCurrentPage(i)}
                            style={{
                                fontWeight: currentPage === i ? "bold" : "normal",
                                textDecoration: currentPage === i ? "underline" : "none"
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

export default DocumentListPage;