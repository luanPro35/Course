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
      // First check if the profile exists
      const checkResponse = await fetch(`http://localhost:3001/users/${data.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!checkResponse.ok) {
        return {
          success: false,
          message: `Không tìm thấy người dùng với ID: ${data.id}`,
        };
      }
      
      // Check if profile exists in informations collection
      const profileCheckResponse = await fetch(`http://localhost:3001/informations?id=${data.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      const profileExists = await profileCheckResponse.json();
      
      // If profile exists, update it
      if (profileExists && profileExists.length > 0) {
        const response = await fetch(`http://localhost:3001/informations/${data.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        
        if (response.ok) {
          const result = await response.json();
          return {
            success: true,
            data: result as User,
          };
        }
      } else {
        // Create new profile if it doesn't exist
        const createResponse = await fetch("http://localhost:3001/informations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        
        if (createResponse.ok) {
          const createResult = await createResponse.json();
          return {
            success: true,
            data: createResult as User,
          };
        } else {
          return {
            success: false,
            message: "Không thể tạo hồ sơ mới",
          };
        }
      }

      // Nếu không vào các trường hợp trên, trả về lỗi
      return {
        success: false,
        message: "Không thể cập nhật hồ sơ, vui lòng thử lại sau",
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
      let response = await fetch(`http://localhost:3001/informations?id=${userId}`, {
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
        response = await fetch(`http://localhost:3001/users/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        if (response.ok) {
          const userData = await response.json();
          // Return basic user data when profile doesn't exist yet
          return {
            success: true,
            data: userData as User,
          };
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
