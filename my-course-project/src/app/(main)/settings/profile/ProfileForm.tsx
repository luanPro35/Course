"use client";

import React from "react";
import {
  useProfileForm,
  ProfileFormData,
} from "@/app/(main)/settings/profile/useProfileForm";
import Loading from "@/components/ui/Loading";
import { User } from "@/types/user";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

export default function ProfileForm() {
  const {
    user,
    form,
    loading,
    handleSubmit,
    handleInputChange,
    handleAvatarChange,
  } = useProfileForm();

  if (!user && loading) {
    return <Loading />;
  }
  if (!user) {
    return <div>Đang tải thông tin người dùng...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Thông tin cá nhân</h2>
        <p className="text-gray-500 mt-2">Quản lý thông tin cá nhân của bạn.</p>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Thông tin cơ bản</h3>
        <p className="text-gray-500 text-sm mb-4">
          Quản lý tên hiển thị, tên người dùng, bio và avatar của bạn.
        </p>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="mb-4">
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700"
            >
              Họ và tên
            </label>
            <Input
              id="fullName"
              name="fullName"
              value={form.fullName}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="about"
              className="block text-sm font-medium text-gray-700"
            >
              Giới thiệu
            </label>
            <Textarea
              id="about"
              name="about"
              value={form.about}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <label
              htmlFor="avatar"
              className="block text-sm font-medium text-gray-700"
            >
              Avatar
            </label>
            <div className="mt-1 flex items-center">
              <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                <Image
                  src={form.avatar || "/placeholder-avatar.svg"}
                  alt="Avatar"
                  width={48}
                  height={48}
                />
              </span>
              <Input
                id="avatar"
                name="avatar"
                type="file"
                onChange={handleAvatarChange}
                className="ml-4"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Thông tin mạng xã hội</h3>
        <p className="text-gray-500 text-sm mb-4">
          Quản lý liên kết tới các trang mạng xã hội của bạn.
        </p>
        <div className="border border-gray-200 rounded-lg p-4 space-y-4">
          <div>
            <label
              htmlFor="personalWebsite"
              className="block text-sm font-medium text-gray-700"
            >
              Trang web cá nhân
            </label>
            <Input
              id="personalWebsite"
              name="personalWebsite"
              value={form.personalWebsite}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <label
              htmlFor="github"
              className="block text-sm font-medium text-gray-700"
            >
              GitHub
            </label>
            <Input
              id="github"
              name="github"
              value={form.github}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <label
              htmlFor="linkedin"
              className="block text-sm font-medium text-gray-700"
            >
              LinkedIn
            </label>
            <Input
              id="linkedin"
              name="linkedin"
              value={form.linkedin}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <label
              htmlFor="facebook"
              className="block text-sm font-medium text-gray-700"
            >
              Facebook
            </label>
            <Input
              id="facebook"
              name="facebook"
              value={form.facebook}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <label
              htmlFor="youtube"
              className="block text-sm font-medium text-gray-700"
            >
              YouTube
            </label>
            <Input
              id="youtube"
              name="youtube"
              value={form.youtube}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 mb-8">
        <div className="p-4">
          <div className="text-sm font-medium text-gray-900">Email</div>
          <div className="text-sm text-gray-500 mt-1">{user?.email}</div>
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Đang lưu..." : "Lưu lại"}
      </Button>
    </form>
  );
}
