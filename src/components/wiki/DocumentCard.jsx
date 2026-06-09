import { useNavigate } from "react-router-dom";

function DocumentCard({ document }) {

    const navigate = useNavigate();
    return (

        <div
            onClick={() => navigate(`/wiki/documents/${document.id}`)}
            className="border border-gray-200 dark:border-gray-800 rounded-xl p-5 cursor-pointer hover:border-orange-400 dark:hover:border-orange-500 hover:shadow-sm transition-all"
        >
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {document.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                유형: {document.typeName} | 작성자: {document.createdBy}
            </p>
        </div>
    );
}

export default DocumentCard;