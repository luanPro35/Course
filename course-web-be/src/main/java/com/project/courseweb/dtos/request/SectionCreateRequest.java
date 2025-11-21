package com.project.courseweb.dtos.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
public class SectionCreateRequest {
    String title;
    int orderIndex;
    List<LessonCreateRequest> lessons;
}
