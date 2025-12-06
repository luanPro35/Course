package com.project.notification;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentSuccessEvent {
    String email;
    String fullName;
    Long courseId;
    String courseName;
    String orderRef;
}
