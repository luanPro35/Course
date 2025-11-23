package com.project.courseweb.services.implement;

import com.project.courseweb.configurations.VnPayConfig;
import com.project.courseweb.dtos.response.CreatePaymentResponse;
import com.project.courseweb.dtos.response.VnPayIPNResponse;
import com.project.courseweb.entities.Order;
import com.project.courseweb.enums.ErrorCode;
import com.project.courseweb.enums.OrderStatus;
import com.project.courseweb.exceptions.AppException;
import com.project.courseweb.repositories.OrderRepository;
import com.project.courseweb.repositories.https.VnPayClient;
import com.project.courseweb.services.CourseService;
import com.project.courseweb.services.EnrollmentService;
import com.project.courseweb.services.ProfileService;
import com.project.courseweb.services.VnPayService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Component
@Slf4j
public class VnPayServiceImpl implements VnPayService {

    CourseService courseService;
    ProfileService profileService;
    OrderRepository orderRepository;
    EnrollmentService enrollmentService;
    VnPayConfig vnPayConfig;

    VnPayClient vnPayClient;

    @Override
    @Transactional
    public CreatePaymentResponse createPayment(Long id, HttpServletRequest httpServletRequest) {
        var course = this.courseService.findCourseById(id);

        if (course == null || course.getPrice() == null || course.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new AppException(ErrorCode.COURSE_NOT_FOUND);
        }
        var profile = this.profileService.getProfileById(profileService.getId());

        var order = Order.builder()
                .profile(profile)
                .course(course)
                .amount(course.getPrice())
                .orderRef(UUID.randomUUID().toString())
                .paymentGateway("VNPay")
                .build();

        orderRepository.save(order);


        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", "2.1.0");
        vnp_Params.put("vnp_Command", "pay");
        vnp_Params.put("vnp_TmnCode", vnPayConfig.getTmnCode());
        vnp_Params.put("vnp_Amount", String.valueOf(course.getPrice().multiply(new BigDecimal(100)).longValue()));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", order.getOrderRef());
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang " + order.getOrderRef());
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
        vnp_Params.put("vnp_IpAddr", httpServletRequest.getRemoteAddr());

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        vnp_Params.put("vnp_CreateDate", formatter.format(cld.getTime()));

        String queryUrl = VnPayUtils.getQueryUrl(vnp_Params, vnPayConfig.getHashSecret());
        String paymentUrl = vnPayConfig.getUrl() + "?" + queryUrl;

        return CreatePaymentResponse.builder()
                .paymentUrl(paymentUrl)
                .build();
    }

    @Override
    @Transactional
    public VnPayIPNResponse handleVnPayIPN(Map<String, String> allRequestParams) {
        String vnp_SecureHash = allRequestParams.remove("vnp_SecureHash");
        String calculatedHash = VnPayUtils.hmacSHA512(vnPayConfig.getHashSecret(), VnPayUtils.getHashData(allRequestParams));
        if (!calculatedHash.equals(vnp_SecureHash)) {
            return new VnPayIPNResponse("02", "Invalid Signature");
        }
        String vnp_TxnRef = allRequestParams.get("vnp_TxnRef");
        var order = orderRepository.findByOrderRef(vnp_TxnRef).orElse(null);

        if (order == null) {
            return new VnPayIPNResponse("01", "Order not found");
        }

        if (!OrderStatus.PENDING.equals(order.getStatus())) {
            return new VnPayIPNResponse("02", "Order already confirmed");
        }

        long requestAmount = Long.parseLong(allRequestParams.get("vnp_Amount"));
        long orderAmount = order.getAmount().multiply(new BigDecimal(100)).longValue();
        if (requestAmount != orderAmount) {
            return new VnPayIPNResponse("04", "Invalid amount");
        }

        String vnp_ResponseCode = allRequestParams.get("vnp_ResponseCode");
        if ("00".equals(vnp_ResponseCode)) {
            order.setPayDate(allRequestParams.get("vnp_PayDate"));
            order.setGatewayTransId(allRequestParams.get("vnp_TransactionNo"));

            order.setStatus(OrderStatus.PAID);
            this.orderRepository.save(order);

            // enrollment
            try {
                enrollmentService.enrollInCourseVip(order.getCourse(), order.getProfile());
                order.setStatus(OrderStatus.FULFILLED);
                this.orderRepository.save(order);
            } catch (Exception e) {
                log.error("Enrollment failed: {}", e.getMessage());
            }

            return new VnPayIPNResponse("00", "Transaction successful");
        } else {
            order.setStatus(OrderStatus.FAILED);
            orderRepository.save(order);
            return new VnPayIPNResponse("99", "Transaction failed");
        }
    }


    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void refundPayment(Long orderId) {
        Order order = this.orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        if (!order.getStatus().equals(OrderStatus.FAILED)) {
            throw new IllegalStateException("Chỉ có thể hoàn tiền cho đơn hàng ghi danh thất bại. Trạng thái hiện tại: " + order.getStatus());
        }

        Map<String, String> vnp_Params = new TreeMap<>();
        vnp_Params.put("vnp_RequestId", UUID.randomUUID().toString());
        vnp_Params.put("vnp_Version", "2.1.0");
        vnp_Params.put("vnp_Command", "refund");
        vnp_Params.put("vnp_TmnCode", vnPayConfig.getTmnCode());
        vnp_Params.put("vnp_TransactionType", "02");
        vnp_Params.put("vnp_TxnRef", order.getOrderRef());
        vnp_Params.put("vnp_Amount", String.valueOf(order.getAmount().multiply(new BigDecimal(100)).longValue()));
        vnp_Params.put("vnp_OrderInfo", "Hoan tien cho don hang " + order.getOrderRef());
        vnp_Params.put("vnp_TransactionNo", order.getGatewayTransId());
        vnp_Params.put("vnp_TransactionDate", order.getPayDate());
        vnp_Params.put("vnp_CreateBy", "admin_system");
        String createDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        vnp_Params.put("vnp_CreateDate", createDate);
        vnp_Params.put("vnp_IpAddr", "127.0.0.1");//local
        //process
        String hashData = VnPayUtils.getPipeDelimitedHashData(vnp_Params);
        String calculatedHash = VnPayUtils.hmacSHA512(vnPayConfig.getHashSecret(), hashData);
        vnp_Params.put("vnp_SecureHash", calculatedHash);

        // call VnPay
        var response = vnPayClient.callRefund(vnp_Params).block();
        log.info("Response: {}", response);
        if (response != null && "00".equals(response.getRspCode())) {
            order.setStatus(OrderStatus.REFUND);
            this.orderRepository.save(order);
            log.info("Hoàn tiền thành công cho orderId: {}", orderId);
        } else {
            String message = response != null ? response.getMessage() : "Response is null";
            String rspCode = response != null ? response.getRspCode() : "N/A";
            log.error("Hoàn tiền thất bại từ VNPAY. Mã lỗi: {}, Thông điệp: {}", rspCode, message);
            throw new RuntimeException("Hoàn tiền thất bại: " + message);
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public String checkVnPayTransactionStatus(Long orderId) {
        log.info("Bắt đầu kiểm tra trạng thái giao dịch VNPAY cho orderId: {}", orderId);
        Order order = this.orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        Map<String, String> vnp_Params = new TreeMap<>();
        vnp_Params.put("vnp_RequestId", UUID.randomUUID().toString());
        vnp_Params.put("vnp_Version", "2.1.0");
        vnp_Params.put("vnp_Command", "querydr");
        vnp_Params.put("vnp_TmnCode", vnPayConfig.getTmnCode());
        vnp_Params.put("vnp_TxnRef", order.getOrderRef());
        vnp_Params.put("vnp_OrderInfo", "Kiem tra ket qua giao dich " + order.getOrderRef());
        vnp_Params.put("vnp_TransactionDate", order.getPayDate());

        String createDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        vnp_Params.put("vnp_CreateDate", createDate);
        vnp_Params.put("vnp_IpAddr", "127.0.0.1");

        String hashData = VnPayUtils.getPipeDelimitedHashDataForQuery(vnp_Params);
        String calculatedHash = VnPayUtils.hmacSHA512(vnPayConfig.getHashSecret(), hashData);
        vnp_Params.put("vnp_SecureHash", calculatedHash);

        var response = vnPayClient.callQueryDr(vnp_Params).block();

        if (response == null || !"00".equals(response.getResponseCode())) {
            throw new RuntimeException("VNPAY từ chối yêu cầu truy vấn. Lý do: " + (response != null ? response.getMessage() : "Response is null"));
        }

        String vnpayStatus = response.getTransactionStatus();
        String localStatus = order.getStatus().name();

        if ("PENDING".equals(localStatus) && "00".equals(vnpayStatus)) {
            order.setGatewayTransId(response.getTransactionNo()); // Cập nhật lại mã giao dịch VNPAY
            enrollmentService.enrollInCourseVip(order.getCourse(), order.getProfile());
            order.setStatus(OrderStatus.FULFILLED);
            this.orderRepository.save(order);
        }

        return "Mã trạng thái: " + vnpayStatus + " (00: Thành công, 01: Chưa hoàn tất, 02: Lỗi)";
    }
}
