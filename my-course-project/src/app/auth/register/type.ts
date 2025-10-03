export interface RegisterFormData {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterFormProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export interface RegisterResponse {
  mess: string;
  success?: boolean;
}
