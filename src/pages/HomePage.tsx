import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function HomePage() {

    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    
    const shortcuts: { title: string; description: string; path: string }[] = [

        { title: "수록곡", description: "beatmania IIDX 수록곡 정보", path: "/wiki/type/1" },
        { title: "작곡가", description: "아티스트 및 작곡가 정보", path: "/wiki/type/2" },
        { title: "게시판", description: "자유롭게 이야기를 나눠요", path: "/wiki/type/3" },
    ];

    return (

        <div className="flex flex-col items-center text-center py-20 gap-12">
            <div className="flex flex-col items-center gap-4">
                <h1 className="text-5xl font-bold text-orange-500">Tangerine</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md">
                    BEMANI 시리즈의 수록곡, 작곡가, 게임 타이틀 정보를 모아두는 위키 & 커뮤니티
                </p>
                {!isLoggedIn && (

                    <div className="flex gap-3 mt-2">
                        <button
                            onClick={() => navigate("/signup")}
                            className="px-6 py-2.5 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors"
                        >
                            시작하기
                        </button>
                        <button
                            onClick={() => navigate("/login")}
                            className="px-6 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            로그인
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 gap-4 w-full max-w-2xl sm:grid-cols-3">
                {shortcuts.map((item) => (

                    <div
                        key={item.title}
                        onClick={() => navigate(item.path)}
                        className="flex flex-col gap-2 p-6 border border-gray-200 dark:border-gray-800 rounded-xl cursor-pointer hover:border-orange-400 dark:hover:border-orange-500 hover:shadow-sm transition-all text-left"
                    >
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HomePage;