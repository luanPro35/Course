package com.project.courseweb.dtos.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
public class CourseLabelResponse {
    Long id;
    String title;
    String description;
    String thumbnailUrl;
    BigDecimal price;
    String creator;
    LocalDateTime updatedAt;
    String status;
    String courseType;
}
