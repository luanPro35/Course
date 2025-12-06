"use client";
import React, { useState } from "react";
import TabButton from "@/app/admin/TabButton";
import FreeCourseForm from "./forms/FreeCourseForm";
import ProCourseForm from "./forms/ProCourseForm";
import VideoForm from "./forms/VideoForm";

type TabType = "free" | "pro" | "video";

export default function ManagerPosts() {
  const [activeTab, setActiveTab] = useState<TabType>("free");

  const tabs = [
    { id: "free" as TabType, label: "Đăng khóa học Free" },
    { id: "pro" as TabType, label: "Đăng khóa học Pro" },
    { id: "video" as TabType, label: "Đăng video" },
  ];

  return (
    <div className="p-8">
      <div className="flex gap-4 mb-8">
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </TabButton>
        ))}
      </div>

      {activeTab === "free" && <FreeCourseForm onSuccess={() => {}} />}
      {activeTab === "pro" && <ProCourseForm onSuccess={() => {}} />}
      {activeTab === "video" && <VideoForm />}
    </div>
  );
}
