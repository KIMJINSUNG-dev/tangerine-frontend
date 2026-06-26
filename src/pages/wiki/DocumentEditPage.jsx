import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDocument, getTemplate, updateDocument } from "../../api/documentApi";

function DocumentEditPage() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");

    // [수정] 자유 입력 배열 대신 템플릿 + 값 객체로 관리해요.
    const [template, setTemplate] = useState([]);
    const [fieldValues, setFieldValues] = useState({});

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchDocuments = async () => {

            try {

                const docResponse = await getDocument(id);
                const doc = docResponse.data;
                setTitle(doc.title);
                setFieldValues(doc.fields || {});

                // [추가] 문서의 유형(typeId)을 기준으로 그 유형의 템플릿을 가져와요.
                // 방금 DocumentResponse에 typeId를 추가했기 때문에 가능해요.
                const templateResponse = await getTemplate(doc.typeId);
                setTemplate(templateResponse.data);
            } catch {

                setError("문서를 불러오는 데 실패했어요.");
            } finally {

                setLoading(false);
            }
        };

        fetchDocuments();
    }, [id]);

    const handleFieldChange = (fieldKey, value) => {

        setFieldValues((prev) => ({ ...prev, [fieldKey]: value }));
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setError("");

        try {

            await updateDocument(id, { title, fields: fieldValues });
            navigate(`/wiki/documents/${id}`);
        } catch (err) {

            setError(err.response?.data || "문서 수정에 실패했어요.");
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
                
                {template.length > 0 && (

                    <div className="flex flex-col gap-4">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            필드
                        </label>
                        {template.map((field) => (
                            <div key={field.fieldKey} className="flex flex-col gap-1">
                                <label className="text-xs text-gray-500 dark:text-gray-400">
                                    {field.fieldName}
                                    {field.required && <span className="text-orange-500 ml-1">*</span>}
                                </label>
                                <input
                                    type={field.fieldType === "NUMBER" ? "number" : "text"}
                                    value={fieldValues[field.fieldKey] || ""}
                                    onChange={(e) => handleFieldChange(field.fieldKey), e.target.value}
                                    required={field.required}
                                    className={inputClass}
                                />
                            </div>
                        ))}
                    </div>
                )}
                
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