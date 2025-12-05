import React from "react";
import ProfileForm from "./ProfileForm";

export default function ProfilePage() {

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Thông tin cá nhân</h1>
      <p className="text-gray-600 mb-6">
        Quản lý thông tin cá nhân của bạn, bao gồm tên, giới thiệu và avatar.
      </p>
      <ProfileForm />
    </div>
  );
}
