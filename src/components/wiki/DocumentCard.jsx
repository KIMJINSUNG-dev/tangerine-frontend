import { useNavigate } from "react-router-dom";

function DocumentCard({ document }) {

    const navigate = useNavigate();
    return (

        <div
            onClick={() => navigate(`/wiki/documents/${document.id}`)}
            style={{

                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "12px",
                cursor: "pointer",
            }}
        >
            <h3 style={{ margin: "0 0 8px 0" }}>{document.title}</h3>
            <p style={{ margin: "0", color: "#666", fontSize: "14px"}}>
                유형: {document.typeName} | 작성자: {document.createdBy}
            </p>
        </div>
    );
}

export default DocumentCard;