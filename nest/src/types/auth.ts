import { SignOptions } from 'jsonwebtoken';

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userAgent?: string;
  role: string;
}
export interface LoginPayload {
  email: string;
  password: string;
  userAgent?: string;
}
export type SignOptionsAndSecret = SignOptions & {
  secret: string;
};

export interface ResetPasswordPayload {
  password: string;
  verificationCode: string;
}

export interface RefreshPayload {
  sessionId: string;
}

export enum UserRole {
  CLIENT = 'CLIENT',
  COACH = 'COACH',
}

export interface JwtPayload {
  id: string;
  sessionId: string;
  iat?: number;
  exp?: number;
}
