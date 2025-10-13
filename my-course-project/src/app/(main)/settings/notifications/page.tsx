"use client";
import React, { useState } from "react";
import { MessageCircle, Heart } from "lucide-react";
import NotificationOptions, {
  NotificationSettings,
  NotificationOption,
} from "./NotificationOptions";

export default function Page() {
  const [settings, setSettings] = useState<NotificationSettings>({
    commentReply: true,
    postReaction: true,
    commentReaction: true,
    blogComment: true,
    answerSelected: true,
  });

  const toggleSetting = (key: keyof NotificationSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const notifications: NotificationOption[] = [
    {
      id: "commentReply",
      icon: <MessageCircle className="w-6 h-6 text-gray-600" />,
      title: "Phản hồi bình luận",
      description: "Nhận thông báo khi có người trả lời bình luận của bạn",
    },
    {
      id: "postReaction",
      icon: <Heart className="w-6 h-6 text-gray-600" />,
      title: "Reaction bài viết",
      description: "Nhận thông báo khi có người react bài viết của bạn",
    },
    {
      id: "commentReaction",
      icon: <Heart className="w-6 h-6 text-gray-600" />,
      title: "Reaction bình luận",
      description: "Nhận thông báo khi có người react bình luận của bạn",
    },
    {
      id: "blogComment",
      icon: <MessageCircle className="w-6 h-6 text-gray-600" />,
      title: "Bình luận blog",
      description: "Nhận thông báo khi có người bình luận bài viết của bạn",
    },
    {
      id: "answerSelected",
      icon: <MessageCircle className="w-6 h-6 text-gray-600" />,
      title: "Câu trả lời được chọn",
      description: "Nhận thông báo khi câu trả lời của bạn được chọn là đáp án",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Thông báo tương tác
        </h1>
        <p className="text-gray-600">
          Các thông báo về hoạt động tương tác trên nền tảng.
        </p>
      </div>

      <NotificationOptions
        notifications={notifications}
        settings={settings}
        onToggle={toggleSetting}
      />
    </div>
  );
}
