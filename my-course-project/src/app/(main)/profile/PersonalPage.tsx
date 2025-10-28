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
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
          <Image
            src={user.avatar || "/images/avatar.png"}
            alt={user.fullName || ""}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{user.fullName}</h1>
          {user.username && (
            <p className="text-lg text-gray-500">@{user.username}</p>
          )}
          {user.email && <p className="text-lg text-gray-500">{user.email}</p>}
          {user.about && <p className="mt-4 text-gray-700">{user.about}</p>}
        </div>
      </div>

      {socialLinks.length > 0 && (
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Liên kết</h2>
          <div className="flex flex-wrap gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
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
