import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useDarkMode } from "../hooks/useDarkMode";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

interface LayoutProps {

    children: ReactNode;
}

function Layout({ children }: LayoutProps) {

    const navigate = useNavigate();
    const { isDark, toggle } = useDarkMode();
    const { isLoggedIn, userNickname, isAdmin, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState<boolean>(false);

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

    const handleNavigate = (path: string) => {

        navigate(path);
        setMenuOpen(false);
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
                    <div className="hidden sm:flex items-center gap-6 text-sm">
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
                                onClick={() => navigate("/admin/templates")}
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

                        {/* 데스크탑 로그인/로그아웃 */}
                        <div className="hidden sm:flex items-center gap-3">
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
                        {/* 햄버거 버튼 - 모바일에서만 표시 */}
                        <button
                            onClick={() => setMenuOpen((prev) => !prev)}
                            className="sm:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <span className={`block w-5 h-0.5 bg-gray-600 dark:bg-gray-400 transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
                            <span className={`block w-5 h-0.5 bg-gray-600 dark:bg-gray-400 transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`}></span>
                            <span className={`block w-5 h-0.5 bg-gray-600 dark:bg-gray-400 transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
                        </button>
                    </div>
                </div>

                {/* 모바일 드롭다운 메뉴 */}
                {menuOpen && (
                    
                    <div className="sm:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-6 py-4 flex flex-col gap-4">
                        <span
                            onClick={() => handleNavigate("/wiki/type/1")}
                            className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                        >
                            위키
                        </span>
                        <span
                            onClick={() => handleNavigate("/board/free")}
                            className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                        >
                            게시판
                        </span>
                        {isAdmin && (

                            <span
                                onClick={() => handleNavigate("/admin/templates")}
                                className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                            >
                                관리자
                            </span>
                        )}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                            {isLoggedIn ? (

                                <div className="flex items-center justify-between">
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

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleNavigate("/login")}
                                        className="flex-1 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        로그인
                                    </button>
                                    <button
                                        onClick={() => handleNavigate("/signup")}
                                        className="flex-1 py-2 rounded-lg bg-orange-500 text-white text-sm hover:bg-orange-600 transition-colors"
                                    >
                                        회원가입
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* 페이지 콘텐츠 */}
            <main className="max-w-5xl mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    );
}

export default Layout;