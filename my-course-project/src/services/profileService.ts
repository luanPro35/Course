import { User } from "../types/user";

export interface UpdateProfileData {
  id: number;
  fullName: string;
  about: string;
  avatar: string;
  personalWebsite: string;
  github: string;
  linkedin: string;
  facebook: string;
  youtube: string;
}

interface ProfileResponse {
  success: boolean;
  message?: string;
  data?: User;
}

export const profileService = {
  updateProfile: async (data: Partial<User>): Promise<ProfileResponse> => {
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: data.id,
          fullName: data.fullName ?? "",
          avatar: data.avatar ?? "",
          about: data.about ?? "",
          personalWebsite: data.personalWebsite ?? "",
          github: data.github ?? "",
          linkedin: data.linkedin ?? "",
          facebook: data.facebook ?? "",
          youtube: data.youtube ?? "",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Cập nhật thất bại");
      }

      return {
        success: true,
        data: result.data as User,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Đã xảy ra lỗi không mong muốn",
      };
    }
  },

  getProfile: async (userId: string): Promise<ProfileResponse> => {
    try {
      const response = await fetch(`/api/profile/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Lấy thông tin thất bại");
      }

      return {
        success: true,
        data: result.data as User,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Đã xảy ra lỗi không mong muốn",
      };
    }
  },
};
