import { createSelector } from '@reduxjs/toolkit';
import { useAppSelector } from '../store/hooks';
import { RootState } from '../store/store';

const selectAuthState = (state: RootState) => state.user; // Указываем RootState

export const useAuth = () => {
  return useAppSelector(
    createSelector(selectAuthState, (user) => ({
      isAuth: user.isAuth,
      user: user.user || null,
    }))
  );
};
