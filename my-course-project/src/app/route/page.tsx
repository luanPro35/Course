// File: src/app/route/page.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";

// Interface và data
export interface route {
  id: number;
  title: string;
  image: string;
  content: string;
  url: string;
}

export const learningRoutes: route[] = [
  {
    id: 1,
    title: "Lộ trình học Front-end",
    content:
      "Lập trình viên Front-end là người xây dựng ra giao diện websites. Trong phần này F8 sẽ chia sẻ cho bạn lộ trình để trở thành lập trình viên Front-end nhé.",
    image: "/images/Route.png",
    url: "/courses/front-end",
  },
  {
    id: 2,
    title: "Lộ trình học Back-end",
    content:
      "Trái với Front-end thì Back-end là phần code chạy trên máy chủ, đây là phần xử lý các nghiệp vụ logic của website. Trong phần này F8 sẽ chia sẻ cho bạn lộ trình để trở thành lập trình viên Back-end nhé.",
    image: "/images/Route.png",
    url: "/courses/back-end",
  },
];

// Component con
function CardRouteItem({ learning }: { learning: route }) {
  return (
    <div className="p-4">
      <div className="mb-8">
        <div>
          <h3 className="text-2xl font-semibold mb-2">{learning.title}</h3>
          <p className="text-gray-700 mb-4">{learning.content}</p>
        </div>
        <Image
          src={learning.image}
          alt={learning.title}
          width={320}
          height={180}
          className="w-full h-40 object-cover"
        />
        <Link href={learning.url}>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
            XEM CHI TIẾT
          </button>
        </Link>
      </div>
    </div>
  );
}

// Component chính (Page)
export default function Page() {
  return (
    <div className="p-4">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Lộ trình học</h2>
        <p className="text-lg text-gray-600">
          Để bắt đầu một cách thuận lợi, bạn nên tập trung vào một lộ trình học.
          Ví dụ: Để đi làm với vị trí &#34;Lập trình viên Front-end&#34; bạn nên
          tập trung vào lộ trình &#34;Front-end&#34;.
        </p>
      </div>

      {/* Render tất cả routes */}
      {learningRoutes.map((route) => (
        <CardRouteItem key={route.id} learning={route} />
      ))}

      <div className="mt-8 bg-gray-100 p-6 rounded-lg shadow-md">
        <div>
          <h3 className="text-2xl font-bold mb-3">
            Tham gia cộng đồng học viên F8 trên Facebook
          </h3>
          <p className="text-gray-700 mb-4">
            Hàng nghìn người khác đang học lộ trình giống như bạn. Hãy tham gia
            hỏi đáp, chia sẻ và hỗ trợ nhau trong quá trình học nhé.
          </p>
          <a href="#" className="text-blue-500 hover:underline font-semibold">
            Tham gia nhóm
          </a>
        </div>
      </div>
    </div>
  );
}
