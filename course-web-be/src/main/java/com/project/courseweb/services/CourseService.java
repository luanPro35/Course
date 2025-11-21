package com.project.courseweb.services;

import com.project.courseweb.dtos.request.CourseCreateRequest;
import com.project.courseweb.dtos.response.CourseResponse;
import org.springframework.stereotype.Service;

@Service
public interface CourseService {
    CourseResponse createCourse(CourseCreateRequest request);

    CourseResponse getCourseById(Long id);

    CourseResponse getPublishedCourseById(Long id);

    void deleteCourse(Long id);
}
