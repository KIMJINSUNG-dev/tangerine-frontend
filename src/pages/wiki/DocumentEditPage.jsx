import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDocument, updateDocument } from "../../api/documentApi";

function DocumentEditPage() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [fieldInputs, setFieldInputs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchDocuments = async () => {

            try {

                const response = await getDocument(id);
                const doc = response.data;
                setTitle(doc.title);
                setFieldInputs(
                    Object.entries(doc.fields).map(([key, value]) => ({ key, value }))
                );
            } catch {

                setError("문서를 불러오는 데 실패했어요.");
            } finally {

                setLoading(false);
            }
        };

        fetchDocuments();
    }, [id]);

    const handleFieldChange = (index, type, value) => {

        const updated = [...fieldInputs];
        updated[index][type] = value;
        setFieldInputs(updated);
    };

    const handleAddField = () => {

        setFieldInputs([...fieldInputs, { key: "", value: "" }]);
    };

    const handelRemoveField = (index) => {

        setFieldInputs(fieldInputs.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setError("");

        const fields = {};
        fieldInputs.forEach(({ key, value }) => {

            if (key.trim()) fields[key.trim()] = value;
        });

        try {

            await updateDocument(id, { title, fields });
            navigate(`/wiki/documents/${id}`);
        } catch (err) {

            setError("문서 수정에 실패했어요.");
        }
    };

    if (loading) return <p>불러오는 중...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (

        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
            <button onClick={() => navigate(-1)} style={{ marginBottom: "16px" }}>
                ← 뒤로가기
            </button>

            <h1>문서 편집</h1>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "16px" }}>
                    <label>제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ display: "block", marginTop: "4px", width: "100%" }}
                    />
                </div>
                <div style={{ marginBottom: "16px" }}>
                    <label>필드</label>
                    {fieldInputs.map((field, index) => (
                        <div
                            key={index}
                            style={{ display: "flex", gap: "8px", marginTop: "8px" }}
                        >
                            <input
                                type="text"
                                placeholder="필드명 (예: bpm)"
                                value={field.key}
                                onChange={(e) => handleFieldChange(index, "key", e.target.value)}
                                style={{ width: "40%" }}
                            />
                            <input
                                type="text"
                                placeholder="값 (예: 155)"
                                value={field.value}
                                onChange={(e) => handleFieldChange(index, "value", e.target.value)}
                                style={{ width: "40%" }}
                            />
                            <button
                                type="button"
                                onClick={() => handelRemoveField(index)}
                            >
                                삭제
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddField}
                        style={{ marginTop: "8px" }}
                    >
                        + 필드 추가
                    </button>
                </div>
                
                {error && <p style={{ color: "red" }}>{error}</p>}

                <button type="submit">저장</button>
            </form>
        </div>
    );
}

export default DocumentEditPage;