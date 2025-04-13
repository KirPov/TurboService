import { motion } from "framer-motion";
import React, { FC, useState } from "react";
import { FaCarAlt, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthService } from "../Serv/auth.service";
import { setTokenToLocalStorage } from "../helpers/localstorage.helper";
import { useAppDispatch } from "../store/hooks";
import { login } from "../store/user/userSlice";
import { UserRole } from "../types/types";

const Auth: FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const redirectByRole = (role: UserRole) => {
    switch (role) {
      case "ADMIN":
        return "/admin";
      case "MANAGER":
        return "/manager";
      case "SERVICE_EMPLOYEE":
        return "/service";
      case "CLIENT":
      default:
        return "/";
    }
  };

  const authHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const response = await AuthService.login({ email, password });

        if (response?.token && response?.user) {
          const { role } = response.user;

          dispatch(
            login({
              token: response.token,
              user: {
                id: response.user.id,
                email: response.user.email,
                role: role,
              },
            })
          );

          setTokenToLocalStorage(response.token);
          toast.success("Вы успешно вошли");

          navigate(redirectByRole(role));
        }
      } else {
        const response = await AuthService.register({
          email,
          password,
          role: "CLIENT",
        });

        if (response) {
          toast.success("Аккаунт создан! Войдите в систему");
          setIsLogin(true);
        }
      }
    } catch (err) {
      localStorage.removeItem("token");
      const error = err instanceof Error ? err.message : "Ошибка авторизации";
      toast.error(error);
      console.error("Auth error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 text-center">
            <motion.div whileHover={{ scale: 1.05 }} className="inline-block">
              <FaCarAlt className="text-white text-4xl mx-auto mb-2" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white">
              {isLogin ? "Вход в TURBOSERVICE" : "Регистрация"}
            </h2>
          </div>

          <form onSubmit={authHandler} className="p-8 space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Пароль
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                isLoading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              }`}
            >
              {isLoading ? (
                "Загрузка..."
              ) : isLogin ? (
                <>
                  <FaSignInAlt className="inline mr-2" />
                  Войти
                </>
              ) : (
                <>
                  <FaUserPlus className="inline mr-2" />
                  Зарегистрироваться
                </>
              )}
            </motion.button>
          </form>

          <div className="px-8 pb-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
            >
              {isLogin
                ? "Нет аккаунта? Зарегистрируйтесь"
                : "Уже есть аккаунт? Войдите"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
