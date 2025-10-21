"use client";

import React, { useState } from "react";
import { RecentOrder } from "@/types/recentOrders.types";
import Image from "next/image";
import { BookOpen, Video, FileText, Trophy } from "lucide-react";

interface CoursesPageProps {
  totalProducts: number;
}

const tabs = [
  { id: "pro", label: "Khóa học Pro", icon: Trophy },
  { id: "regular", label: "Khóa học miễn phí", icon: BookOpen },
  { id: "video", label: "Video", icon: Video },
  { id: "article", label: "Bài viết", icon: FileText },
];

const sampleData: Record<string, RecentOrder[]> = {
  pro: [
    {
      id: 1,
      image: "/course1.jpg",
      coursesName: "React Advanced Pro",
      category: "Khóa học Pro",
      price: 2999000,
      orderDate: "2024-01-15",
      status: "Active",
    },
    {
      id: 2,
      image: "/course2.jpg",
      coursesName: "Next.js Master Pro",
      category: "Khóa học Pro",
      price: 3499000,
      orderDate: "2024-01-20",
      status: "Active",
    },
    {
      id: 3,
      image: "/course3.jpg",
      coursesName: "TypeScript Pro",
      category: "Khóa học Pro",
      price: 2799000,
      orderDate: "2024-01-25",
      status: "Active",
    },
  ],
  regular: [
    {
      id: 4,
      image: "/course4.jpg",
      coursesName: "HTML CSS Căn bản",
      category: "Khóa học thường",
      price: 499000,
      orderDate: "2024-02-01",
      status: "Active",
    },
    {
      id: 5,
      image: "/course5.jpg",
      coursesName: "JavaScript Cơ bản",
      category: "Khóa học thường",
      price: 699000,
      orderDate: "2024-02-05",
      status: "Active",
    },
    {
      id: 6,
      image: "/course6.jpg",
      coursesName: "React Cơ bản",
      category: "Khóa học thường",
      price: 899000,
      orderDate: "2024-02-10",
      status: "Active",
    },
  ],
  video: [
    {
      id: 7,
      image: "/video1.jpg",
      coursesName: "10 Tips React Performance",
      category: "Video",
      price: 0,
      orderDate: "2024-02-15",
      status: "Published",
    },
    {
      id: 8,
      image: "/video2.jpg",
      coursesName: "Cách sử dụng Hooks hiệu quả",
      category: "Video",
      price: 0,
      orderDate: "2024-02-18",
      status: "Published",
    },
    {
      id: 9,
      image: "/video3.jpg",
      coursesName: "Deploy Next.js lên Vercel",
      category: "Video",
      price: 0,
      orderDate: "2024-02-20",
      status: "Published",
    },
  ],
  article: [
    {
      id: 10,
      image: "/article1.jpg",
      coursesName: "Tổng quan về React Server Components",
      category: "Bài viết",
      price: 0,
      orderDate: "2024-02-22",
      status: "Published",
    },
    {
      id: 11,
      image: "/article2.jpg",
      coursesName: "10 Pattern React nâng cao",
      category: "Bài viết",
      price: 0,
      orderDate: "2024-02-25",
      status: "Draft",
    },
    {
      id: 12,
      image: "/article3.jpg",
      coursesName: "State Management với Zustand",
      category: "Bài viết",
      price: 0,
      orderDate: "2024-02-28",
      status: "Published",
    },
  ],
};

export default function CoursesPage({ totalProducts }: CoursesPageProps) {
  const [activeTab, setActiveTab] = useState("pro");

  const currentData = sampleData[activeTab] || [];

  return (
    <div className="p-6">
      <div className="mb-6">
        <p className="text-2xl font-bold text-gray-900">
          Tổng số khóa học: {totalProducts}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <div className="flex space-x-1 p-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                    activeTab === tab.id
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                    Tên khóa học
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                    Loại
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                    Giá
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                    Ngày tạo
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition ${
                      index === currentData.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <Image
                          src={item.image}
                          alt={item.coursesName}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-200"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.coursesName}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-2">
                      <span className="text-gray-700">{item.category}</span>
                    </td>

                    <td className="py-4 px-2">
                      <span className="font-medium text-gray-900">
                        {item.price > 0
                          ? `${item.price.toLocaleString("vi-VN")}đ`
                          : "Miễn phí"}
                      </span>
                    </td>

                    <td className="py-4 px-2">
                      <span className="text-gray-600 text-sm">
                        {item.orderDate}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {currentData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Chưa có dữ liệu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
