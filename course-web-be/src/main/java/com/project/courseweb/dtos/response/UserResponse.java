package com.project.courseweb.dtos.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    Long id;
    String fullName;
    String email;
    String phone;
    String avatar;
    LocalDateTime createdAt;
    Set<String> roles;
    List<CourseEnrollmentResponse> enrolledCourses;
}
