import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [auth, setAuth] = useState(() => ({

        accessToken: localStorage.getItem("accessToken"),
        userRole: localStorage.getItem("userRole"),
        userNickname: localStorage.getItem("userNickname"),
    }));

    const login = (data) => {

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("userNickname", data.nickname);
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

export function useAuth() {

    return useContext(AuthContext);
}