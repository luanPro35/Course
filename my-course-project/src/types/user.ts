export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password?: string; // Password can be optional for returned user objects
  createdAt: Date;
  updatedAt: Date;
}
