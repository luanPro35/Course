"use client";

import React from "react";
import { ProfileField } from "@/app/(main)/settings/profile/ProfileField";
import { AvatarField } from "@/app/(main)/settings/profile/AvatarField";
import { EditModal } from "@/app/(main)/settings/profile/EditModal";
import {
  useProfileForm,
  ProfileFormData,
} from "@/app/(main)/settings/profile/useProfileForm";
import { fieldConfigs } from "@/app/(main)/settings/profile/fieldConfig";
import Loading from "@/components/ui/Loading";
import { User } from "@/types/user";

interface ProfileFormHookResult {
  user: User | null;
  form: ProfileFormData;
  loading: boolean;
  success: boolean;
  error: string;
  editingField: string | null;
  tempValue: string;
  setTempValue: (value: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleFieldClick: (fieldName: string) => void;
  handleClose: () => void;
}

export default function ProfileForm() {
  const {
    user,
    form,
    loading,
    success,
    error,
    editingField,
    tempValue,
    setTempValue,
    handleSubmit,
    handleFieldClick,
    handleClose,
  } = useProfileForm() as ProfileFormHookResult;

  if (!user && loading) {
    return <Loading />;
  }
  if (!user) {
    return <div>Đang tải thông tin người dùng...</div>;
  }

  const currentFieldConfig = editingField ? fieldConfigs[editingField] : null;

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Thông tin cá nhân</h2>
        <p className="text-gray-500 mt-2">Quản lý thông tin cá nhân của bạn.</p>
      </div>

      {/* Thông tin cơ bản */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Thông tin cơ bản</h3>
        <p className="text-gray-500 text-sm mb-4">
          Quản lý tên hiển thị, tên người dùng, bio và avatar của bạn.
        </p>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <ProfileField
            label="Họ và tên"
            value={form.fullName}
            fieldName="fullName"
            onClick={handleFieldClick}
          />
          <ProfileField
            label="Giới thiệu"
            value={form.about}
            fieldName="about"
            onClick={handleFieldClick}
          />
          <AvatarField
            avatar={form.avatar}
            onClick={() => handleFieldClick("avatar")}
          />
        </div>
      </div>

      {/* Thông tin mạng xã hội */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Thông tin mạng xã hội</h3>
        <p className="text-gray-500 text-sm mb-4">
          Quản lý liên kết tới các trang mạng xã hội của bạn.
        </p>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <ProfileField
            label="Trang web cá nhân"
            value={form.personalWebsite}
            fieldName="personalWebsite"
            onClick={handleFieldClick}
          />
          <ProfileField
            label="GitHub"
            value={form.github}
            fieldName="github"
            onClick={handleFieldClick}
          />
          <ProfileField
            label="LinkedIn"
            value={form.linkedin}
            fieldName="linkedin"
            onClick={handleFieldClick}
          />
          <ProfileField
            label="Facebook"
            value={form.facebook}
            fieldName="facebook"
            onClick={handleFieldClick}
          />
          <ProfileField
            label="YouTube"
            value={form.youtube}
            fieldName="youtube"
            onClick={handleFieldClick}
          />
        </div>
      </div>

      {/* Email (không thể chỉnh sửa) */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
        <div className="p-4">
          <div className="text-sm font-medium text-gray-900">Email</div>
          <div className="text-sm text-gray-500 mt-1">{user?.email}</div>
        </div>
      </div>

      {/* Modal chỉnh sửa */}
      {currentFieldConfig && (
        <EditModal
          isOpen={!!editingField}
          onClose={handleClose}
          title={currentFieldConfig.title}
          description={currentFieldConfig.description}
          label={currentFieldConfig.label}
          value={tempValue}
          onChange={setTempValue}
          onSubmit={handleSubmit}
          loading={loading}
          success={success}
          error={error}
          placeholder={currentFieldConfig.placeholder}
          isTextarea={currentFieldConfig.isTextarea}
          showPreview={currentFieldConfig.showPreview}
          fieldName={editingField || ""}
        />
      )}
    </div>
  );
}
