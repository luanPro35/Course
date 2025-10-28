import { CourseFree } from "@/types/courseFree";
import { User } from "@/types/user";

export const courseService = {
  async getMyCourses(userId: string): Promise<CourseFree[]> {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`);
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
