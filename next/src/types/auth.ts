export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface registerResponse {
  refreshToken: string;
  accessToken: string;
  user: User;
}
