package com.project.courseweb.controllers;

import com.project.courseweb.dtos.ApiResponse;
import com.project.courseweb.dtos.PageResponse;
import com.project.courseweb.dtos.response.CourseEnrollmentResponse;
import com.project.courseweb.dtos.response.EnrollmentResponse;
import com.project.courseweb.enums.SuccessCode;
import com.project.courseweb.services.EnrollmentService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/enrollments")
public class EnrollmentController {
    EnrollmentService enrollmentService;

    @PostMapping("/free/{courseId}")
    ApiResponse<EnrollmentResponse> enrollInFreeCourse(@PathVariable Long courseId) {
        return ApiResponse.ok(this.enrollmentService.enrollInFreeCourse(courseId), SuccessCode.ENROLL_COURSE_SUCCESS);
    }

    @GetMapping("/courses")
    ApiResponse<PageResponse<CourseEnrollmentResponse>> getListCourseEnrollment(Pageable pageable) {
        return ApiResponse.ok(this.enrollmentService.getListCourseEnrollment(pageable), SuccessCode.GET_LIST_COURSE_ENROLLMENT_SUCCESS);
    }
}
