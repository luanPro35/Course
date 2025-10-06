export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginFormProps {
  onClose: () => void;
  onSwitchToRegister: () => void;
}

import { User } from "../../../types/user";

export interface LoginResponse {
  mess?: string;
  success?: boolean;
  token?: string;
  user?: User;
}
