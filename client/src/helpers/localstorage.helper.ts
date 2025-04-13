import { key } from "localforage"
import { IUser } from "../types/types"

export const getTokenFromLocalStorage = (): string | null => {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);  // Для отладки
    return token;
  };

export function setTokenToLocalStorage(token: string): void {
    localStorage.setItem('token', JSON.stringify(token));
  }
  

export function removeTokenFromLocalStorage(key: string): void {
    localStorage.removeItem(key)
}

export function setUserToLocalStorage(user: IUser): void {
    localStorage.setItem('user', JSON.stringify(user));
}

export const getUserFromLocalStorage = (): IUser | null => {
    const user = localStorage.getItem('user');
    console.log('User from localStorage:', user);  // Для отладки
    return user ? JSON.parse(user) : null;
  };

export function removeUserFromLocalStorage(): void {
    localStorage.removeItem('user');
  }

  export function setAuthTimeToLocalStorage(): void {
    const currentTime = new Date().getTime(); // Текущее время в миллисекундах
    localStorage.setItem('authTime', JSON.stringify(currentTime));
}



