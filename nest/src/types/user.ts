export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
