package com.project.courseweb.services;

import com.project.courseweb.dtos.response.CreatePaymentResponse;
import com.project.courseweb.dtos.response.TransactionStatusResponse;
import com.project.courseweb.dtos.response.VnPayIPNResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public interface VnPayService {
    CreatePaymentResponse createPayment(Long id, HttpServletRequest httpServletRequest);

    VnPayIPNResponse handleVnPayIPN(Map<String, String> map);

    void refundPayment(Long paymentId);

    TransactionStatusResponse checkVnPayTransactionStatus(Long orderId);
}
