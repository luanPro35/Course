package com.project.courseweb.dtos.response;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EnrollmentResponse {
    Long id;
    LocalDateTime enrollmentDate;

    Long courseId;
    String courseTitle;
    Long profileId;
    String profileFullName;
}