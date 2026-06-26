import { useState, useEffect } from "react";
import { getTemplate } from "../../api/documentApi";
import { createTemplate, deleteTemplate } from "../../api/adminApi";

function AdminTemplatePage() {

    const [typeId, setTypeId] = useState(1);
    const [template, setTemplate] = useState([]);
    const [error, setError] = useState("");

    // 필드 추가 폼 상태
    const [fieldKey, setFieldKey] = useState("");
    const [fieldName, setFieldName] = useState("");
    const [fieldType, setFieldType] = useState("TEXT");
    const [required, setRequired] = useState(false);
    const [displayOrder, setDisplayOrder] = useState(1);

    const fetchTemplate = async () => {

        try {

            const response = await getTemplate(typeId);
            setTemplate(response.data);
        } catch (err) {

            setError("필드 목록을 불러오는 데 실패했어요.");
        }
    };

    useEffect(() => {

        fetchTemplate();
    }, [typeId]);

    const handleAdd = async (e) => {

        e.preventDefault();
        setError("");
        try {

            await createTemplate({

                typeId,
                fieldKey,
                fieldName,
                fieldType,
                required,
                displayOrder: Number(displayOrder),
            });
            setFieldKey("");
            setFieldName("");
            setFieldName("TEXT");
            setRequired(false);
            setDisplayOrder(1);
            fetchTemplate(); // 추가 후 목록 다시 불러오기
        } catch (err) {

            setError(err.response?.data || "필드 추가에 실패했어요.");
        }
    };

    const handleDelete = async (id) => {

        if (!window.confirm("이 필드를 삭제하시겠어요?")) return;
        try {

            await deleteTemplate(id);
            fetchTemplate();
        } catch (err) {

            setError("필드 삭제에 실패했어요.");
        }
    };

    const inputClass = "px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-70 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors";

    return (

        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-8">위키 필드 템플릿 관리</h1>

            <div className="mb-8">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                    문서 유형
                </label>
                <select
                    value={typeId}
                    onChange={(e) => setTypeId(Number(e.target.value))}
                    className={inputClass}
                >
                    <option value={1}>수록곡 (SONG)</option>
                    <option value={2}>작곡가 (COMPOSER)</option>
                    <option value={3}>게임 타이틀 (GAME)</option>
                </select>
            </div>

            <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden mb-8">
                {template.length === 0 ? (

                    <p className="p-5 text-sm text-gray-500 dark:text-gray-400">
                        등록된 필드가 없어요.
                    </p>
                ) : (

                    template.map((field, index) => (

                        <div
                            key={field.id}
                            className={`flex items-center justify-between px-5 py-3 ${

                                index !== 0 ? "border-t border-gray-200 dark:border-gray-800" : ""
                            }`}
                        >
                            <div>
                                <span className="font-medium text-sm">{field.fieldName}</span>
                                <span className="ml-2 text-xs text-gray-400">
                                    ({field.fieldKey} / {field.fieldType}
                                    {field.required ? " / 필수" : ""})
                                </span>
                            </div>
                            <button
                                onClick={() => handleDelete(field.id)}
                                className="text-xs text-red-500 hover:text-red-600"
                            >
                                삭제
                            </button>
                        </div>
                    ))
                )}
            </div>

            <h2 className="text-lg font-semibold mb-4">필드 추가</h2>
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="필드 키 (예: bpm)"
                        value={fieldKey}
                        onChange={(e) => setFieldKey(e.target.value)}
                        required
                        className={`${inputClass} flex-1`}
                    />
                    <input
                        type="text"
                        placeholder="표시 이름 (예: BPM)"
                        value={fieldName}
                        onChange={(e) => setFieldName(e.target.value)}
                        required
                        className={`${inputClass} flex-1`}
                    />
                </div>
                <div className="flex gap-2 items-center">
                    <select
                        value={fieldType}
                        onChange={(e) => setFieldType(e.target.value)}
                        className={inputClass}
                    >
                        <option value="TEXT">텍스트</option>
                        <option value="NUMBER">숫자</option>
                        <option value="DATE">날짜</option>
                        <option value="BOOLEAN">참/거짓</option>
                        <option value="REFERENCE">문서 참조</option>
                    </select>
                    <input
                        type="number"
                        placeholder="표시 순서"
                        value={displayOrder}
                        onChange={(e) => setDisplayOrder(e.target.value)}
                        className={inputClass}
                    />
                    <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <input
                            type="checkbox"
                            checked={required}
                            onChange={(e) => setRequired(e.target.checked)}
                        />
                        필수 입력
                    </label>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button
                    type="submit"
                    className="self-start px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors"
                >
                    추가
                </button>
            </form>
        </div>
    );
}

export default AdminTemplatePage;