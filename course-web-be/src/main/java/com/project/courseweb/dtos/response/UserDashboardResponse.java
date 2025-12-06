package com.project.courseweb.dtos.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserDashboardResponse {
    Long id;
    String fullName;
    String email;
    String phone;
    String avatar;
    LocalDateTime createdAt;
    Set<String> roles;
    Set<CourseEnrollmentResponse> enrolledCourses;
}
