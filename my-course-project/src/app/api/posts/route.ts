import { NextResponse } from "next/server";

export async function GET() {
  const posts = [
    {
      id: 1,
      author: "Huyền Lê Ngọc",
      title:
        "TRẢI NGHIỆM HỌC THỬ REACT NATIVE, DEVOPS, C++ VÔ CÙNG CHẤT LƯỢNG CÙNG F8",
      content:
        "Để giúp học viên mới cảm nhận rõ ràng chất lượng giảng dạy, F8 đã xây dựng 3 lớp học thử: C++, React Native và DevOps với lộ trình rõ ràng.",
      category: "React Native",
      timeAgo: "một tháng trước",
      readTime: "2 phút đọc",
      image: "/images/posts-1.png",
    },
    {
      id: 2,
      author: "Hoàng Tuấn 12A1 40.Võ",
      title:
        "Giới thiệu về ngành Công Nghệ Thông Tin và Những Kiến Thức Cơ Bản Bắt Buộc Phải Học",
      content:
        "Ngành Công Nghệ Thông Tin (CNTT) là một lĩnh vực đang phát triển mạnh mẽ và có vai trò quan trọng trong hầu hết mọi mặt của đời...",
      category: "hoc-lap-trinh",
      timeAgo: "3 tháng trước",
      readTime: "3 phút đọc",
      image: "/images/posts-2.png",
    },
    {
      id: 3,
      author: "Hoàng Tuấn 12A1 40.Võ",
      title: 'SOLID – 5 nguyên lý "vàng" giúp viết code sạch và dễ bảo trì',
      content:
        "Trong hành trình phát triển phần mềm, chắc hẳn bạn đã từng gặp phải những đoạn code dài, khó hiểu và rất khó mở rộng hay sửa chữa....",
      category: "OOP",
      timeAgo: "3 tháng trước",
      readTime: "3 phút đọc",
      image: "/images/posts-3.png",
    },
    {
      id: 4,
      author: "Hải Đoàn",
      title:
        "[HTML - CSS - JS tại F8] Một thời mày mò học, lục lại được trang web cũ – chia sẻ cùng anh em",
      content:
        "[HTML - CSS - JS tại F8] Một thời mày mò học, lục lại được trang web cũ – chia sẻ cùng anh em",
      category: "Javascript",
      timeAgo: "5 tháng trước",
      readTime: "2 phút đọc",
      image: "/images/posts-4.png",
    },
    {
      id: 5,
      author: "Sơn Đặng",
      title:
        'Hoàng Bảo Trung - Học viên tiêu biểu của F8 tỏa sáng với dự án "AI Powered Learning"',
      content:
        "Trong thời đại công nghệ số 4.0, việc học không còn bó buộc trong những cuốn sách truyền thống. Giờ đây, trí tuệ nhân tạo (AI) đang...",
      category: "ReactJS",
      timeAgo: "một năm trước",
      readTime: "6 phút đọc",
      image: "/images/posts-5.png",
    },
    {
      id: 6,
      author: "Lý Cao Nguyên",
      title:
        "Mình đã làm thế nào để hoàn thành một dự án website chỉ trong 15 ngày",
      content:
        "Xin chào mọi người mình là Lý Cao Nguyên, mình đã làm một dự án website front-end với hơn 100 bài học và 200 bài viết. Bài viết này...",
      category: "Front-end",
      timeAgo: "một năm trước",
      readTime: "4 phút đọc",
      image: "/images/posts-6.png",
    },
    {
      id: 7,
      author: "Lý Cao Nguyên",
      title: "Thư cảm ơn gửi đến anh Sơn",
      content:
        "Xin chào mọi người và anh Sơn. Em tên là Lý Cao Nguyên Vào năm 2022 em có vô tình lướt thấy những video dạy học của anh trên...",
      category: "",
      timeAgo: "một năm trước",
      readTime: "2 phút đọc",
      image: "/images/posts-7.png",
    },
    {
      id: 8,
      author: "Evich Tran",
      title: "Config Zsh bằng Oh-my-zsh và P10k trên WSL cực ngầu ✨",
      content:
        "Hello anh em , thì như blog trước mình có nói rằng mình ko có dùng Ubuntu, nhưng sao lại có...",
      category: "Ubuntu",
      timeAgo: "một năm trước",
      readTime: "4 phút đọc",
      image: "/images/posts-8.png",
    },
    {
      id: 9,
      author: "Hòa Nguyễn Thanh",
      title: 'LÀ THÀNH VIÊN CỦA F8. BẠN ĐÃ THỰC SỰ SỬ DỤNG "F8" HIỆU QUẢ CHƯA?',
      content:
        "F8 sẽ đưa bạn đến chính xác từng vị trí xảy ra vấn đề. F8 là phím tắt mặc định trong VScode các bạn nhé (không phải cài thêm bất cứ Extensions nào)",
      category: "",
      timeAgo: "2 năm trước",
      readTime: "12 phút đọc",
      image: "/images/posts-9.png",
    },
    {
      id: 10,
      author: "Trọng Nam Đoàn",
      title:
        "Tôi đã viết Chrome extension đầu tiên của mình bằng Github Copilot như thế nào?",
      content:
        "Câu chuyện của tôi là Tôi đang học tiếng Nhật trên một trang web là Dungmori.com, và tôi học từ mới trên trang web Quizlet. Và tôi...",
      category: "Javascript",
      timeAgo: "2 năm trước",
      readTime: "5 phút đọc",
      image: "/images/posts-10.png",
    },
    {
      id: 11,
      author: "Trọng Nam Đoàn",
      title:
        "Tôi đã viết Chrome extension đầu tiên của mình bằng Github Copilot như thế nào?",
      content:
        "Câu chuyện của tôi là Tôi đang học tiếng Nhật trên một trang web là Dungmori.com, và tôi học từ mới trên trang web Quizlet. Và tôi...",
      category: "Javascript",
      timeAgo: "2 năm trước",
      readTime: "5 phút đọc",
      image: "/images/posts-10.png",
    },
  ];

  return NextResponse.json(posts);
}
