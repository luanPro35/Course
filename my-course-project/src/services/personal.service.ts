import { Information } from "@/types/information.types";

export const getPersonal = async (): Promise<Information[]> => {
  const res = await fetch("/api/personal");

  if (!res.ok) {
    throw new Error("Failed to fetch personal");
  }

  return res.json();
};

export const savePersonalInfo = async (data: Information): Promise<{ success: boolean; message?: string; data?: Information }> => {
  try {
    const response = await fetch("/api/personal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Lưu thông tin thất bại");
    }

    return {
      success: true,
      data: result.data as Information,
      message: "Lưu thông tin thành công"
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Đã xảy ra lỗi không mong muốn",
    };
  }
};
