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
