package com.project.courseweb.controllers;

import com.project.courseweb.dtos.ApiResponse;
import com.project.courseweb.dtos.request.CourseCreateRequest;
import com.project.courseweb.dtos.response.CourseResponse;
import com.project.courseweb.enums.SuccessCode;
import com.project.courseweb.services.CourseService;
import com.project.courseweb.services.PostService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/admin")
public class AdminController {
    PostService postService;
    CourseService courseService;

    @PostMapping("/courses/create")
    ApiResponse<CourseResponse> createCourse(@RequestBody CourseCreateRequest request) {
        return ApiResponse.ok(this.courseService.createCourse(request), SuccessCode.CREATE_COURSE_SUCCESS);
    }

    @GetMapping("/courses/get/{id}")
    ApiResponse<CourseResponse> getCourseById(@PathVariable Long id) {
        return ApiResponse.ok(this.courseService.getCourseById(id), SuccessCode.GET_COURSE_SUCCESS);
    }

    @DeleteMapping("/courses/delete/{id}")
    ApiResponse<Void> deleteCourse(@PathVariable Long id) {
        this.courseService.deleteCourse(id);
        return ApiResponse.ok(null, SuccessCode.DELETE_COURSE_SUCCESS);
    }
}
