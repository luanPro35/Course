package com.project.courseweb.dtos.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EnrollmentResponse {
    Long id;
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
    LocalDateTime enrollmentDate;

    Long courseId;
    String courseTitle;
    Long profileId;
    String profileFullName;
}