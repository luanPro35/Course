"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import { User } from "@/types/user";
import Loading from "@/components/ui/Loading";
import {
  FaLink,
  FaGithub,
  FaLinkedin,
  FaFacebook,
  FaYoutube,
} from "react-icons/fa";

export default function PersonalPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loading></Loading>
      </div>
    );
  }

  const socialLinks = [
    { href: user.personalWebsite, icon: <FaLink />, label: "Website" },
    { href: user.github, icon: <FaGithub />, label: "GitHub" },
    { href: user.linkedin, icon: <FaLinkedin />, label: "LinkedIn" },
    { href: user.facebook, icon: <FaFacebook />, label: "Facebook" },
    { href: user.youtube, icon: <FaYoutube />, label: "YouTube" },
  ].filter((link) => link.href);

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-gray-200">
          <Image
            src={user.avatar || "/images/avatar.png"}
            alt={user.fullName || ""}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {user.fullName}
          </h1>
          {user.username && (
            <p className="text-md md:text-lg text-gray-500">@{user.username}</p>
          )}
          {user.email && (
            <p className="text-md md:text-lg text-gray-500">{user.email}</p>
          )}
          {user.about && (
            <p className="mt-4 text-gray-700 text-center md:text-left">
              {user.about}
            </p>
          )}
        </div>
      </div>

      {socialLinks.length > 0 && (
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-4 text-center md:text-left">
            Liên kết
          </h2>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={`https://www.google.com/search?q=${encodeURIComponent(
                  link.href || ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                {React.cloneElement(link.icon, { className: "w-5 h-5" })}
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
