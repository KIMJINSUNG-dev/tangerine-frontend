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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    이메일
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일을 입력하세요"
                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors"
                    />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    비밀번호
                </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력하세요"
                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors"
                />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
                type="submit"
                className="py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors"
            >
                로그인
            </button>
        </form>
    );
}

export default LoginForm;