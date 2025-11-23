package com.project.courseweb.services.implement;

import com.project.courseweb.dtos.PageResponse;
import com.project.courseweb.dtos.response.OrderResponse;
import com.project.courseweb.repositories.OrderRepository;
import com.project.courseweb.services.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@Component
public class OrderServiceImpl implements OrderService {
    OrderRepository orderRepository;

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public PageResponse<OrderResponse> getAllOrders(Pageable pageable) {
        var orders = this.orderRepository.findAll(pageable);
        return PageResponse.<OrderResponse>builder()
                .pageNo(pageable.getPageNumber())
                .pageSize(pageable.getPageSize())
                .totalElements(orders.getTotalElements())
                .totalPages(orders.getTotalPages())
                .content(orders.stream()
                        .map(order -> OrderResponse.builder()
                                .id(order.getId())
                                .orderRef(order.getOrderRef())
                                .amount(order.getAmount())
                                .status(order.getStatus().name())
                                .paymentGateway(order.getPaymentGateway())
                                .payDate(order.getPayDate())
                                .createdAt(order.getCreatedAt())
                                .profileId(order.getProfile().getId())
                                .profileFullName(order.getProfile().getFullName())
                                .courseId(order.getCourse().getId())
                                .courseTitle(order.getCourse().getTitle())
                                .build())
                        .toList())
                .build();
    }
}
