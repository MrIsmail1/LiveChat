import { nestAPI } from "@/config/apiClient";
import {
  LoginSchema,
  PasswordResetSchema,
  RegisterSchema,
} from "@/schemas/authSchema";
import { registerResponse, User } from "@/types/auth";

export const login = async (data: LoginSchema) =>
  nestAPI.post("/auth/login", data);

export const register = async (data: RegisterSchema) =>
  await nestAPI.post("/auth/register", data);

export const verifyEmail = async (verificationCode: string) =>
  nestAPI.get<{ message: string }>(`/auth/email/verify/${verificationCode}`);

export const sendPasswordResetEmail = async (email: string) =>
  nestAPI.post<{ message: string }>("/auth/password/forgot", { email });

export const resetPassword = async (data: PasswordResetSchema) =>
  nestAPI.post<{ message: string }>("/auth/password/reset", data);

export const logout = () => nestAPI.get<{ message: string }>("/auth/logout");

export const getUser = async (): Promise<User> =>
  await nestAPI.get<User, User>("/users/profile");

export const usersList = async () => nestAPI.get<User[], User[]>("/users");
