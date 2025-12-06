package com.project.courseweb.dtos.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
public class LessonResponse {
    String id;
    String title;
    String contentUrl;
    Integer orderIndex;
    Integer durationInMinutes;
}
