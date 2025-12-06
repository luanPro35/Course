export const BLOG_CATEGORIES = [
  { value: "REACT_NATIVE", label: "React Native" },
  { value: "DEVOPS", label: "DevOps" },
  { value: "CPP", label: "C++" },
  { value: "JAVASCRIPT", label: "JavaScript" },
  { value: "PYTHON", label: "Python" },
];

export const FORM_VALIDATION = {
  AUTHOR_MIN_LENGTH: 2,
  TITLE_MIN_LENGTH: 10,
  CONTENT_MIN_LENGTH: 50,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, 
} as const;

export const TIPS = [
  "Tiêu đề nên ngắn gọn, súc tích và thu hút",
  "Nội dung nên có cấu trúc rõ ràng",
  "Thêm ví dụ thực tế để tăng tính thuyết phục",
  "Sử dụng ảnh chất lượng cao",
];
