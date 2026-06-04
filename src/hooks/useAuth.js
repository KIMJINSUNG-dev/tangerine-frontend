export function useAuth() {

    const accessToken = localStorage.getItem("accessToken");
    const userRole = localStorage.getItem("userRole");
    const userNickname = localStorage.getItem("userNickname");

    const isLoggedIn = !!accessToken;
    const isAdmin = userRole === "ADMIN" || userRole === "MANAGER";
    const isTrusted = isAdmin || userRole === "TRUSTED";

    return { isLoggedIn, isAdmin, isTrusted, userRole, userNickname };
}