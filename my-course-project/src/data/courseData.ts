import { CourseDataType } from "@/types/course";

export const courseData: CourseDataType = {
  "html-css": {
    badge: {
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      icon: "🌐",
      text: "HTML & CSS",
    },
    headerColor: "text-blue-600",
    title: {
      mainText: "Xây Dựng Giao Diện Website Với",
      highlightText: "HTML & CSS",
      gradientFrom: "from-blue-400",
      gradientVia: "via-blue-500",
      gradientTo: "to-blue-600",
    },
    subtitle: {
      text: "Nắm vững các kiến thức cơ bản và nâng cao về HTML và CSS để tạo ra các trang web đẹp và chuyên nghiệp.",
      highlights: [
        { value: "HTML5" },
        { value: "CSS3" },
        { value: "Responsive Design" },
      ],
    },
    codePreview: {
      bgGradientFrom: "from-blue-500",
      bgGradientTo: "to-blue-700",
      isDarkMode: true,
      codeLines: [
        { color: "text-pink-400", code: `<!DOCTYPE html>` },
        { color: "text-gray-400", code: `<html lang="en">` },
        { color: "text-gray-400", indent: 20, code: `<head>` },
        { color: "text-green-400", indent: 40, code: `<meta charset="UTF-8">` },
        {
          color: "text-green-400",
          indent: 40,
          code: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`,
        },
        { color: "text-green-400", indent: 40, code: `<title>My Page</title>` },
        { color: "text-gray-400", indent: 20, code: `</head>` },
        { color: "text-gray-400", indent: 20, code: `<body>` },
        {
          color: "text-yellow-400",
          indent: 40,
          code: `<h1>Hello, World!</h1>`,
        },
        { color: "text-gray-400", indent: 20, code: `</body>` },
        { color: "text-gray-400", code: `</html>` },
      ],
    },
    stats: [
      { value: "10+", label: "Bài học" },
      { value: "50+", label: "Thực hành" },
      { value: "100%", label: "Hoàn thành" },
      { value: "24/7", label: "Hỗ trợ" },
    ],
    learningPoints: [
      "Nắm vững cú pháp HTML5 và CSS3.",
      "Xây dựng giao diện web responsive.",
      "Sử dụng Flexbox và Grid hiệu quả.",
      "Tối ưu hóa hiệu suất tải trang.",
      "Tạo hiệu ứng động với CSS.",
      "Hiểu về quy trình thiết kế web.",
    ],
  },
  "javascript-pro": {
    badge: {
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      icon: "⚡",
      text: "JavaScript Pro",
    },
    headerColor: "text-yellow-600",
    title: {
      mainText: "Làm Chủ Lập Trình",
      highlightText: "JavaScript Nâng Cao",
      gradientFrom: "from-yellow-400",
      gradientVia: "via-yellow-500",
      gradientTo: "to-yellow-600",
    },
    subtitle: {
      text: "Đi sâu vào các khái niệm JavaScript phức tạp, tối ưu hóa hiệu suất và xây dựng ứng dụng mạnh mẽ.",
      highlights: [
        { value: "ES6+" },
        { value: "Async/Await" },
        { value: "Design Patterns" },
      ],
    },
    codePreview: {
      bgGradientFrom: "from-yellow-500",
      bgGradientTo: "to-yellow-700",
      isDarkMode: true,
      codeLines: [
        { color: "text-pink-400", code: "const fetchData = async () => {" },
        { color: "text-gray-400", indent: 20, code: "try {" },
        {
          color: "text-green-400",
          indent: 40,
          code: "const response = await fetch('/api/data');",
        },
        {
          color: "text-green-400",
          indent: 40,
          code: "const data = await response.json();",
        },
        { color: "text-yellow-400", indent: 40, code: "console.log(data);" },
        { color: "text-gray-400", indent: 20, code: "} catch (error) {" },
        {
          color: "text-red-400",
          indent: 40,
          code: "console.error('Error fetching data:', error);",
        },
        { color: "text-gray-400", indent: 20, code: "}" },
        { color: "text-pink-400", code: "};" },
        { color: "text-yellow-400", code: "fetchData();" },
      ],
    },
    stats: [
      { value: "15+", label: "Bài học" },
      { value: "70+", label: "Thực hành" },
      { value: "95%", label: "Hiệu suất" },
      { value: "Chuyên gia", label: "Hỗ trợ" },
    ],
    learningPoints: [
      "Hiểu sâu về JavaScript ES6+.",
      "Làm việc với Async/Await và Promises.",
      "Áp dụng các Design Patterns.",
      "Tối ưu hóa mã nguồn JavaScript.",
      "Xây dựng ứng dụng React/Next.js.",
      "Kiểm thử và Debug ứng dụng.",
    ],
  },
};
