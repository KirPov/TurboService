import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../types/types";

interface UserState {
  user: IUser | null;
  token: string | null;
  isAuth: boolean;
  isLoading: boolean;
}

const initialState: UserState = {
  user: null,
  token: null,
  isAuth: false,
  isLoading: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{
        token: string;
        user: IUser;
      }>
    ) {
      console.log("login payload:", action.payload.user);
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuth = true;
      state.isLoading = false;
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuth = false;
      state.isLoading = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
});

export const { login, logout, setLoading } = userSlice.actions;
export default userSlice.reducer;
