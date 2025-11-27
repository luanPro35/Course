import type { CourseFree } from "@/types/courseFree";
import type { User } from "@/types/user";
import { USER_API_URL } from "@/services/api.service";

export const addCoursesToUser = async (userId: string, course: CourseFree) => {
  
  const user = await getUserById(userId);

  if (user.courses && user.courses.some((c) => c.id === course.id)) {
    alert("Bạn đã đăng kí khóa học này rồi");
    return;
  }

  
  const updatedCourses = user.courses ? [...user.courses, course] : [course];
  const updatedUser = { ...user, courses: updatedCourses };

  
  const token = localStorage.getItem("accessToken");

  
  const res = await fetch(`${USER_API_URL}/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(updatedUser),
  });

  if (!res.ok) {
    throw new Error(`Failed to add courses to user: ${res.statusText}`);
  }

  return res.json();
};

export const getUserById = async (id: string) => {
  const token = localStorage.getItem("accessToken");
  
  const res = await fetch(`${USER_API_URL}/${id}`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch user with id ${id}: ${res.statusText}`);
  }

  const user: User = await res.json();

  if (!user || typeof user.id === "undefined") {
    throw new Error(
      `User with id ${id} not found or invalid user data received`
    );
  }

  return {
    ...user,
    courses: (user as User & { courses: CourseFree[] }).courses || [],
  };
};
