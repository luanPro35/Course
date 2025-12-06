package com.project.courseweb.services;

import com.project.courseweb.dtos.PageResponse;
import com.project.courseweb.dtos.response.OrderResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public interface OrderService {
    PageResponse<OrderResponse> getAllOrders(Pageable pageable);
}
