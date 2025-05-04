import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getTokenFromLocalStorage,
  getUserFromLocalStorage,
} from "./helpers/localstorage.helper";
import { router } from "./router/router";
import { AuthService } from "./Serv/auth.service";
import { useAppDispatch } from "./store/hooks";
import { login, logout, setLoading } from "./store/user/userSlice";

function App() {
  const dispatch = useAppDispatch();

  const checkAuth = async () => {
    const token = getTokenFromLocalStorage();
    const user = getUserFromLocalStorage();

    if (!token || !user) {
      dispatch(logout());
      return;
    }

    try {
      const profileData = await AuthService.getProfile();

      if (!user || !user.id || !user.email || !user.role) {
        throw new Error("Невалидный профиль");
      }

      console.log("cheack:", profileData);
      dispatch(
        login({
          token: token,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            name: "",
            phone: ""
          },
        })
      );
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch(logout());
      toast.error("Ошибка авторизации. Войдите снова");
      console.error("Auth check error:", error);
    }
  };

  useEffect(() => {
    dispatch(setLoading(true));
    checkAuth();
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
