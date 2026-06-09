import { useNavigate } from "react-router-dom";
import SignupForm from "../components/auth/SignupForm";

function SignupPage() {

    const navigate = useNavigate();

    const handleSignupSuccess = () => {

        alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
        navigate("/login");
    };

    return (

        <div className="max-w-md mx-auto py-16">
            <h1 className="text-2xl font-bold mb-8 text-center">회원가입</h1>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 shadow-sm">
                <SignupForm onSignupSuccess={handleSignupSuccess} />
                <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    이미 계정이 있으신가요?{" "}
                    <button
                        onClick={() => navigate("/login")}
                        className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
                    >
                        로그인
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;