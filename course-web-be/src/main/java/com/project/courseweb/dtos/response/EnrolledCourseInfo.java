package com.project.courseweb.dtos.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EnrolledCourseInfo {
    Long courseId;
    String courseTitle;
    String courseThumbnail;
    LocalDateTime enrolledAt;
}
