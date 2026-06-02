import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDocument } from "../../api/documentApi";

function DocumentCreatePage() {

    const navigate = useNavigate();
    const [typeId, setTypeId] = useState(1);
    const [title, setTitle] = useState("");
    const [fieldInputs, setFieldInputs] = useState([{ key: "", value: "" }]);
    const [error, setError] = useState("");

    const handleFieldChange = (index, type, value) => {

        const updated = [...fieldInputs];
        updated[index][type] = value;
        setFieldInputs(updated);
    };

    const handleAddField = () => {

        setFieldInputs([...fieldInputs, { key: "", value: "" }]);
    };

    const handleRemoveField = (index) => {

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

            const response = await createDocument({ typeId, title, fields });
            navigate(`/wiki/documents/${response.data.id}`);
        } catch (err) {

            setError("문서 작성에 실패했어요.");
        }
    };

    return (

        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
            <button onClick={() => navigate(-1)} style={{ marginBottom: "16px" }}>
                ← 뒤로가기
            </button>

            <h1>새 문서 작성</h1>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "16px" }}>
                    <label>문서 유형</label>
                    <select
                        value={typeId}
                        onChange={(e) => setTypeId(Number(e.target.value))}
                        style={{ display: "block", marginTop: "4px"}}
                    >
                        <option value={1}>수록곡 (SONG)</option>
                        <option value={2}>작곡가 (COMPOSER)</option>
                        <option value={3}>게임 타이틀 (GAME)</option>
                    </select>
                </div>

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
                        <div key={index} style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
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
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddField}
                        style={{ marginTop: "8px"}}
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

export default DocumentCreatePage;