export interface Admin {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: "admin" | "editor" | "superadmin";
  createdAt: Date;
}
