package com.project.courseweb.dtos.response;

import com.fasterxml.jackson.annotation.JsonFormat;
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
    String badge;
    String titleHighlight;
    String subtitle;
    String subtitleHighlights;
    String stats;
    String learningOutcomes;

    List<SectionResponse> sections;
    String creator;
    String status;
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
    LocalDateTime createdAt;
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
    LocalDateTime updatedAt;
}
