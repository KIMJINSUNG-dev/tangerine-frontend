import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

interface AdminRouteProps {

    children: ReactNode;
}

function AdminRoute({ children }: AdminRouteProps) {

    const { isLoggedIn, isAdmin } = useAuth();

    if (!isLoggedIn) {

        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {

        return <Navigate to="/" replace />;
    }

    return children;
}

export default AdminRoute;