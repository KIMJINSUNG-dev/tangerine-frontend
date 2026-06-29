import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDocument, deleteDocument } from "../../api/documentApi";
import DocumentFieldView from "../../components/wiki/DocumentFieldView";
import { useAuth } from "../../context/AuthContext";

function DocumentDetailPage() {

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { isAdmin, isLoggedIn } = useAuth();
    const documentId = Number(id);

    const { data: document, isLoading, isError } = useQuery({

        queryKey: ["document", documentId],
        queryFn: () => getDocument(documentId).then((res) => res.data),
    });

    const deleteMutation = useMutation({

        mutationFn: () => deleteDocument(documentId),
        onSuccess: () => {

            queryClient.invalidateQueries({ queryKey: ["documents"] });
            navigate(-1);
        },
    });

    const handleDelete = () => {

        if (!window.confirm("정말 삭제하시겠어요?")) return;
        deleteMutation.mutate();
    }

    if (isLoading) {

        return <p className="text-center text-gray-500 dark:text-gray-400 py-20">불러오는 중...</p>;
    }

    if (isError || !document) {

        return <p className="text-center text-red-500 py-20">문서를 불러오는 데 실패했어요.</p>;
    }

    return (

        <div className="max-w-3xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors mb-6 flex items-center gap-1"
            >
                ← 뒤로가기
            </button>

            <div className="flex items-start justify-between mb-2">
                <h1 className="text-2xl font-bold">{document.title}</h1>
                <div className="flex gap-2">
                    {isLoggedIn && (

                        <button
                            onClick={() => navigate(`/wiki/documents/${documentId}/edit`)}
                            className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            편집
                        </button>
                    )}
                    {isAdmin && (

                        <button
                            onClick={handleDelete}
                            className="px-3 py-1.5 rounded-lg text-sm border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
                            삭제
                        </button>
                    )}
                </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                {document.typeName} · {document.createdBy} · {new Date(document.createdAt).toLocaleDateString()}
            </p>

            <DocumentFieldView fields={document.fields} />
        </div>
    );
}

export default DocumentDetailPage;