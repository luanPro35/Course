package com.project.courseweb.services;

import com.project.courseweb.dtos.PageResponse;
import com.project.courseweb.dtos.request.CourseCreateRequest;
import com.project.courseweb.dtos.request.CourseIngredientUpdateRequest;
import com.project.courseweb.dtos.request.CourseUpdateRequest;
import com.project.courseweb.dtos.response.CourseLabelResponse;
import com.project.courseweb.dtos.response.CourseResponse;
import com.project.courseweb.dtos.response.FileResponse;
import com.project.courseweb.entities.Course;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public interface CourseService {
    CourseResponse createCourse(CourseCreateRequest request);

    FileResponse uploadCourseThumbnail(MultipartFile file);

    CourseResponse updateCourseInfo(Long id, CourseUpdateRequest request);

    CourseResponse updateCourseIngredient(Long id, CourseIngredientUpdateRequest request);

    CourseResponse updateStatusCourse(Long id, String status);

    PageResponse<CourseLabelResponse> getCoursesByStatus(String status, Pageable pageable);

    CourseResponse getCourseById(Long id);

    void deleteCourse(Long id);

    CourseResponse getPublishedCourseById(Long id);

    PageResponse<CourseLabelResponse> getCoursesByStatusPublished(Pageable pageable);

    Course findCourseById(Long id);

    PageResponse<CourseLabelResponse> getAllCourses(Pageable pageable);
}
