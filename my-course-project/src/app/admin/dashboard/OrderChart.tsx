"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface OrderData {
  month: string;
  totalOrders: number;
}

interface OrderChartProps {
  data: OrderData[];
}

export default function OrderChart({ data }: OrderChartProps) {
  return (
    <div className="w-full h-[400px] bg-white shadow-lg p-4 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">
        Biểu đồ đơn hàng theo tháng
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          hart
          data={data}
          margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip />
          {/* @ts-expect-error Recharts Legend type issue */}
          <Legend />
          <Bar
            dataKey="totalOrders"
            fill="#3b82f6"
            name="Tổng khóa học"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
