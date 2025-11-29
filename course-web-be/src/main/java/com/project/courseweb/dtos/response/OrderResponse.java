package com.project.courseweb.dtos.response;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
public class OrderResponse {
    Long id;
    String orderRef;
    BigDecimal amount;
    String status;
    String paymentGateway;
    String payDate;
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
    LocalDateTime createdAt;

    // Thông tin người mua
    Long profileId;
    String profileFullName;

    // Thông tin khóa học
    Long courseId;
    String courseTitle;
}
