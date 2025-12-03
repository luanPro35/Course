package com.project.courseweb.controllers;

import com.project.courseweb.dtos.ApiResponse;
import com.project.courseweb.dtos.response.CreatePaymentResponse;
import com.project.courseweb.dtos.response.TransactionStatusResponse;
import com.project.courseweb.dtos.response.VnPayIPNResponse;
import com.project.courseweb.enums.SuccessCode;
import com.project.courseweb.services.VnPayService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentController {
    VnPayService vnPayService;

    @PostMapping("/{id}")
    ApiResponse<CreatePaymentResponse> createPayment(@PathVariable Long id, HttpServletRequest httpServletRequest) {
        return ApiResponse.ok(this.vnPayService.createPayment(id, httpServletRequest), SuccessCode.CREATE_PAYMENT);
    }

    @GetMapping("/vnp-ipn")
    ApiResponse<VnPayIPNResponse> handleVnPayIPN(@RequestParam Map<String, String> allRequestParams) {
        return ApiResponse.ok(vnPayService.handleVnPayIPN(allRequestParams), SuccessCode.VN_PAY_IPN_SUCCESS);
    }

    @GetMapping("/vnp-return")
    public void handleVnpayReturn(@RequestParam Map<String, String> allRequestParams, HttpServletResponse response) throws IOException {
        String frontendUrl = "http://localhost:3000/payment/return";

        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(frontendUrl);
        for (Map.Entry<String, String> entry : allRequestParams.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            if (key != null && value != null) {
                builder.queryParam(key, value);
            }
        }
        response.sendRedirect(builder.toUriString());
    }


    @PostMapping("/refund/{orderId}")
    ApiResponse<Void> refundPayment(@PathVariable Long orderId) {
        this.vnPayService.refundPayment(orderId);
        return ApiResponse.ok(null, SuccessCode.REFUND_SUCCESS);
    }

    @GetMapping("/{orderId}/status")
    ApiResponse<TransactionStatusResponse> checkTransactionStatus(@PathVariable Long orderId) {
        return ApiResponse.ok(this.vnPayService.checkVnPayTransactionStatus(orderId), SuccessCode.CHECK_TRANSACTION_STATUS_SUCCESS);
    }
}
