import { instance } from "../api/axios.api";
import { IAuthResponse, IUser, IUserData, UserRole } from "../types/types";

export const AuthService = {
  async login(userData: IUserData): Promise<IAuthResponse> {
    try {
      const { data } = await instance.post<IAuthResponse>(
        "auth/login",
        userData
      );

      // Сохраняем токен и данные в localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      return data;
    } catch (error) {
      console.error("Login error: ", error);
      throw error;
    }
  },

  async register(
    userData: IUserData & { role: UserRole }
  ): Promise<IAuthResponse> {
    try {
      const { data } = await instance.post<IAuthResponse>(
        "auth/register",
        userData
      );

      // Сохраняем токен и данные в localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      return data;
    } catch (error) {
      console.error("Registration error: ", error);
      throw error;
    }
  },

  async getProfile(): Promise<IUser> {
    try {
      const { data } = await instance.get<IUser>("user");
      console.log("Profile data:", data); // Для отладки
      return data;
    } catch (error) {
      console.error("Error getting profile:", error);
      throw error;
    }
  },

  logout() {
    // Удаляем токен и данные пользователя из localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};
