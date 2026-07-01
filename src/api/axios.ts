import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import type { AuthState } from "../types";

/**
 * [추가] axios의 요청 설정(config) 타입에 우리가 직접 쓰는 _retry
 * 플래그를 추가한 타입이에요. 원래 InternalAxiosRequestConfig엔
 * 이 필드가 없어서, 그냥 쓰면 "그런 속성 없다"는 타입 오류가 나요.
 * extends로 새 interface를 만들어서 우리만의 필드를 얹어요.
 */
interface RetryableRequestConfig extends InternalAxiosRequestConfig {

    _retry?: boolean;
}

const api = axios.create({
    
    baseURL: "http://localhost:8080",
    withCredentials: true,
});

api.interceptors.request.use((config) => {

    const stored = localStorage.getItem("auth");
    const token = stored ? (JSON.parse(stored) as { accessToken: string | null }).accessToken : null;
    if (token) {

        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(

    (response) => response,
    // [추가] error의 타입을 axios가 제공하는 AxiosError로 명시
    async (error: AxiosError) => {

        // [추가] as 키워드: "이 값은 이 타입이라고 내가 보장한다"는 의미예요.
        // error.config의 기본 타입엔 _retry가 없어서 우리가 만든
        // RetryableRequestConfig로 단언(assertion)해줘요.
        const originalRequest = error.config as RetryableRequestConfig;

        if (

            error.response?.status === 401 &&
            !originalRequest._retry &&
            // [추가] url의 타입이 string | undefined라서 ?. (옵셔널 체이닝) 필요
            !originalRequest.url?.includes("/api/users/reissue") &&
            !originalRequest.url?.includes("/api/users/login")
        ) {

            originalRequest._retry = true;

            try {

                // [추가] <string>: 재발급 응답의 본문이 토큰 문자열 하나라는 의미
                const response = await api.post<string>("/api/users/reissue");
                const newAccessToken = response.data;
                const stored = localStorage.getItem("auth");
                const currentAuth = stored
                    ? (JSON.parse(stored) as AuthState)
                    : { accessToken: null, userRole: null, userNickname: null };
                localStorage.setItem("auth", JSON.stringify({ ...currentAuth, accessToken: newAccessToken }));
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (reissueError) {

                localStorage.removeItem("accessToken");
                window.location.href = "/login";
                return Promise.reject(reissueError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;