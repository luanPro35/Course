import { useState, useEffect, ChangeEvent } from "react";
import { useAuth } from "@/content/AuthContent";
import { profileService } from "@/services/profileService";
import { User } from "@/types/user";

// Giữ nguyên interface ProfileFormData
export interface ProfileFormData {
  fullName: string;
  username: string;
  about: string;
  avatar: string;
  personalWebsite: string;
  github: string;
  linkedin: string;
  facebook: string;
  youtube: string;
}

export function useProfileForm() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState<ProfileFormData>({
    fullName: "",
    username: "",
    about: "",
    avatar: "",
    personalWebsite: "",
    github: "",
    linkedin: "",
    facebook: "",
    youtube: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");

  const handleFieldClick = (fieldName: string) => {
    setEditingField(fieldName);
    setTempValue(form[fieldName as keyof ProfileFormData] || "");
  };

  const handleClose = () => {
    setEditingField(null);
  };

  // Khởi tạo form với dữ liệu người dùng
  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || "",
        username: user.username || "",
        about: user.about || "",
        avatar: user.avatar || "",
        personalWebsite: user.personalWebsite || "",
        github: user.github || "",
        linkedin: user.linkedin || "",
        facebook: user.facebook || "",
        youtube: user.youtube || "",
      });
    }
  }, [user]);

  // Hàm xử lý khi người dùng nhập liệu
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleUpdateField = async (fieldName: string, value: string) => {
    if (!user) {
      return;
    }
    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      const payload: Partial<User> = {
        id: user.id,
        [fieldName]: value,
      };

      const result = await profileService.updateProfile(payload);

      if (!result.success || !result.data) {
        throw new Error(result.message || "Cập nhật thất bại");
      }

      setUser(result.data);
      setForm((prev) => ({
        ...prev,
        [fieldName]: value,
      }));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000); // Tự động ẩn sau 2 giây
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Đã xảy ra lỗi không mong muốn.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý khi submit toàn bộ form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Ngăn form submit theo cách truyền thống
    if (!user) return;

    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      const payload: Partial<User> = {
        id: user.id,
        ...form,
      };

      // 1. Gửi dữ liệu lên server
      const result = await profileService.updateProfile(payload);

      if (!result.success || !result.data) {
        throw new Error(result.message || "Cập nhật hồ sơ thất bại.");
      }

      setUser(result.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000); // Tự động ẩn sau 2 giây
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Đã xảy ra lỗi không mong muốn.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    form,
    loading,
    success,
    error,
    editingField,
    tempValue,
    setTempValue,
    handleSubmit,
    handleFieldClick,
    handleClose,
  };
}
