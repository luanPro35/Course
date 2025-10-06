"use client";

import React from "react";
import { useAuth } from "@/content/AuthContent";
import Image from "next/image";
import dynamic from "next/dynamic";
import { User } from "../../types/user";

// Dynamically import the CalendarHeatmap component with SSR turned off
const CalendarHeatmap = dynamic(
  () => import("react-github-contribution-calendar"),
  {
    ssr: false,
    loading: () => (
      <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <p>Loading calendar...</p>
      </div>
    ),
  }
);

// Helper function to generate random contribution data
const generateRandomData = (
  startDate: Date,
  endDate: Date
): { [date: string]: number } => {
  const data: { [date: string]: number } = {};
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    if (Math.random() > 0.5) {
      // 50% chance to have a contribution
      data[currentDate.toISOString().split("T")[0]] =
        Math.floor(Math.random() * 5) + 1; // Random count from 1 to 5
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return data;
};

// UserInfo sub-component
const UserInfo: React.FC<{ user: User | null }> = ({ user }) => (
  <div className="flex items-center gap-4 p-4 border-b border-gray-200">
    <Image
      src={user?.avatar || "/images/avatar.png"} // Fallback to a default avatar
      alt={user?.fullName || "User Avatar"}
      width={50}
      height={50}
      className="rounded-full object-cover"
      priority // Prioritize loading the user avatar
    />
    <div>
      <p className="font-bold text-lg text-gray-800">{user?.fullName}</p>
      <p className="text-sm text-gray-500">{user?.email}</p>
    </div>
  </div>
);

// ContributionCalendar sub-component
const ContributionCalendar = () => {
  const until = new Date();
  const from = new Date();
  from.setFullYear(from.getFullYear() - 1);

  const values = generateRandomData(from, until);

  return (
    <div className="p-4">
      <h3 className="font-semibold text-gray-700 mb-3">Lịch sử hoạt động</h3>
      <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <CalendarHeatmap
          values={values}
          until={until.toISOString().split("T")[0]}
          panelColors={["#EEEEEE", "#d6e685", "#8cc665", "#44a340", "#1e6823"]}
          weekLabelAttributes={{}}
          monthLabelAttributes={{}}
          panelAttributes={{}}
        />
      </div>
    </div>
  );
};

// Main PersonalPage component
export default function PersonalPage() {
  const { user } = useAuth();

  return (
    <div className="bg-gray-50 min-h-full">
      <UserInfo user={user} />
      <ContributionCalendar />
    </div>
  );
}
