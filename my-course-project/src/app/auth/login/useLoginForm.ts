

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginFormData } from "@/app/auth/login/types";
import { validateLoginForm } from "@/lib/validations/login.validation";
import { AuthService } from "@/services/auth.service";
import { useAuth } from "@/hooks/useAuth";
export const useLoginForm = (onClose: () => void) => {
  const router = useRouter();
  const { login, user } = useAuth();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof LoginFormData
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsError(false);
    setIsSuccess(false);

    
    const validation = validateLoginForm(formData);
    if (!validation.isValid) {
      setErrorMessage(validation.message!);
      setIsError(true);
      return;
    }

    setIsLoading(true);

    try {
      const data = await AuthService.login(formData);
      await login(data.user, data.accessToken, data.refreshToken);



      setIsSuccess(true);
      setIsError(false);

      setTimeout(() => {
        const savedUser = localStorage.getItem("user");
        const savedToken = localStorage.getItem("accessToken");
        

        
        onClose();
        onClose();
        const isAdmin = 
          data.user?.email === "admin@gmail.com" ||
          data.user?.role === "ADMIN" || 
          data.user?.role === "admin" ||
          (Array.isArray(data.user?.roles) && 
           data.user.roles.some((r: any) => 
             r && (
               r === "ADMIN" || 
               r === "admin" || 
               r?.name === "ADMIN" || 
               r?.name === "admin"
             )
           ));



        if (isAdmin) {

          router.push("/admin");
        } else {

          router.push("/");
        }
        router.refresh();
      }, 1500);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Đăng nhập thất bại, thử lại sau!";
      console.error("Login error:", error);
      setErrorMessage(message);
      setIsError(true);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const resetError = () => {
    setIsError(false);
    setErrorMessage("");
  };

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    try {
      await AuthService.loginWithSocial(provider);
      onClose();
    } catch (error) {
      console.error("Social login error:", error);
      setErrorMessage("Đăng nhập bằng mạng xã hội thất bại!");
      setIsError(true);
    }
  };

  return {
    formData,
    isLoading,
    isSuccess,
    isError,
    errorMessage,
    handleInputChange,
    handleSubmit,
    handleSocialLogin,
    resetError,
  };
};
