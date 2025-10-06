// components/auth/login/types.ts

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginFormProps {
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export interface LoginResponse {
  mess?: string;
  success?: boolean;
  token?: string;
  user?: User;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}
