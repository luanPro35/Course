export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginFormProps {
  onClose: () => void;
  onSwitchToRegister: () => void;
  onSwitchToForgot: () => void;
}

import { User } from "../../../types/user";

export interface LoginResponse {
  mess: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}
