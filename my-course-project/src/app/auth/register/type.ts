export type RegisterFormData = {
  name: string; 
  phone: string;
  email: string;
  password?: string;
  confirmPassword?: string;
};

export type RegisterResponse = {
  mess: string;
  success?: boolean;
  data?: unknown;
};

export type RegisterFormProps = {
  onClose: () => void;
  onSwitchToLogin: () => void;
};
