import { useNavigate } from "react-router-dom";
import SignupForm from "../components/auth/SignupForm";

function SignupPage() {

    const navigate = useNavigate();

    const handleSignupSuccess = () => {

        alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
        navigate("/login");
    };

    return (

        <div>
            <SignupForm onSignupSuccess={handleSignupSuccess} />
        </div>
    );
}

export default SignupPage;