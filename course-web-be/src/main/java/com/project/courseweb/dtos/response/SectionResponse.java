package com.project.courseweb.dtos.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
public class SectionResponse {
    String id;
    String title;
    Integer orderIndex;
    List<LessonResponse> lessons;
}
