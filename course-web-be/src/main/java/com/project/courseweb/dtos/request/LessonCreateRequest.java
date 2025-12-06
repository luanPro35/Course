package com.project.courseweb.dtos.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
public class LessonCreateRequest {
    String title;
    String contentUrl;
    int orderIndex;
    Long durationInMinutes;
}
