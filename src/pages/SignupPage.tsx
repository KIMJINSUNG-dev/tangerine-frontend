import { useNavigate } from "react-router-dom";
import SignupForm from "../components/auth/SignupForm";

function SignupPage() {

    const navigate = useNavigate();

    const handleSignupSuccess = () => {

        alert("회원가입이 완료되었습니다.");
        navigate("/login");
    };

    return (

        <div className="max-w-sm mx-auto mt-16">
            <h1 className="text-2xl font-bold mb-8 text-center">회원가입</h1>
            <SignupForm onSignupSuccess={handleSignupSuccess} />
        </div>
    );
}

export default SignupPage;