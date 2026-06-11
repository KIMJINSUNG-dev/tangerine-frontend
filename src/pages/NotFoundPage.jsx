import { useNavigate } from "react-router-dom";

function NotFoundPage() {

    const navigate = useNavigate();

    return (

        <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
            <p className="text-7xl font-bold text-orange-400">404</p>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                페이지를 찾을 수 없어요
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
                요청하신 페이지가 존재하지 않거나 삭제됐어요.
            </p>
            <button
                onClick={() => navigate("/")}
                className="mt-4 px-6 py-2.5 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors"
            >
                홈으로 돌아가기
            </button>
        </div>
    )
}

export default NotFoundPage;