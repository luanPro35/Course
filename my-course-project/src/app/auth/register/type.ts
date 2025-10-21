export type RegisterFormData = {
  name: string; // Đổi từ fullName thành name
  phone: string;
  email: string;
  password?: string;
  confirmPassword?: string;
};

export type RegisterResponse = {
  mess: string;
  success?: boolean;
};

export type RegisterFormProps = {
  onClose: () => void;
  onSwitchToLogin: () => void;
};
