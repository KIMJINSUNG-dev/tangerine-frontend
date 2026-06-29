import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { getDocument, getTemplate, updateDocument } from "../../api/documentApi";
import type { DocumentUpdateRequest } from "../../types";

function DocumentEditPage() {

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const documentId = Number(id);

    const [title, setTitle] = useState<string>("");
    const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

    const { data: document, isLoading: isDocLoading } = useQuery({

        queryKey: ["document", documentId],
        queryFn: () => getDocument(documentId).then((res) => res.data),
    });

    /**
     * [설명] 새 개념 1 - "의존하는 쿼리(dependent query)"
     *
     * 이 템플릿 조회는 document.typeId가 필요해요. 그런데 document는
     * 비동기로 받아오는 중이라, 컴포넌트가 처음 렌더링될 땐 아직
     * undefined예요. document가 없는데 document.typeId를 읽으려고
     * 하면 그 자리에서 바로 에러가 나요.
     *
     * enabled: !!document
     * → "document가 존재할 때만 이 쿼리를 실행해라"는 React Query의
     *   설정이에요. document가 아직 없으면 queryFn 자체가 호출되지
     *   않고 대기해요. document가 도착하는 순간 자동으로 실행돼요.
     *   "쿼리 A의 결과가 있어야 쿼리 B를 실행할 수 있다"는 관계를
     *   이렇게 표현해요.
     */
    const { data: template = [], isLoading: isTemplateLoading } = useQuery({

        queryKey: ["template", document?.typeId],
        // [설명] 새 개념 2 - non-null assertion (!)
        // enabled가 document를 보장하지만, TypeScript는 그 관계를
        // 자동으로는 몰라요. "document가 null일 수도 있다"는 타입
        // 경고가 그대로 남아있어요. document!.typeId의 !는
        // "여기선 document가 절대 null/undefined가 아니라고 내가
        // 보장한다"고 컴파일러에게 직접 알려주는 단언이에요.
        // (enabled 덕분에 실제로도 안전해요. 이 쿼리는 document가
        // 있을 때만 실행되니까요)
        queryFn: () => getTemplate(document!.typeId).then((res) => res.data),
        enabled: !!document,
    });

    useEffect(() => {

        if (document) {

            setTitle(document.title);
            setFieldValues(document.fields);
        }
    }, [document]);

    const updateMutation = useMutation({

        mutationFn: (data: DocumentUpdateRequest) => updateDocument(documentId, data),
        onSuccess: () => {

            queryClient.invalidateQueries({ queryKey: ["document", documentId] });
            queryClient.invalidateQueries({ queryKey: ["documents"] });
            navigate(`/wiki/documents/${documentId}`);
        },
    });

    const handleFieldChange = (fieldKey: string, value: string) => {

        setFieldValues((prev) => ({ ...prev, [fieldKey]: value }));
    };

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {

        e.preventDefault();
        updateMutation.mutate({ title, fields: fieldValues });
    };

    const errorMessage = updateMutation.error
        ? (updateMutation.error as AxiosError<string>).response?.data || "문서 수정에 실패했어요."
        : null;

    const inputClass = "px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors";

    if (isDocLoading || isTemplateLoading) {

        return <p className="text-center text-gray-500 dark:text-gray-400 py-20">불러오는 중...</p>;
    }

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
                    disabled={updateMutation.isPending}
                    className="py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors"
                >
                    저장
                </button>
            </form>
        </div>
    );
}

export default DocumentEditPage;