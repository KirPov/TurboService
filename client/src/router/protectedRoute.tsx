import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { UserRole } from "../types/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {
  const { isAuth, user, isLoading } = useAppSelector((state) => state.user);
  const location = useLocation();
  console.log(user);

  // ⏳ Пока грузится пользователь
  if (isLoading) {
    return <div>Загрузка...</div>; // Можете заменить на спиннер
  }

  // ❌ Если пользователь не авторизован
  if (!isAuth) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // 🚫 Если у пользователя нет доступа
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Пользователь авторизован и имеет доступ
  return <>{children}</>;
};
