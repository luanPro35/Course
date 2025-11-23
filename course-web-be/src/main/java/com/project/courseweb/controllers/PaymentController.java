package com.project.courseweb.controllers;

import com.project.courseweb.dtos.ApiResponse;
import com.project.courseweb.dtos.response.CreatePaymentResponse;
import com.project.courseweb.dtos.response.VnPayIPNResponse;
import com.project.courseweb.enums.ErrorCode;
import com.project.courseweb.enums.SuccessCode;
import com.project.courseweb.services.VnPayService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentController {
    VnPayService paymentService;

    @PostMapping("/{id}")
    ApiResponse<CreatePaymentResponse> createPayment(@PathVariable Long id, HttpServletRequest httpServletRequest) {
        return ApiResponse.ok(this.paymentService.createPayment(id, httpServletRequest), SuccessCode.CREATE_PAYMENT);
    }

    @GetMapping("/vnp-ipn")
    ApiResponse<VnPayIPNResponse> handleVnPayIPN(@RequestParam Map<String, String> allRequestParams) {
        return ApiResponse.ok(paymentService.handleVnPayIPN(allRequestParams), SuccessCode.VN_PAY_IPN_SUCCESS);
    }

    @GetMapping("/vnp-return")
    public ApiResponse<String> handleVnpayReturn(@RequestParam Map<String, String> allRequestParams) {
        String vnp_ResponseCode = allRequestParams.get("vnp_ResponseCode");
        if ("00".equals(vnp_ResponseCode)) {
            // Thanh toán thành công, trả về thông báo cho người dùng thấy trên trình duyệt
            return ApiResponse.ok("Giao dich thanh cong", SuccessCode.PAYMENT_SUCCESS);
        } else {
            // Thanh toán thất bại
            return ApiResponse.error("Giao dich that bai", ErrorCode.AUTHENTICATION_FAILED); // Bạn có thể tạo ErrorCode mới
        }
    }

    @PostMapping("/refund/{orderId}")
    ApiResponse<Void> refundPayment(@PathVariable Long orderId) {
        this.paymentService.refundPayment(orderId);
        return ApiResponse.ok(null, SuccessCode.REFUND_SUCCESS);
    }

    @GetMapping("/{orderId}/status")
    ApiResponse<String> checkTransactionStatus(@PathVariable Long orderId) {
        return ApiResponse.ok(this.paymentService.checkVnPayTransactionStatus(orderId), SuccessCode.CHECK_TRANSACTION_STATUS_SUCCESS);
    }
}
