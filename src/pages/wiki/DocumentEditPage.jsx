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

    const inputClass = "px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors";

    if (loading) return (
        
        <p className="text-center text-gray-500 dark:text-gray-400 py-20">
            불러오는 중...
        </p>
    );
    if (error) return (
    
        <p className="text-center text-red-500 py-20">{error}</p>
    );

    return (

        <div className="max-w-3xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors mb-6"
            >
                ← 뒤로가기
            </button>

            <h1 className="text-2xl font-bold mb-8">문서 편집</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        제목
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className={inputClass}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        필드
                    </label>
                    <div className="flex flex-col gap-2">
                        {fieldInputs.map((field, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="필드명 (예: bpm)"
                                    value={field.key}
                                    onChange={(e) => handleFieldChange(index, "key", e.target.value)}
                                    className={`${inputClass} flex-1`}
                                    />
                                <input
                                    type="text"
                                    placeholder="값 (예: 155)"
                                    value={field.value}
                                    onChange={(e) => handleFieldChange(index, "value", e.target.value)}
                                    className={`${inputClass} flex-1`}
                                />
                                <button
                                    type="button"
                                    onClick={() => handelRemoveField(index)}
                                    className="px-3 py-2 rounded-lg text-sm text-red-500 border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                                >
                                    삭제
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={handleAddField}
                        className="self-start text-sm text-orange-500 hover:text-orange-600 transition-colors"
                    >
                        + 필드 추가
                    </button>
                </div>
                
                {error && <p className="text-sm text-red-500">{error}</p>}

                <button
                    type="submit"
                    className="py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors"
                >
                    저장
                </button>
            </form>
        </div>
    );
}

export default DocumentEditPage;