import { createContext, useContext, useState, useEffect } from "react";
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

const AUTH_KEY = "auth";

export function AuthProvider({ children }: AuthProviderProps) {

    const [auth, setAuth] = useState<AuthState>(() => {

        const stored = localStorage.getItem(AUTH_KEY);
        if (stored) {

            return JSON.parse(stored) as AuthState;
        }
        return { accessToken: null, userRole: null, userNickname: null };
    });

    // [추가] 다른 탭에서 localStorage가 변경될 때 AuthContext state를 동기화해요.
    // storage 이벤트는 "변경을 일으킨 탭 자신"에게는 발생하지 않고,
    // "같은 origin의 다른 탭"에게만 발생하는 브라우저 Web API예요.
    // 그래서 탭 B에서 로그인하면 탭 A가 이 이벤트를 받아서
    // 자신의 AuthContext state를 새로 갱신해요.
    useEffect(() => {

        const handleStorageChange = (e: StorageEvent) => {

            if (e.key === AUTH_KEY) {
                
                if (e.newValue) {

                    setAuth(JSON.parse(e.newValue) as AuthState);
                } else {

                    // 로그아웃 시 e.newValue가 null이에요
                    setAuth({ accessToken: null, userRole: null, userNickname: null });
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);

        // cleanup: 컴포넌트가 언마운트될 때 이벤트 리스너를 제거해요.
        // 제거하지 않으면 컴포넌트가 사라진 뒤에도 이벤트가 계속 감지돼요.
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // [추가] data의 타입을 LoginResponse로 명시
    const login = (data: LoginResponse) => {

        const newAuth: AuthState = {

            accessToken: data.accessToken,
            userRole: data.role,
            userNickname: data.nickname,
        };
        localStorage.setItem(AUTH_KEY, JSON.stringify(newAuth));
        setAuth(newAuth);
    };

    const logout = () => {

        localStorage.removeItem(AUTH_KEY);
        setAuth({ accessToken: null, userRole: null, userNickname: null });
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