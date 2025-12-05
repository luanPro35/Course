export const USER_API_URL = "http://localhost:8080/project";
export const PROFILE_API_URL = "http://localhost:8080/project/profile/update";
export const PROFILE_GET_API_URL = "http://localhost:8080/project/profile";
export const AVATAR_API_URL =
  "http://localhost:8080/project/profile/update-avatar";

export const PRO_API_URL =
  "http://localhost:8080/project/courses/published?page=0&size=100&sort=createdAt,desc";
export const FREE_API_URL =
  "http://localhost:8080/project/courses/published?page=0&size=3&sort=createdAt,desc";
export const getCourseByIdURL = (id: string) =>
  `http://localhost:8080/project/courses/${id}`;

export const getPublishedArticlesURL = (page: number, size: number) =>
  `http://localhost:8080/project/posts/published?page=${page}&size=${size}&sort=createdAt,desc`;
export const POSTS_API_URL = "http://localhost:8080/project/posts/create-post";
export const UPLOAD_IMAGE_POST_URL =
  "http://localhost:8080/project/posts/upload-thumbnail";
export const getMyPostsURL = (status: string, page: number, size: number) =>
  `http://localhost:8080/project/posts/my-posts?status=${status}&page=${page}&size=${size}&sort=createdAt,desc`;
export const getPostByIdURL = (id: string | number) =>
  `http://localhost:8080/project/posts/${id}`;

export const CREATE_COURSE_URL =
  "http://localhost:8080/project/admin/courses/create";
export const getCourseByAdminIdURL = (id: number) =>
  `http://localhost:8080/project/admin/courses/get/${id}`;
export const updateCourseByAdminURL = (id: number) =>
  `http://localhost:8080/project/admin/courses/update/${id}`;
export const deleteCourseByAdminURL = (id: number) =>
  `http://localhost:8080/project/admin/courses/delete/${id}`;
export const updateCourseStatusURL = (id: number, status: string) =>
  `http://localhost:8080/project/admin/courses/update-status/${id}?status=${status}`;
export const createPayment = "http://localhost:8080/project/payment/16";
export const enrollFreeCourse = "http://localhost:8080/project/enrollments/free";
export const enrollCourse = "http://localhost:8080/project/enrollments/courses";
export const getMyEnrolledCoursesURL = (page: number = 0, size: number = 100) =>
  `http://localhost:8080/project/enrollments/courses?page=${page}&size=${size}`;
export const getListOrderURL = (page: number, size: number) =>
  `http://localhost:8080/project/admin/orders?page=${page}&size=${size}&sort=createdAt,desc`;
export const refundMoneyURL = (orderId: number) =>
  `http://localhost:8080/project/payment/refund/${orderId}`;
export const checkOrderURL = (orderId: number) =>
  `http://localhost:8080/project/payment/${orderId}/status`;
export const getCoursesByStatusURL = (
  status: string,
  page: number,
  size: number
) =>
  `http://localhost:8080/project/admin/courses?status=${status}&page=${page}&size=${size}&sort=createdAt,desc`;
export const getAllCoursesAdminURL = (page: number, size: number) =>
  `http://localhost:8080/project/admin/courses?page=${page}&size=${size}&sort=createdAt,desc`;
export const getAllPostsAdminURL = (page: number, size: number) =>
  `http://localhost:8080/project/admin/posts?page=${page}&size=${size}&sort=createdAt,desc`;
export const getDashboardStatsURL = () =>
  `http://localhost:8080/project/admin/dashboard/stats`;
export const getAllUsersURL = (page: number, size: number) =>
  `http://localhost:8080/project/admin/users?page=${page}&size=${size}`;
export const deleteUserURL = (userId: number) =>
  `http://localhost:8080/project/admin/users/delete/${userId}`;
export const refreshTokenURL = "http://localhost:8080/project/auth/refresh-token";
export const GOOGLE_CLIENT_ID =
  "121852921364-eipdrl0m9a6qsft95htfdkn6t5dtmsov.apps.googleusercontent.com";
export const GOOGLE_REDIRECT_URI = "http://localhost:3000/oauth2/callback";
export const GOOGLE_AUTH_ENDPOINT =
  "https://accounts.google.com/o/oauth2/v2/auth";
export const GOOGLE_SCOPES = "openid profile email";

export const getGoogleAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: GOOGLE_SCOPES,
    access_type: "offline",
    prompt: "consent",
  });
  return `${GOOGLE_AUTH_ENDPOINT}?${params.toString()}`;
};

export const CALL_LOGIN_GG = getGoogleAuthUrl();
