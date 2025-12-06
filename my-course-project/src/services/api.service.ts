const BASE_API_URL = "http://localhost:8080/project";

export const USER_API_URL = BASE_API_URL;
export const PROFILE_API_URL = `${BASE_API_URL}/profile/update`;
export const PROFILE_GET_API_URL = `${BASE_API_URL}/profile`;
export const AVATAR_API_URL = `${BASE_API_URL}/profile/update-avatar`;

export const PRO_API_URL = `${BASE_API_URL}/courses/published?page=0&size=100&sort=createdAt,desc`;
export const FREE_API_URL = `${BASE_API_URL}/courses/published?page=0&size=3&sort=createdAt,desc`;
export const getCourseByIdURL = (id: string) => `${BASE_API_URL}/courses/${id}`;

export const getPublishedArticlesURL = (page: number, size: number) =>
  `${BASE_API_URL}/posts/published?page=${page}&size=${size}&sort=createdAt,desc`;
export const POSTS_API_URL = `${BASE_API_URL}/posts/create-post`;
export const UPLOAD_IMAGE_POST_URL = `${BASE_API_URL}/posts/upload-thumbnail`;
export const getMyPostsURL = (status: string, page: number, size: number) =>
  `${BASE_API_URL}/posts/my-posts?status=${status}&page=${page}&size=${size}&sort=createdAt,desc`;
export const getPostByIdURL = (id: string | number) =>
  `${BASE_API_URL}/posts/${id}`;

export const CREATE_COURSE_URL = `${BASE_API_URL}/admin/courses/create`;
export const getCourseByAdminIdURL = (id: number) =>
  `${BASE_API_URL}/admin/courses/get/${id}`;
export const updateCourseByAdminURL = (id: number) =>
  `${BASE_API_URL}/admin/courses/update/${id}`;
export const deleteCourseByAdminURL = (id: number) =>
  `${BASE_API_URL}/admin/courses/delete/${id}`;
export const updateCourseStatusURL = (id: number, status: string) =>
  `${BASE_API_URL}/admin/courses/update-status/${id}?status=${status}`;
export const createPayment = `${BASE_API_URL}/payment/16`;
export const enrollFreeCourse = `${BASE_API_URL}/enrollments/free`;
export const enrollCourse = `${BASE_API_URL}/enrollments/courses`;
export const getMyEnrolledCoursesURL = (page: number = 0, size: number = 100) =>
  `${BASE_API_URL}/enrollments/courses?page=${page}&size=${size}`;
export const getListOrderURL = (page: number, size: number) =>
  `${BASE_API_URL}/admin/orders?page=${page}&size=${size}&sort=createdAt,desc`;
export const refundMoneyURL = (orderId: number) =>
  `${BASE_API_URL}/payment/refund/${orderId}`;
export const checkOrderURL = (orderId: number) =>
  `${BASE_API_URL}/payment/${orderId}/status`;
export const getCoursesByStatusURL = (
  status: string,
  page: number,
  size: number
) =>
  `${BASE_API_URL}/admin/courses?status=${status}&page=${page}&size=${size}&sort=createdAt,desc`;
export const getAllCoursesAdminURL = (page: number, size: number) =>
  `${BASE_API_URL}/admin/courses?page=${page}&size=${size}&sort=createdAt,desc`;
export const getAllPostsAdminURL = (page: number, size: number) =>
  `${BASE_API_URL}/admin/posts?page=${page}&size=${size}&sort=createdAt,desc`;
export const getDashboardStatsURL = () =>
  `${BASE_API_URL}/admin/dashboard/stats`;
export const getAllUsersURL = (page: number, size: number) =>
  `${BASE_API_URL}/admin/users?page=${page}&size=${size}`;
export const deleteUserURL = (userId: number) =>
  `${BASE_API_URL}/admin/users/delete/${userId}`;
export const refreshTokenURL = `${BASE_API_URL}/auth/refresh-token`;
export const forgotPasswordURL = `${BASE_API_URL}/auth/forgot-password`;
export const resetPasswordURL = `${BASE_API_URL}/auth/reset-password`;
export const deleteAccountURL = `${BASE_API_URL}/auth`;
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
