import { useState } from "react";
import api from "../../api/axios"

function LoginForm({ onLoginSuccess }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();
        setError("");

        try {

            const response = await api.post("/api/users/login", {

                email,
                password,
            });
            onLoginSuccess(response.data);
        } catch (error) {

            setError("이메일 또는 비밀번호가 올바르지 않습니다.");
        }
    }

    return (

        <form onSubmit={handleSubmit}>
            <h2>로그인</h2>
            <div>
                <label>이메일</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일을 입력하세요"
                />
            </div>
            <div>
                <label>비밀번호</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력하세요"
                />
            </div>
            {error && <p style={{ color: "red"}}>{error}</p>}
            <button type="submit">로그인</button>
        </form>
    );
}

export default LoginForm;