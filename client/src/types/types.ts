export type UserRole = 'ADMIN' | 'MANAGER' | 'CLIENT' | 'SERVICE_EMPLOYEE';

export interface IUser {
  id: number;
  email: string;
  role: UserRole;
  name: string;
  phone: string; // Используем конкретный тип
}

export interface IUserData {
  email: string;
  password: string;
}

export interface IAuthResponse {
    user: {
      id: number;
      email: string;
      role: UserRole; // Было: role: IUser (ошибка!)
      createdAt?: string;
      updatedAt?: string;
    };
    token: string;
  }

export interface IProfileResponse {
  id: number;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}