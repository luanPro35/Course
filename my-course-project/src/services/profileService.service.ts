import { User } from "@/types/user";

const PROFILE_API_URL = "http://localhost:3001/profile";

export const getProfile = async (userId: number): Promise<User> => {
  try {
    const response = await fetch(`${PROFILE_API_URL}?userId=${userId}`);
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
  profileData: Partial<User>
): Promise<User> => {
  try {
    const response = await fetch(PROFILE_API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
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
