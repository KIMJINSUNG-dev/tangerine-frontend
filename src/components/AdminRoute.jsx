import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// [추가] 로그인 여부뿐 아니라 관리자 등급까지 확인하는 라우트 보호 컴포넌트예요.
function AdminRoute({ children }) {

    const { isLoggedIn, isAdmin } = useAuth();

    if (!isLoggedIn) {

        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {

        // 로그인은 했지만 관리자가 아니면 홈으로 돌려보내요.
        return <Navigate to="/" replace />;
    }

    return children;
}

export default AdminRoute;