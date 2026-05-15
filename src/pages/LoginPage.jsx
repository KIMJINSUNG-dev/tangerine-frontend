import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm"

function LoginPage() {

    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const handleLoginSuccess = (data) => {

        localStorage.setItem("accessToken", data.accessToken);
        setUser({ nickname: data.nickname, role: data.role });
    };

    if (user) {

        return (

            <div>
                <h2>환영합니다, {user.nickname}님!</h2>
                <p>등급: {user.role}</p>
            </div>
        );
    }

    return (

        <div>
            <LoginForm onLoginSuccess={handleLoginSuccess} />
            <p>
                계정이 없으신가요?{" "}
                <button onClick={() => navigate("/signup")}>회원가입</button>
            </p>
        </div>
    );
}

export default LoginPage;