export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  CLIENT = 'CLIENT',
  SERVICE_EMPLOYEE = 'SERVICE_EMPLOYEE',
}

export type UserRole = keyof typeof Role; // Для TypeScript типизации
