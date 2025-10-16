import { LucideIcon } from "lucide-react";

export interface DashboardProps {
  totalUsers: number;
  totalCourses: number;
  totalOrders: number;
}

export interface StatItem {
  id: string;
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  iconBgColor?: string;
  iconColor?: string;
}
