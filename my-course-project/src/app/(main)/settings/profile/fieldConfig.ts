export interface FieldConfig {
  title: string;
  label: string;
  description: string;
  placeholder: string;
  isTextarea?: boolean;
  showPreview?: boolean;
}

export const fieldConfigs: Record<string, FieldConfig> = {
  fullName: {
    title: "Cập nhật tên của bạn",
    label: "Họ và tên",
    description:
      "Tên sẽ được hiển thị trên trang cá nhân, trong các bình luận và bài viết của bạn.",
    placeholder: "Nhập họ và tên của bạn",
  },
  username: {
    title: "Cập nhật tên người dùng",
    label: "Tên người dùng",
    description:
      "Tên khác được hiển thị bên cạnh họ và tên của bạn trên trang cá nhân.",
    placeholder: "Nhập tên người dùng của bạn",
  },
  about: {
    title: "Cập nhật giới thiệu",
    label: "Giới thiệu",
    description: "Mô tả ngắn về bản thân bạn.",
    placeholder: "Viết vài dòng về bản thân bạn...",
    isTextarea: true,
  },
  avatar: {
    title: "Cập nhật ảnh đại diện",
    label: "URL ảnh đại diện",
    description: "URL ảnh đại diện của bạn.",
    placeholder: "https://example.com/avatar.jpg",
    showPreview: true,
  },
  personalWebsite: {
    title: "Cập nhật trang web cá nhân",
    label: "Trang web cá nhân",
    description: "Liên kết tới trang web cá nhân của bạn.",
    placeholder: "https://yourwebsite.com",
  },
  github: {
    title: "Cập nhật GitHub",
    label: "GitHub",
    description: "Liên kết tới trang GitHub của bạn.",
    placeholder: "https://github.com/username",
  },
  linkedin: {
    title: "Cập nhật LinkedIn",
    label: "LinkedIn",
    description: "Liên kết tới trang LinkedIn của bạn.",
    placeholder: "https://linkedin.com/in/username",
  },
  facebook: {
    title: "Cập nhật Facebook",
    label: "Facebook",
    description: "Liên kết tới trang Facebook của bạn.",
    placeholder: "https://facebook.com/username",
  },
  youtube: {
    title: "Cập nhật YouTube",
    label: "YouTube",
    description: "Liên kết tới kênh YouTube của bạn.",
    placeholder: "https://youtube.com/@username",
  },
};
