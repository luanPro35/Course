import type { CourseFree } from "@/types/courseFree";
import type { User } from "@/types/user";
import { USER_API_URL } from "@/services/api.service";

export const addCoursesToUser = async (userId: string, course: CourseFree) => {
  // 1. Fetch the existing user
  const user = await getUserById(userId);

  if (user.courses && user.courses.some((c) => c.id === course.id)) {
    alert("Bạn đã đăng kí khóa học này rồi");
    return;
  }

  // 2. Add the new course to the user's courses array
  const updatedCourses = user.courses ? [...user.courses, course] : [course];
  const updatedUser = { ...user, courses: updatedCourses };

  // 3. Send a PATCH request to update the user
  const res = await fetch(`${USER_API_URL}/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedUser),
  });

  if (!res.ok) {
    throw new Error(`Failed to add courses to user: ${res.statusText}`);
  }

  return res.json();
};

export const getUserById = async (id: string) => {
  const res = await fetch(`${USER_API_URL}/${id}`); // Fetch user by ID

  if (!res.ok) {
    throw new Error(`Failed to fetch user with id ${id}: ${res.statusText}`);
  }

  const user: User = await res.json();

  if (!user || typeof user.id === "undefined") {
    // Check if user is null/undefined or lacks an id
    throw new Error(
      `User with id ${id} not found or invalid user data received`
    );
  }

  return {
    ...user,
    courses: (user as User & { courses: CourseFree[] }).courses || [],
  };
};
