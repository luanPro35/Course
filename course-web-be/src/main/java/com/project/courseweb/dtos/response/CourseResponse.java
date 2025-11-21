package com.project.courseweb.dtos.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
public class CourseResponse {
    String id;
    String title;
    String description;
    BigDecimal price;
    String thumbnailUrl;
    List<SectionResponse> sections;
    String creator;
    String status;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
