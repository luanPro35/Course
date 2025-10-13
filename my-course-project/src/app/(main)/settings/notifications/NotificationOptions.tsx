"use client";
import React from "react";

type NotificationSettings = {
  commentReply: boolean;
  postReaction: boolean;
  commentReaction: boolean;
  blogComment: boolean;
  answerSelected: boolean;
};

interface NotificationOption {
  id: keyof NotificationSettings;
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface NotificationOptionsProps {
  notifications: NotificationOption[];
  settings: NotificationSettings;
  onToggle: (key: keyof NotificationSettings) => void;
}

export default function NotificationOptions({
  notifications,
  settings,
  onToggle,
}: NotificationOptionsProps) {
  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-start gap-4 flex-1">
            <div className="mt-1">{notification.icon}</div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                {notification.title}
              </h3>
              <p className="text-sm text-gray-600">
                {notification.description}
              </p>
            </div>
          </div>
          <button
            onClick={() => onToggle(notification.id)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
              settings[notification.id] ? "bg-teal-500" : "bg-gray-300"
            }`}
            role="switch"
            aria-checked={settings[notification.id]}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                settings[notification.id] ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      ))}
    </div>
  );
}

export type { NotificationSettings, NotificationOption };
