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
public class CourseIngredientUpdateRequest {
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
    List<SectionCreateRequest> sections;
}
