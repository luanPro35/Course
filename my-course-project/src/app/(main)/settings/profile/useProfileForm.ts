import { useState, useEffect, ChangeEvent } from "react";
import { useAuth } from "@/content/AuthContent";
import { profileService } from "@/services/profileService";
import { savePersonalInfo } from "@/services/personal.service";
import { User } from "@/types/user";
import { Information } from "@/types/information.types";

export interface ProfileFormData {
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
  const { user, setUser } = useAuth();
  const [form, setForm] = useState<ProfileFormData>({
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
      if (user?.id) {
        setLoading(true);
        try {
          // The user.id might be a number, but the service expects a string.
          const profileData = await profileService.getProfile(String(user.id));
          if (profileData.success && profileData.data) {
            setUser(profileData.data);
            setForm({
              fullName: profileData.data.fullName || "",
              about: profileData.data.about || "",
              avatar: profileData.data.avatar || "",
              personalWebsite: profileData.data.personalWebsite || "",
              github: profileData.data.github || "",
              linkedin: profileData.data.linkedin || "",
              facebook: profileData.data.facebook || "",
              youtube: profileData.data.youtube || "",
            });
          }
        } catch (error) {
          console.error("Failed to fetch profile:", error);
          setError("Không thể tải hồ sơ.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [user?.id, setUser]);

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
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Cập nhật ảnh đại diện thất bại");
      }

      if (data.success && data.path) {
        // Cập nhật avatar trong form
        setForm((prevForm) => ({
          ...prevForm,
          avatar: data.path,
        }));
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Đã xảy ra lỗi không mong muốn.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
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

      // Cập nhật dữ liệu người dùng trong context
      setUser(result.data);

      // Cập nhật form với toàn bộ dữ liệu từ kết quả API
      setForm({
        fullName: result.data.fullName || "",
        about: result.data.about || "",
        avatar: result.data.avatar || "",
        personalWebsite: result.data.personalWebsite || "",
        github: result.data.github || "",
        linkedin: result.data.linkedin || "",
        facebook: result.data.facebook || "",
        youtube: result.data.youtube || "",
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

    if (!user) return;

    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      const payload: Partial<User> = {
        id: user.id,
        ...form,
      };

      // 1. Gửi dữ liệu lên server để cập nhật profile
      const result = await profileService.updateProfile(payload);

      if (!result.success || !result.data) {
        throw new Error(result.message || "Cập nhật hồ sơ thất bại.");
      }

      // 2. Lưu thông tin vào Data Information
      const personalInfo: Information = {
        fullName: form.fullName,
        avatar: form.avatar,
        about: form.about,
        personalWebsite: form.personalWebsite,
        github: form.github,
        linkedin: form.linkedin,
        facebook: form.facebook,
        youtube: form.youtube,
      };

      // Gọi API để lưu thông tin cá nhân (không block nếu thất bại)
      try {
        const personalResult = await savePersonalInfo(personalInfo);
        if (!personalResult.success) {
          console.warn(
            "Lưu thông tin cá nhân thất bại:",
            personalResult.message
          );
        }
      } catch (personalErr) {
        console.warn("Lỗi khi lưu thông tin cá nhân:", personalErr);
      }

      // Cập nhật dữ liệu người dùng trong context
      setUser(result.data);

      // Cập nhật form với toàn bộ dữ liệu từ kết quả API
      setForm({
        fullName: result.data.fullName || "",
        about: result.data.about || "",
        avatar: form.avatar || "",
        personalWebsite: result.data.personalWebsite || "",
        github: result.data.github || "",
        linkedin: result.data.linkedin || "",
        facebook: result.data.facebook || "",
        youtube: result.data.youtube || "",
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
