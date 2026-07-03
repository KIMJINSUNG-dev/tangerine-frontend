import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import { useAuth } from "../context/AuthContext";
import type { LoginResponse } from "../types";

function LoginPage() {

    const { isLoggedIn, login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {

        if (isLoggedIn) {

            navigate("/");
        }
    }, [isLoggedIn, navigate]);

    const handleLoginSuccess = (data: LoginResponse) => {

        login(data);
        navigate("/");
    };

    return (

        <div className="max-w-sm mx-auto mt-16">
            <h1 className="text-2xl font-bold mb-8 text-center">로그인</h1>
            <LoginForm onLoginSuccess={handleLoginSuccess}/>
            <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                계정이 없으신가요?{" "}
                <button
                    onClick={() => navigate("/signup")}
                    className="text-orange-500 font-medium hover:text-orange-600"
                >
                    회원가입
                </button>
            </p>
        </div>
    );
}

export default LoginPage;