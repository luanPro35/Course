export interface CreatePaymentResponse {
  paymentUrl: string;
  orderId: number;
  amount: number;
  orderInfo: string;
}

export interface PaymentStatusResponse {
  status: string;
  message: string;
}

export const createPayment = async (
  courseId: string | number,
  token: string
): Promise<CreatePaymentResponse> => {
  try {
    const response = await fetch(
      `http://localhost:8080/project/payment/${courseId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Không thể tạo thanh toán");
    }

    const result = await response.json();
    console.log("Backend payment response:", result);
    console.log("Payment data:", result.data);
    return result.data;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};

export const checkPaymentStatus = async (
  orderId: number,
  token: string
): Promise<string> => {
  try {
    const response = await fetch(
      `http://localhost:8080/project/payment/${orderId}/status`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Không thể kiểm tra trạng thái thanh toán"
      );
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error checking payment status:", error);
    throw error;
  }
};

export const refundPayment = async (
  orderId: number,
  token: string
): Promise<void> => {
  try {
    const response = await fetch(
      `http://localhost:8080/project/payment/refund/${orderId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Không thể hoàn tiền");
    }
  } catch (error) {
    console.error("Error refunding payment:", error);
    throw error;
  }
};
