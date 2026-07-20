import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { createDocument, getDocumentTypes, getTemplate } from "../../api/documentApi";
import type { DocumentType, DocumentCreateRequest } from "../../types";

function DocumentCreatePage() {

    const navigate = useNavigate();
    const [typeId, setTypeId] = useState<number>(0);
    const [title, setTitle] = useState<string>("");
    const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

    const { data: documentTypes = [] } = useQuery({

        queryKey: ["documentTypes"],
        queryFn: () => getDocumentTypes().then((res) => res.data),
    });

    useEffect(() => {

        if (documentTypes.length > 0 && typeId === 0) {

            setTypeId(documentTypes[0].id);
        }
    }, [documentTypes]);

    /**
     * [설명] 이전 .jsx 버전에서는 typeId가 바뀔 때마다 직접
     * useEffect + isCancelled 방어 코드로 "오래된 응답이 화면을
     * 덮어쓰는" 경쟁 상태를 막아야 했어요. (DB 중복 데이터 버그와
     * 겹쳐서 한참 헤맸던 그 부분이에요)
     *
     * useQuery로 바꾸면 그 방어 코드가 통째로 필요 없어져요.
     * queryKey에 typeId를 포함시켜두기만 하면, typeId가 바뀌는 순간
     * React Query가 "이전 typeId 요청은 이제 의미 없다"는 걸 자동으로
     * 인식하고 최신 typeId의 응답만 반영해줘요.
     */
    const { data: template = [] } = useQuery({

        queryKey: ["template", typeId],
        queryFn: () => getTemplate(typeId).then((res) => res.data),
        enabled: typeId > 0,
    });

    const createMutation = useMutation({

        mutationFn: (data: DocumentCreateRequest) => createDocument(data),
        onSuccess: (response) => {

            navigate(`/wiki/documents/${response.data.id}`);
        },
    });

    const handleTypeChange = (newTypeId: number) => {

        setTypeId(newTypeId);
        setFieldValues({});
    };

    const handleFieldChange = (fieldKey: string, value: string) => {

        setFieldValues((prev) => ({ ...prev, [fieldKey]: value }));
    };

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {

        e.preventDefault();
        createMutation.mutate({ typeId, title, fields: fieldValues});
    };

    // [추가] GlobalExceptionHandler가 본문에 그대로 담아 보내주는
    // 구체적인 오류 메시지("정의되지 않은 필드입니다: ...")를 꺼내요.
    // AxiosError<string>: 이 요청의 에러 응답 본문이 문자열이라는 의미
    const errorMessage = createMutation.error 
        ? (createMutation.error as AxiosError<string>).response?.data || "문서 작성에 실패했어요."
        : null;

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
                        onChange={(e) => handleTypeChange(Number(e.target.value))}
                        className={inputClass}
                    >
                        {documentTypes.map((type) => (

                            <option key={type.id} value={type.id}>
                                {type.description} ({type.name})
                            </option>
                        ))}
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

                {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

                <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors"
                >
                    저장
                </button>
            </form>
        </div>
    );
}

export default DocumentCreatePage;