import { useState } from "react";
import api from "../../api/axios";

function SignupForm({ onSignupSuccess }) {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();
        setError("");

        try {

            await api.post("/api/users/signup", {

                email,
                password,
                nickname,
            });
            onSignupSuccess();
        } catch (err) {

            setError(

                err.response?.data || "회원가입 중 오류가 발생했습니다."
            );
        }
    };

    return (

        <form onSubmit={handleSubmit}>
            <h2>회원가입</h2>
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
            <div>
                <label>닉네임</label>
                <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="닉네임을 입력하세요"
                />
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button type="submit">회원가입</button>
        </form>
    );
}

export default SignupForm;