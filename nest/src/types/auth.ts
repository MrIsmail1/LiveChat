import { SignOptions } from 'jsonwebtoken';

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userAgent?: string;
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
