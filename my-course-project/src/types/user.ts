export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  password?: string; // Password can be optional for returned user objects
  createdAt: Date;
  updatedAt: Date;
  avatar?: string;
}
