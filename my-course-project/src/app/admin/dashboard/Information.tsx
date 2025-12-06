import React from "react";
import { Users, Package, BookOpen } from "lucide-react"; 
import StatCard from "./StatCard";
import { DashboardProps, StatItem } from "./dashboard.types";

export default function Information({
  totalOrders,
  totalUsers,
  totalCourses, 
}: DashboardProps) {
  const statsData: StatItem[] = [
    {
      id: "customers",
      title: "Customers",
      value: totalUsers,
      icon: Users,
      trend: {
        isPositive: true,
      },
      iconBgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      id: "orders",
      title: "Orders",
      value: totalOrders,
      icon: Package,
      trend: {
        isPositive: false,
      },
      iconBgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[200px]">
      {statsData.map((stat) => (
        <StatCard
          key={stat.id}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          trend={stat.trend}
          iconBgColor={stat.iconBgColor}
          iconColor={stat.iconColor}
        />
      ))}
    </div>
  );
}
