import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import { useAuth } from "../context/AuthContext";

function LoginPage() {

    const { isLoggedIn, login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {

        if (isLoggedIn) {
    
            navigate("/");
        }
    }, [isLoggedIn, navigate]);

    const handleLoginSuccess = (data) => {

        login(data);
        navigate("/");
    };

    return (

        <div className="max-w-md mx-auto py-16">
            <h1 className="text-2xl font-bold mb-8 text-center">로그인</h1>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 shadow-sm">
                <LoginForm onLoginSuccess={handleLoginSuccess} />
                계정이 없으신가요?{" "}
                <button
                    onClick={() => navigate("/signup")}
                    className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
                >
                    회원가입
                </button>
            </div>
        </div>
    );
}

export default LoginPage;