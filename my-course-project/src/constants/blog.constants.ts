export const BLOG_CATEGORIES = [
  { value: "react-native", label: "React Native" },
  { value: "devops", label: "DevOps" },
  { value: "cpp", label: "C++" },
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "ui-ux", label: "UI/UX Design" },
  { value: "marketing", label: "Marketing" },
  { value: "business", label: "Kinh doanh" },
];

export const FORM_VALIDATION = {
  AUTHOR_MIN_LENGTH: 2,
  TITLE_MIN_LENGTH: 10,
  CONTENT_MIN_LENGTH: 50,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
} as const;

export const TIPS = [
  "Tiêu đề nên ngắn gọn, súc tích và thu hút",
  "Nội dung nên có cấu trúc rõ ràng",
  "Thêm ví dụ thực tế để tăng tính thuyết phục",
  "Sử dụng ảnh chất lượng cao",
];
