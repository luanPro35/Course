package com.project.courseweb.mappers;

import com.project.courseweb.dtos.response.EnrollmentResponse;
import com.project.courseweb.entities.Enrollment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EnrollmentMapper {
    @Mapping(target = "courseId", source = "course.id")
    @Mapping(target = "courseTitle", source = "course.title")
    @Mapping(target = "profileId", source = "profile.id")
    @Mapping(target = "profileFullName", source = "profile.fullName")
    EnrollmentResponse toResponse(Enrollment enrollment);
}