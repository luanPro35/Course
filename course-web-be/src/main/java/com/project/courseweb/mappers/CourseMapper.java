package com.project.courseweb.mappers;

import com.project.courseweb.dtos.request.CourseCreateRequest;
import com.project.courseweb.dtos.request.CourseIngredientUpdateRequest;
import com.project.courseweb.dtos.response.CourseLabelResponse;
import com.project.courseweb.dtos.response.CourseResponse;
import com.project.courseweb.entities.Course;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CourseMapper {
    @Mapping(target = "creator", source = "creator.fullName")
    CourseResponse toResponse(Course course);

    @Mapping(target = "creator", source = "creator.fullName")
    CourseLabelResponse toLabelResponse(Course course);

    Course toEntity(CourseCreateRequest request);

    void updateCourseIngredient(@MappingTarget Course course, CourseIngredientUpdateRequest request);
}