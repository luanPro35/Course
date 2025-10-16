import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  iconBgColor?: string;
  iconColor?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  iconBgColor = "bg-gray-100",
  iconColor = "text-gray-700",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div
        className={`flex items-center justify-center w-12 h-12 ${iconBgColor} rounded-xl mb-4`}
      >
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>

      <p className="text-sm text-gray-600 mb-2">{title}</p>

      <div className="flex items-end justify-between">
        <h2 className="text-4xl font-bold text-gray-900">
          {typeof value === "number" ? value.toLocaleString() : value}
        </h2>

        {trend && (
          <span
            className={`text-sm font-semibold flex items-center ${
              trend.isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend.isPositive ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
