import { CourseFree } from "@/types/courseFree";
import { User } from "@/types/user";
import { USER_API_URL } from "@/services/api.service";
export const courseService = {
  async getMyCourses(userId: string): Promise<CourseFree[]> {
    try {
      const response = await fetch(`${USER_API_URL}/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const user: User = await response.json();
      return user.courses || [];
    } catch (error) {
      console.error("Error fetching my courses:", error);
      return [];
    }
  },
};
