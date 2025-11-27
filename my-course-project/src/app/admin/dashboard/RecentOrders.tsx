import React from "react";
import { CoursePro } from "@/types/coursePro";
import Image from "next/image";

interface RecentOrdersProps {
  orders: CoursePro[];
}

const RecentOrders = ({ orders }: RecentOrdersProps) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Đơn hàng gần đây
        </h2>
        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
          Xem tất cả
        </button>
      </div>

      {}
      <div className="max-h-[200px] overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-white">
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                Sản phẩm
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                Giá tiền
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: CoursePro, index: number) => (
              <tr
                key={order.id}
                className={`border-b border-gray-100 hover:bg-gray-50 transition ${
                  index === orders.length - 1 ? "border-b-0" : ""
                }`}
              >
                <td className="py-4 px-2">
                  <div className="flex items-center gap-3">
                    <Image
                      src={order.image}
                      alt={order.title}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <p className="font-medium text-gray-900">{order.title}</p>
                  </div>
                </td>
                <td className="py-4 px-2">
                  <span className="font-medium text-gray-900">
                    {order.price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
