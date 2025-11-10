import { useState, useEffect, ChangeEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  getProfile,
  updateProfile,
  updateAvatar,
} from "@/services/profileService.service";
import { User } from "@/types/user";

export interface ProfileFormData {
  name: string;
  fullName: string;
  about: string;
  avatar: string;
  personalWebsite: string;
  github: string;
  linkedin: string;
  facebook: string;
  youtube: string;
}

export function useProfileForm() {
  const { user, setUser, token } = useAuth();
  const [form, setForm] = useState<ProfileFormData>({
    name: "",
    fullName: "",
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

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.id && token) {
        setLoading(true);
        try {
          const profileData = await getProfile(Number(user.id), token);
          // Giữ lại email từ user hiện tại vì backend không trả về email
          setUser({
            ...profileData,
            email: user.email,
          });
          setForm({
            name: profileData.fullName || "",
            fullName: profileData.fullName || "",
            about: profileData.about || "",
            avatar: profileData.avatar || "",
            personalWebsite: profileData.personalWebsite || "",
            github: profileData.github || "",
            linkedin: profileData.linkedin || "",
            facebook: profileData.facebook || "",
            youtube: profileData.youtube || "",
          });
        } catch (error) {
          console.error("Failed to fetch profile:", error);
          setError("Không thể tải hồ sơ.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [user?.id, setUser, token]);

  const handleFieldClick = (fieldName: string) => {
    setEditingField(fieldName);
    setTempValue(form[fieldName as keyof ProfileFormData] || "");
  };

  const handleClose = () => {
    setEditingField(null);
  };

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

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user || !token) {
      return;
    }

    const file = e.target.files[0];

    setLoading(true);
    setError("");

    try {
      const updatedUser = await updateAvatar(Number(user.id), file, token);
      // Cập nhật user, giữ lại email
      setUser({
        ...updatedUser,
        email: user.email,
      });
      setForm((prevForm) => ({
        ...prevForm,
        avatar: updatedUser.avatar || "",
      }));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Đã xảy ra lỗi không mong muốn.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateField = async (fieldName: string, value: string) => {
    if (!user || !token) {
      return;
    }

    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      const payload: Partial<User> = {
        [fieldName]: value,
      };

      const updatedUser = await updateProfile(Number(user.id), payload, token);

      // Cập nhật dữ liệu người dùng trong context, giữ lại email
      setUser({
        ...updatedUser,
        email: user.email,
      });

      // Cập nhật form với toàn bộ dữ liệu từ kết quả API
      setForm({
        name: updatedUser.fullName || "",
        fullName: updatedUser.fullName || "",
        about: updatedUser.about || "",
        avatar: updatedUser.avatar || "",
        personalWebsite: updatedUser.personalWebsite || "",
        github: updatedUser.github || "",
        linkedin: updatedUser.linkedin || "",
        facebook: updatedUser.facebook || "",
        youtube: updatedUser.youtube || "",
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        handleClose();
      }, 1000);
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
    e.preventDefault();

    if (!user || !token) return;

    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      const payload: Partial<User> = {
        ...form,
        email: user.email,
      };

      // 1. Gửi dữ liệu lên server để cập nhật profile
      const updatedUser = await updateProfile(Number(user.id), payload, token);

      // Cập nhật user, giữ lại email
      setUser({
        ...updatedUser,
        email: user.email,
      });

      // Cập nhật form với toàn bộ dữ liệu từ kết quả API
      setForm({
        name: updatedUser.fullName || "",
        fullName: updatedUser.fullName || "",
        about: updatedUser.about || "",
        avatar: form.avatar || "",
        personalWebsite: updatedUser.personalWebsite || "",
        github: updatedUser.github || "",
        linkedin: updatedUser.linkedin || "",
        facebook: updatedUser.facebook || "",
        youtube: updatedUser.youtube || "",
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        handleClose();
      }, 1000);
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
    handleInputChange,
    handleAvatarChange,
    handleUpdateField,
  };
}
