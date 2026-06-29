import { createContext, useContext, useState } from "react";
// [추가] ReactNode는 타입이라 import type, LoginResponse/AuthState는 우리가 만든 타입
import type { ReactNode } from "react";
import type { LoginResponse, AuthState } from "../types";

/**
 * [추가] AuthContextType
 * Context가 실제로 제공하는 값/함수들의 타입이에요.
 * Pebble에서 했던 것과 똑같은 패턴인데, Tangerine은 4단계 권한
 * 체계(USER/TRUSTED/MANAGER/ADMIN)라서 isAdmin과 isTrusted가
 * 둘 다 필요해요. (Pebble은 USER/ADMIN 2단계라 isAdmin 하나로 충분했어요)
 */
interface AuthContextType {

    isLoggedIn: boolean;
    isAdmin: boolean;
    isTrusted: boolean;
    userRole: string | null;
    userNickname: string | null;
    login: (data: LoginResponse) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// [추가] AuthProvider의 props 타입
interface AuthProviderProps {

    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {

    const [auth, setAuth] = useState<AuthState>(() => ({

        accessToken: localStorage.getItem("accessToken"),
        userRole: localStorage.getItem("role"),
        userNickname: localStorage.getItem("nickname"),
    }));

    // [추가] data의 타입을 LoginResponse로 명시
    const login = (data: LoginResponse) => {

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("role", data.role);
        localStorage.setItem("nickname", data.nickname);
        setAuth({

            accessToken: data.accessToken,
            userRole: data.role,
            userNickname: data.nickname,
        });
    };

    const logout = () => {

        localStorage.removeItem("accessToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userNickname");
        setAuth({

            accessToken: null,
            userRole: null,
            userNickname: null,
        });
    };

    const isLoggedIn = !!auth.accessToken;
    const isAdmin = auth.userRole === "ADMIN" || auth.userRole === "MANAGER";
    const isTrusted = isAdmin || auth.userRole === "TRUSTED";

    return (

        <AuthContext.Provider
            value={{

                isLoggedIn,
                isAdmin,
                isTrusted,
                userRole: auth.userRole,
                userNickname: auth.userNickname,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

/**
 * [추가] 반환 타입을 AuthContextType으로 명시했어요.
 * Pebble에서 했던 것처럼, Provider 바깥에서 잘못 호출하면
 * (context가 null인 채로) 바로 에러를 던지게 해서
 * "왜 undefined인지 모르겠다"는 식의 모호한 버그를 방지해요.
 */
export function useAuth(): AuthContextType {

    const context = useContext(AuthContext);
    if (!context) {

        throw new Error("useAuth는 AuthProvider 내부에서만 사용할 수 있어요.");
    }
    return context;
}