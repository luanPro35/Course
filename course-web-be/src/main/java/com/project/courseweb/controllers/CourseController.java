package com.project.courseweb.controllers;

import com.project.courseweb.dtos.ApiResponse;
import com.project.courseweb.dtos.response.CourseResponse;
import com.project.courseweb.enums.SuccessCode;
import com.project.courseweb.services.CourseService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/courses")
public class CourseController {
    CourseService courseService;

    @GetMapping("/{id}")
    ApiResponse<CourseResponse> getCoursePublish(@PathVariable Long id) {
        return ApiResponse.ok(this.courseService.getPublishedCourseById(id), SuccessCode.GET_COURSE_SUCCESS);
    }
}
