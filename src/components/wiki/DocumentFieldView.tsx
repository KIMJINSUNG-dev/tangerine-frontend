interface DocumentFieldViewProps {

    fields: Record<string, string>;
}

function DocumentFieldView({ fields }: DocumentFieldViewProps) {

    const entries = Object.entries(fields || {});
    if(entries.length === 0) {

        return (
            
            <p className="text-gray-500 dark:text-gray-400 text-sm">
                필드 정보가 없어요.
            </p>
        );
    }

    return (

        <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
            {entries.map(([key, value], index) => (
                <div
                    key={key}
                    className={`flex px-5 py-3 ${
                        index !== 0 ? "border-t border-gray-200 dark:border-gray-800" : ""
                    }`}
                >
                    <span className="w-1/3 text-sm font-medium text-gray-500 dark:text-gray-400">
                        {key}
                    </span>
                    <span className="w-2/3 text-sm text-gray-900 dark:text-gray-100">
                        {value}
                    </span>
                </div>
            ))}
        </div>
    );
}

export default DocumentFieldView;