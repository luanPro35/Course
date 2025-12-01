import {
  getListOrderURL,
  refundMoneyURL,
  checkOrderURL,
} from "./api.service";

export interface OrderResponse {
  id: number;
  orderRef: string;
  userId: number;
  courseId: number;
  courseName: string;
  courseThumbnail: string;
  amount: number;
  status: "PENDING" | "COMPLETED" | "REFUNDED" | "FAILED";
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

/**
 * Lấy danh sách tất cả đơn hàng (Admin only)
 */
export const getAllOrders = async (
  token: string,
  page: number = 0,
  size: number = 25
): Promise<PageResponse<OrderResponse>> => {
  try {
    const response = await fetch(getListOrderURL(page, size), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Không thể lấy danh sách đơn hàng");
    }

    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error("Error fetching orders:", err);
    throw err instanceof Error ? err : new Error("Không thể lấy danh sách đơn hàng");
  }
};

/**
 * Hoàn tiền cho đơn hàng (Admin only)
 */
export const refundOrder = async (
  orderId: number,
  token: string
): Promise<void> => {
  try {
    const response = await fetch(refundMoneyURL(orderId), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Không thể hoàn tiền");
    }
  } catch (err) {
    console.error("Error refunding order:", err);
    throw err instanceof Error ? err : new Error("Không thể hoàn tiền");
  }
};

/**
 * Kiểm tra trạng thái đơn hàng
 */
export const checkOrderStatus = async (
  orderId: number,
  token: string
): Promise<string> => {
  try {
    const response = await fetch(checkOrderURL(orderId), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Không thể kiểm tra trạng thái đơn hàng"
      );
    }

    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error("Error checking order status:", err);
    throw err instanceof Error ? err : new Error("Không thể kiểm tra trạng thái đơn hàng");
  }
};
