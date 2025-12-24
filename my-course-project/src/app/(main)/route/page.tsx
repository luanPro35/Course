
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { route, learningRoutes } from "@/types/learningPath";

interface CardRouteProps {
  learning: route;
}


function CardRouteItem({ learning }: CardRouteProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow min-h-64">
      <div className="flex flex-col md:flex-row items-start gap-6">
        {}
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-3">{learning.title}</h3>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            {learning.content}
          </p>
          <Link href={learning.url}>
            <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-2 px-6 rounded uppercase transition-colors">
              Xem chi tiết
            </button>
          </Link>
        </div>

        {}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 relative">
            <Image
              src={learning.image}
              alt={learning.title}
              width={128}
              height={128}
              className="rounded-full object-cover border-4 border-orange-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}


export default function Path() {
  return (
    <div className="max-w-7xl p-4 md:p-6 md:ml-9">
      {}
      <div className="mb-16 md:mb-32 max-w-4xl">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pb-6">
          Lộ trình học
        </h1>
        <p className="text-black text-base leading-relaxed">
          Để bắt đầu một cách thuận lợi, bạn nên tập trung vào một lộ trình học.
          Ví dụ: Để đi làm với vị trí &quot;Lập trình viên Front-end&quot; bạn
          nên tập trung vào lộ trình &quot;Front-end&quot;.
        </p>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20 max-w-5xl">
        {learningRoutes.map((route: route) => (
          <CardRouteItem key={route.id} learning={route} />
        ))}
      </div>

      {}
      <div className="bg-white p-6 text-left max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {}
          <div className="pr-0 md:pr-8 w-full md:w-[500px]">
            <h3 className="text-2xl font-bold mb-5">
              Tham gia cộng đồng học viên LearnX trên Facebook
            </h3>
            <p className="text-gray-600 text-lg  mb-5 leading-relaxed">
              Hàng nghìn người khác đang học lộ trình giống như bạn. Hãy tham
              gia hỏi đáp, chia sẻ và hỗ trợ nhau trong quá trình học nhé.
            </p>
            <a
              href="#"
              className="inline-block bg-white border border-black-300 hover:bg-gray-50 text-gray-700 text-lg font-semibold py-2 px-6 rounded-3xl transition-colors"
            >
              Tham gia nhóm
            </a>
          </div>

          {}
          <div className="w-full h-full flex items-center justify-end">
            <div className="relative w-full h-[300px] md:h-[700px]">
              <Image
                src="/images/Route.png"
                alt="Facebook Community"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
