package com.project.courseweb.dtos.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
public class CourseCreateRequest {
    String title;
    String description;
    BigDecimal price;
    String thumbnailUrl;
    List<SectionCreateRequest> sections;
}
