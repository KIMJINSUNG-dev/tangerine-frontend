import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { getTemplate } from "../../api/documentApi";
import { createTemplate, deleteTemplate } from "../../api/adminApi";
import type { DocumentTemplateRequest } from "../../types";

const documentTypes = [

    { id: 1, label: "수록곡 (SONG)" },
    { id: 2, label: "작곡가 (COMPOSER)" },
    { id: 3, label: "게임 타이틀 (GAME)" },
];

function AdminTemplatePage() {

    const queryClient = useQueryClient();
    const [typeId, setTypeId] = useState<number>(1);

    // 필드 추가 폼 상태
    const [fieldKey, setFieldKey] = useState<string>("");
    const [fieldName, setFieldName] = useState<string>("");
    const [fieldType, setFieldType] = useState<string>("TEXT");
    const [required, setRequired] = useState<boolean>(false);
    const [displayOrder, setDisplayOrder] = useState<number>(1);

    /**
     * [수정] 기존 .jsx에서는 fetchTemplate()를 useEffect + useState로
     * 직접 관리했어요. useQuery로 바꾸면 typeId가 바뀔 때 자동으로
     * 새 목록을 가져오고, 추가/삭제 성공 후 invalidateQueries만 하면
     * 목록이 자동으로 갱신돼요.
     */
    const { data: template = [], isLoading } = useQuery({

        queryKey: ["template", typeId],
        queryFn: () => getTemplate(typeId).then((res) => res.data),
    });

    const createMutation = useMutation({

        mutationFn: (data: DocumentTemplateRequest) => createTemplate(data),
        onSuccess: () => {

            // [수정] 추가 성공 시 폼 초기화 + 목록 갱신
            queryClient.invalidateQueries({ queryKey: ["template", typeId] });
            setFieldKey("");
            setFieldName("");
            setFieldType("TEXT");
            setRequired(false);
            setDisplayOrder(1);
        },
    });

    const deleteMutation = useMutation({

        mutationFn: (id: number) => deleteTemplate(id),
        onSuccess: () => {

            queryClient.invalidateQueries({ queryKey: ["template", typeId] });
        },
    });

    const handleAdd = (e: React.SubmitEvent<HTMLFormElement>) => {

        e.preventDefault();
        createMutation.mutate({

            typeId,
            fieldKey,
            fieldName,
            fieldType,
            required,
            displayOrder,
        });
    };

    const handleDelete = (id: number) => {

        if (!window.confirm("이 필드를 삭제하시겠어요?")) return;
        deleteMutation.mutate(id);
    };

    const inputClass = "px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors";

    return (

        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-8">위키 필드 템플릿 관리</h1>

            {/* 유형 선택 */}
            <div className="mb-8">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                    문서 유형
                </label>
                <select
                    value={typeId}
                    onChange={(e) => setTypeId(Number(e.target.value))}
                    className={inputClass}
                >
                    {documentTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                            {type.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* 현재 필드 목록 */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden mb-8">
                {isLoading ? (
                    
                    <p className="p-5 text-sm text-gray-500 dark:text-gray-400">불러오는 중...</p>
                ) : template.length === 0 ? (

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
                                <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                    {field.fieldName}
                                </span>
                                <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
                                    ({field.fieldKey} / {field.fieldType}
                                    {field.required ? "필수" : ""})
                                </span>
                            </div>
                            <button
                                onClick={() => handleDelete(field.id)}
                                disabled={deleteMutation.isPending}
                                className="text-xs text-red-500 hover:text-red-600 disabled:opacity-50 transition-colors"
                            >
                                삭제
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* 필드 추가 폼 */}
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
                        onChange={(e) => setFieldKey(e.target.value)}
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
                        onChange={(e) => setDisplayOrder(Number(e.target.value))}
                        className={`${inputClass} w-28`}
                    />
                    <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={required}
                            onChange={(e) => setRequired(e.target.checked)}
                        />
                        필수 입력
                    </label>
                </div>

                {createMutation.error && (
                    
                    <p className="text-sm text-red-500">
                        {(createMutation.error as AxiosError<string>).response?.data ||
                            "필드 추가에 실패했어요."}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="self-start px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 disabled:opacity-50 transition-colors"
                >
                    추가
                </button>
            </form>
        </div>
    );
}

export default AdminTemplatePage;