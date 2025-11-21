package com.project.courseweb.mappers;

import com.project.courseweb.dtos.request.LessonCreateRequest;
import com.project.courseweb.dtos.response.LessonResponse;
import com.project.courseweb.entities.Lesson;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface LessonMapper {
    LessonResponse toResponse(Lesson lesson);

    Lesson toEntity(LessonCreateRequest request);
}
