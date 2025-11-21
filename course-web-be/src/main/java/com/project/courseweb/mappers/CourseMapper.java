package com.project.courseweb.mappers;

import com.project.courseweb.dtos.request.CourseCreateRequest;
import com.project.courseweb.dtos.response.CourseResponse;
import com.project.courseweb.entities.Course;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CourseMapper {
    @Mapping(target = "creator", source = "creator.fullName")
    CourseResponse toResponse(Course course);

    Course toEntity(CourseCreateRequest request);
}
