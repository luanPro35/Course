import { User } from "@/types/user";
import {
  PROFILE_API_URL,
  AVATAR_API_URL,
  PROFILE_GET_API_URL,
} from "@/services/api.service";

export const getProfile = async (
  userId: number,
  token: string
): Promise<User> => {
  try {
    const response = await fetch(`${PROFILE_GET_API_URL}?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const updateProfile = async (
  userId: number,
  profileData: Partial<User>,
  token: string
): Promise<User> => {
  try {
    const response = await fetch(PROFILE_API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: userId, ...profileData }),
    });
    if (!response.ok) {
      throw new Error("Failed to update profile");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const updateAvatar = async (
  userId: number,
  avatar: File,
  token: string
): Promise<User> => {
  try {
    const formData = new FormData();
    formData.append("file", avatar);

    const response = await fetch(AVATAR_API_URL, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update avatar: ${errorText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error updating avatar:", error);
    throw error;
  }
};
