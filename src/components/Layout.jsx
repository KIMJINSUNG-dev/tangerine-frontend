import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../hooks/useDarkMode";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

function Layout({ children }) {

    const navigate = useNavigate();
    const { isDark, toggle } = useDarkMode();
    const { isLoggedIn, userNickname, isAdmin, logout } = useAuth();

    const handleLogout = async () => {

        try {

            await api.post("/api/users/logout");
        } catch (err) {

            console.error("로그아웃 오류: ", err);
        } finally {

            logout();
            navigate("/login");
        }
    };

    return (

        <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">

            {/* 네비게이션 바 */}
            <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">

                    {/* 로고 */}
                    <span
                        onClick={() => navigate("/")}
                        className="font-bold text-xl text-orange-500 cursor-pointer hover:text-orange-600 transition-colors"
                    >
                        Tangerine
                    </span>

                    {/* 네비게이션 링크 */}
                    <div className="flex items-center gap-6 text-sm">
                        <span
                            onClick={() => navigate("/wiki/type/1")}
                            className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                        >
                            위키
                        </span>
                        <span
                            onClick={() => navigate("/board/free")}
                            className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                        >
                            게시판
                        </span>
                        {isAdmin && (
                            <span
                                onClick={() => navigate("/admin")}
                                className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                            >
                                관리자
                            </span>
                        )}
                    </div>

                    {/* 우측 버튼 영역 */}
                    <div className="flex items-center gap-3">

                        {/* 다크모드 토글 */}
                        <button
                            onClick={toggle}
                            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            { isDark ? "☀️" : "🌙" }
                        </button>

                        {isLoggedIn ? (

                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {userNickname}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    로그아웃
                                </button>
                            </div>
                        ) : (
                            
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => navigate("/login")}
                                    className="text-sm px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    로그인
                                </button>
                                <button
                                    onClick={() => navigate("/signup")}
                                    className="text-sm px-3 py-1.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                                >
                                    회원가입
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* 페이지 콘텐츠 */}
            <main className="max-w-5xl mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    );
}

export default Layout;