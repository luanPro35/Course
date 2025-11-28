package com.project.courseweb.dtos.request;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
public class CourseUpdateRequest {
    String title;
    String description;
    String thumbnailUrl;
    BigDecimal price;
    String badge;
    String titleHighlight;
    String subtitle;
    String subtitleHighlights; 
    String stats; 
    String learningOutcomes;
}
