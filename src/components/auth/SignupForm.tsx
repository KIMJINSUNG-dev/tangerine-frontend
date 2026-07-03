import { useState } from "react";
import type { AxiosError } from "axios";
import api from "../../api/axios";

interface SignupFormProps {

    onSignupSuccess: () => void;
}

function SignupForm({ onSignupSuccess }: SignupFormProps) {

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [nickname, setNickname] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {

        e.preventDefault();
        setError("");
        try {

            await api.post("/api/users/signup", { email, password, nickname });
            onSignupSuccess();
        } catch (err) {

            const message = (err as AxiosError<string>).response?.data;
            setError(message || "회원가입 중 오류가 발생했어요.");
        }
    };

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
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    닉네임
                </label>
                <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="닉네임을 입력하세요"
                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors"
                />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
                type="submit"
                className="py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors"
            >
                회원가입
            </button>
        </form>
    );
}

export default SignupForm;