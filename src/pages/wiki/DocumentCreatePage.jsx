import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDocument, getTemplate } from "../../api/documentApi";

function DocumentCreatePage() {

    const navigate = useNavigate();
    const [typeId, setTypeId] = useState(1);
    const [title, setTitle] = useState("");
    
    // [수정] 자유 입력 배열(fieldInputs) 대신, 관리자가 정의해둔
    // 템플릿 목록을 받아와서 그대로 폼에 그려요.
    const [template, setTemplate] = useState([]);

    // [수정] { 필드키: 입력값 } 형태의 객체로 관리해요.
    const [fieldValues, setFieldValues] = useState({});

    const [error, setError] = useState("");

    // [추가] 유형(typeId)이 바뀔 때마다 그 유형의 템플릿을 다시 조회해요.
    useEffect(() => {
        
        // [추가] 이 effect 실행 시점에만 유효한 변수예요.
        // 클로저로 캡처되어서, 나중에 effect가 재실행되거나 끝나도
        // 이 특정 실행 안에서는 값이 안 바뀌어요.
        let isCancelled = false;
        
        const fetchTemplate = async () => {

            try {

                const response = await getTemplate(typeId);

                // [추가] 응답이 왔을 때, 혹시 그 사이에 typeId가 또 바뀌어서
                // 이 effect가 "취소"된 상태라면 state를 업데이트하지 않아요.
                if (!isCancelled) {
                
                    setTemplate(response.data);
                    setFieldValues({});
                }
            } catch (err) {

                setError("필드 정보를 불러오는 데 실패했어요.");
            }
        };
        fetchTemplate();

        // [추가] cleanup 함수: typeId가 바뀌어서 이 effect가 다시 실행되기
        // 직전에 React가 자동으로 호출해줘요. 여기서 isCancelled를 true로
        // 바꿔두면, 위에서 await 하던 "오래된" 요청의 응답이 늦게 와도
        // if (!isCancelled) 체크에 걸려서 무시돼요.
        return () => {
            
            isCancelled = true;
        };
    }, [typeId]);

    const handleFieldChange = (fieldKey, value) => {

        setFieldValues((prev) => ({ ...prev, [fieldKey]: value }));
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setError("");
        try {

            const response = await createDocument({ typeId, title, fields: fieldValues});
            navigate(`/wiki/documents/${response.data.id}`);
        } catch (err) {

            // [수정] 백엔드가 "정의되지 않은 필드입니다" 같은 구체적 메시지를
            // 본문에 그대로 담아 보내주므로(GlobalExceptionHandler 덕분에),
            // 그 메시지를 화면에 그대로 보여줘요.
            setError(err.response?.data || "문서 작성에 실패했어요.");
        }
    };

    const inputClass = "px-4 py-2 rounded-lg border border-gray-200 darker:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors";

    return (

        <div className="max-w-3xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors mb-6"
            >
                ← 뒤로가기
            </button>

            <h1 className="text-2xl font-bold mb-8">새 문서 작성</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
                
                {/*
                    [삭제] 필드명+값 직접 입력란과 "필드 추가"/"삭제" 버튼들을 전부 제거했어요.
                    [추가] 관리자가 정의해둔 template 배열을 그대로 화면에 그려요.
                            사용자는 필드 구조를 바꿀 수 없고 "값"만 입력할 수 있어요.
                */}
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
                                    onChange={(e) => handleFieldChange(field.fieldKey, e.target.value)}
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

export default DocumentCreatePage;