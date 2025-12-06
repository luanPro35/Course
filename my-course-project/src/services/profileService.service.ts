import { User } from "@/types/user";
import {
  PROFILE_API_URL,
  AVATAR_API_URL,
  PROFILE_GET_API_URL,
} from "@/services/api.service";
import api from "@/lib/validations/axios";

export const getProfile = async (
  userId: number
): Promise<User> => {
  try {
    const response = await api.get(`${PROFILE_GET_API_URL}?userId=${userId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const updateProfile = async (
  userId: number,
  profileData: Partial<User>
): Promise<User> => {
  try {
    const response = await api.put(PROFILE_API_URL, {
      id: userId,
      ...profileData,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const updateAvatar = async (
  userId: number,
  avatar: File
): Promise<User> => {
  try {
    const formData = new FormData();
    formData.append("file", avatar);

    const response = await api.patch(AVATAR_API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data;
  } catch (error) {
    console.error("Error updating avatar:", error);
    throw error;
  }
};
