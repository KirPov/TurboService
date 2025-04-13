export type UserRole = 'ADMIN' | 'MANAGER' | 'CLIENT' | 'SERVICE_EMPLOYEE';

export interface IUser {
  id: number;
  email: string;
  role: UserRole;
}

export interface IAuthResponse {
  user: IUser;
  token: string;
}
