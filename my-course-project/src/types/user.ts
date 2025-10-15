export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  password?: string; // Password can be optional for returned user objects
  createdAt: Date;
  updatedAt: Date;
  avatar?: string;
  username?: string;
  about?: string;
  personalWebsite?: string;
  github?: string;
  linkedin?: string;
  facebook?: string;
  youtube?: string;
  role?: "admin" | "user";
}
