export const USER_API_URL = "http://localhost:8080/project"; // call server BE
export const TOP_VIDEO_API_URL = "http://localhost:3001/topVideos";
export const PROFILE_API_URL = "http://localhost:8080/project/profile/update";
export const PROFILE_GET_API_URL = "http://localhost:8080/project/profile";
export const AVATAR_API_URL =
  "http://localhost:8080/project/profile/update-avatar";
export const TRENDING_API_URL = "http://localhost:3001/trending";
export const PRO_API_URL = "http://localhost:3001/coursesPro";
export const FREE_API_URL = "http://localhost:3001/coursesFree";
export const BLOG_BASE_URL = "http://localhost:3001/blogs";
export const getPublishedArticlesURL = (page: number, size: number) =>
  `http://localhost:8080/project/posts/published?page=${page}&size=${size}&sort=createdAt,desc`;
export const POSTS_API_URL = "http://localhost:8080/project/posts/create-post";
export const UPLOAD_IMAGE_POST_URL =
  "http://localhost:8080/project/posts/upload-thumbnail";
export const getMyPostsURL = (status: string, page: number, size: number) =>
  `http://localhost:8080/project/posts/my-posts?status=${status}&page=${page}&size=${size}&sort=createdAt,desc`;
export const getPostByIdURL = (id: string | number) =>
  `http://localhost:8080/project/posts/${id}`;
export const GOOGLE_CLIENT_ID = "121852921364-eipdrl0m9a6qsft95htfdkn6t5dtmsov.apps.googleusercontent.com";
export const GOOGLE_REDIRECT_URI = "http://localhost:3000/oauth2/callback";
export const GOOGLE_AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
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
