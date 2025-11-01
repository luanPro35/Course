import { User } from "../../types/user";
import { USER_API_URL } from "@/services/api.service";

export interface UpdateProfileData {
  id: string;
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
    if (!data.id) {
      return { success: false, message: "User ID is missing" };
    }
    try {
      const response = await fetch(`${USER_API_URL}/${data.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result as User,
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
      // First try to get the profile from the informations endpoint
      let response = await fetch(`${USER_API_URL}?id=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const profileData = await response.json();

        // Check if profile exists
        if (profileData && profileData.length > 0) {
          return {
            success: true,
            data: profileData[0] as User,
          };
        }
      }

      // If profile not found, try to get user info from users endpoint
      try {
        response = await fetch(`http://localhost:3001/users?id=${userId}`, {
          // Changed to query by ID
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const usersData = await response.json();
          const userData = usersData[0]; // Get the first user from the array
          // Return basic user data when profile doesn't exist yet
          if (userData) {
            return {
              success: true,
              data: userData as User,
            };
          } else {
            return {
              success: false,
              message: `Không tìm thấy người dùng với ID: ${userId}`,
            };
          }
        } else {
          // If both endpoints fail, return a more specific error
          return {
            success: false,
            message: `Không tìm thấy người dùng với ID: ${userId}`,
          };
        }
      } catch (userError) {
        // Handle network errors when fetching user data
        return {
          success: false,
          message: "Không thể kết nối đến máy chủ để lấy thông tin người dùng",
        };
      }
    } catch (error) {
      // This will catch JSON parsing errors and other unexpected issues
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
